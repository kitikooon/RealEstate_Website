"use client";

import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useMemo, useRef, useState } from "react";
import type { GeoJSONSource, Map as MlMap, Marker } from "maplibre-gl";
import { DEFAULT_VIEW, getMapProvider } from "@/lib/mapProvider";
import { priceFull, priceLabel } from "@/lib/format";
import { TYPE_COLOR, iconSvg } from "@/lib/markerStyle";
import type { Bounds, PropertyListItem } from "@/lib/types";

interface Props {
  items: PropertyListItem[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
  /** Fired after every movement; `byUser` is false for programmatic moves (fit/fly/reset). */
  onBoundsChange?: (bounds: Bounds, byUser: boolean) => void;
  /** Fly to this listing whenever `nonce` changes. */
  focus: { id: number; nonce: number } | null;
  /** Fit the viewport to all items whenever the items change. */
  autoFit: boolean;
  /** Increment to return to the starting view. */
  resetNonce: number;
  /** When true, resize the map (used when its container is revealed on mobile). */
  visible?: boolean;
}

type PointProps = { id: number };

/** Roughly Thailand's extent plus a margin: [west, south], [east, north]. */
const THAILAND_BOUNDS: [[number, number], [number, number]] = [
  [96.8, 4.8],
  [106.2, 21.0],
];

/** Warm light grey for low buildings shading to cool blue-grey for towers. */
const BUILDING_COLOR = [
  "interpolate", ["linear"], ["coalesce", ["get", "render_height"], 8],
  0, "#efe9df",
  30, "#e3dfd9",
  80, "#d2d8e2",
  200, "#b9c3d3",
] as const;

function popupContent(p: PropertyListItem): HTMLElement {
  const root = document.createElement("div");
  root.className = "w-64 overflow-hidden rounded-3xl bg-white/90 backdrop-blur-xl";
  if (p.coverImage) {
    const img = document.createElement("img");
    img.src = p.coverImage;
    img.alt = "";
    img.className = "h-32 w-full object-cover";
    root.appendChild(img);
  }
  const body = document.createElement("div");
  body.className = "p-4";
  const title = document.createElement("div");
  title.className = "line-clamp-1 text-base font-semibold text-slate-900";
  title.textContent = p.title;
  const price = document.createElement("div");
  price.className = "mt-1 text-2xl font-bold text-slate-900";
  price.textContent = priceFull(p.price, p.listingType);
  const loc = document.createElement("div");
  loc.className = "mt-1 text-xs text-slate-500";
  loc.textContent = `${p.address}, ${p.district}, ${p.province}`;
  const link = document.createElement("a");
  link.href = `/properties/${p.id}`;
  link.className = "mt-3 block rounded-full bg-black py-2 text-center text-sm font-medium !text-white";
  link.textContent = "ดูรายละเอียด";
  body.append(title, price, loc, link);
  root.appendChild(body);
  return root;
}

export default function MapView({ items, selectedId, onSelect, onBoundsChange, focus, autoFit, resetNonce, visible = true }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<MlMap | null>(null);
  const mlRef = useRef<typeof import("maplibre-gl") | null>(null);
  const markersRef = useRef<Map<string, { marker: Marker; el: HTMLElement; id?: number }>>(new Map());
  const itemsRef = useRef<Map<number, PropertyListItem>>(new Map());
  const callbacks = useRef({ onSelect, onBoundsChange });
  const selectedRef = useRef<number | null>(selectedId);
  const markSelectedRef = useRef<() => void>(() => {});
  const popupRef = useRef<import("maplibre-gl").Popup | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const provider = useMemo(() => getMapProvider(), []);

  useEffect(() => {
    callbacks.current = { onSelect, onBoundsChange };
  });

  // Create the map once.
  useEffect(() => {
    let cancelled = false;
    let map: MlMap | null = null;
    const markers = markersRef.current;

    (async () => {
      try {
        const ml = await import("maplibre-gl");
        if (cancelled || !containerRef.current) return;
        mlRef.current = ml;
        // Serve the worker from /public: bundlers (Turbopack) fail to resolve it ("Worker failed to load").
        ml.setWorkerUrl("/maplibre/maplibre-gl-worker.mjs");
        const m = new ml.Map({
          container: containerRef.current,
          style: provider.style,
          center: DEFAULT_VIEW.center,
          zoom: DEFAULT_VIEW.zoom,
          pitch: provider.supports3D ? DEFAULT_VIEW.pitch : 0,
          bearing: provider.supports3D ? DEFAULT_VIEW.bearing : 0,
          maxPitch: 80,
          // Keep the view on Thailand (with a small margin) and prevent zooming out to the whole region.
          maxBounds: THAILAND_BOUNDS,
          minZoom: 5.2,
        });
        map = m;
        mapRef.current = m;
        m.addControl(new ml.NavigationControl({ visualizePitch: true }), "top-right");
        m.addControl(new ml.GeolocateControl({ trackUserLocation: false }), "top-right");

        // The style references POI icons its sprite lacks; use a transparent pixel instead of warning for each.
        m.on("styleimagemissing", (e) => {
          if (!m.hasImage(e.id)) m.addImage(e.id, { width: 1, height: 1, data: new Uint8Array(4) });
        });

        m.on("error", (e) => {
          const status = (e.error as { status?: number } | undefined)?.status;
          if (status === 401 || status === 403) setError("MapTiler API key ไม่ถูกต้องหรือไม่ได้รับอนุญาต");
          else if (!m.loaded()) setError(`โหลดแผนที่ไม่สำเร็จ: ${(e.error as Error | undefined)?.message ?? "ไม่ทราบสาเหตุ"}`);
        });

        m.on("load", () => {
          if (provider.supports3D) enable3D(m);
          void addCountryMask(m);

          m.addSource("props", {
            type: "geojson",
            data: { type: "FeatureCollection", features: [] },
            cluster: true,
            clusterRadius: 55,
            clusterMaxZoom: 14,
          });
          // Invisible layer: required so querySourceFeatures can read the source.
          m.addLayer({ id: "props-query", type: "circle", source: "props", paint: { "circle-opacity": 0, "circle-radius": 1 } });

          const sync = () => syncMarkers(ml);
          m.on("sourcedata", (e) => {
            if (e.sourceId === "props" && e.isSourceLoaded) sync();
          });
          m.on("move", sync);
          m.on("moveend", (e) => {
            const b = m.getBounds();
            callbacks.current.onBoundsChange?.(
              { west: b.getWest(), south: b.getSouth(), east: b.getEast(), north: b.getNorth() },
              Boolean((e as { originalEvent?: unknown }).originalEvent),
            );
          });
          setReady(true);
        });
      } catch {
        setError("ไม่สามารถโหลดแผนที่ได้ (WebGL อาจไม่รองรับหรือถูกปิดอยู่)");
      }
    })();

    function enable3D(m: MlMap) {
      try {
        if (provider.terrainUrl) {
          m.addSource("dem", { type: "raster-dem", url: provider.terrainUrl, tileSize: 256 });
          m.setTerrain({ source: "dem", exaggeration: 1.3 });
        } else if (provider.terrainTiles) {
          m.addSource("dem", {
            type: "raster-dem",
            tiles: provider.terrainTiles,
            tileSize: 256,
            maxzoom: 14,
            encoding: provider.terrainEncoding ?? "mapbox",
          });
          m.setTerrain({ source: "dem", exaggeration: 1.3 });
        }
        if (m.getSource("dem")) addRelief(m);
        const style = m.getStyle();
        // Some styles already ship their own 3D building layer: recolour it to soft grey.
        const own = style.layers.filter((l) => l.type === "fill-extrusion");
        if (own.length > 0) {
          for (const l of own) {
            m.setPaintProperty(l.id, "fill-extrusion-color", BUILDING_COLOR as unknown as string);
            m.setPaintProperty(l.id, "fill-extrusion-opacity", 0.96);
          }
          return;
        }
        const vectorSource = Object.entries(style.sources).find(([, s]) => s.type === "vector")?.[0];
        if (vectorSource) {
          m.addLayer({
            id: "buildings-3d",
            type: "fill-extrusion",
            source: vectorSource,
            "source-layer": "building",
            minzoom: 13,
            paint: {
              "fill-extrusion-color": BUILDING_COLOR as unknown as string,
              "fill-extrusion-height": ["coalesce", ["get", "render_height"], 8],
              "fill-extrusion-base": ["coalesce", ["get", "render_min_height"], 0],
              "fill-extrusion-opacity": 0.96,
            },
          });
        }
      } catch {
        setError("เปิดโหมด 3D ไม่สำเร็จ แสดงเป็นแผนที่ปกติแทน");
      }
    }

    /** Dim everything outside Thailand using the border polygon in /public/thailand.geo.json. */
    async function addCountryMask(m: MlMap) {
      try {
        const res = await fetch("/thailand.geo.json");
        if (!res.ok) return;
        const geo = (await res.json()) as { geometry: { coordinates: number[][][][] } };
        const holes = geo.geometry.coordinates.map((poly) => poly[0]);
        if (cancelled) return;
        m.addSource("th-mask", {
          type: "geojson",
          data: {
            type: "Feature",
            properties: {},
            geometry: {
              type: "Polygon",
              coordinates: [
                [[-180, -85], [180, -85], [180, 85], [-180, 85], [-180, -85]],
                ...holes,
              ],
            },
          },
        });
        m.addLayer({ id: "th-mask-fill", type: "fill", source: "th-mask", paint: { "fill-color": "#e7ecf2", "fill-opacity": 0.78 } });
        m.addLayer({
          id: "th-border",
          type: "line",
          source: "th-mask",
          paint: { "line-color": "#13315c", "line-width": 1.2, "line-opacity": 0.5 },
        });
      } catch {
        // The mask is cosmetic; the map still works without it.
      }
    }

    /** Hillshade for mountains plus sky/haze for depth when the map is tilted. */
    function addRelief(m: MlMap) {
      try {
        const firstSymbol = m.getStyle().layers.find((l) => l.type === "symbol")?.id;
        m.addLayer(
          {
            id: "relief-hillshade",
            type: "hillshade",
            source: "dem",
            paint: {
              "hillshade-exaggeration": 0.45,
              "hillshade-shadow-color": "#3b4a3a",
              "hillshade-highlight-color": "#fffdf5",
              "hillshade-accent-color": "#6b7a5e",
            },
          },
          firstSymbol,
        );
        m.setSky({
          "sky-color": "#8ec5f0",
          "horizon-color": "#e8f2fb",
          "fog-color": "#eaf1f7",
          "sky-horizon-blend": 0.6,
          "horizon-fog-blend": 0.6,
          "fog-ground-blend": 0.4,
        });
      } catch {
        // Relief is cosmetic; ignore if the style or version does not support it.
      }
    }

    function syncMarkers(ml: typeof import("maplibre-gl")) {
      if (!map || !map.getSource("props")) return;
      const features = map.querySourceFeatures("props");
      const seen = new Set<string>();
      for (const f of features) {
        if (f.geometry.type !== "Point") continue;
        const [lng, lat] = f.geometry.coordinates as [number, number];
        const fp = f.properties as { cluster?: boolean; cluster_id?: number; point_count?: number } & Partial<PointProps>;
        const key = fp.cluster ? `c${fp.cluster_id}` : `p${fp.id}`;
        if (seen.has(key)) continue;
        seen.add(key);
        if (markers.has(key)) continue;

        const el = document.createElement("button");
        el.type = "button";
        let id: number | undefined;
        if (fp.cluster) {
          el.className = "pin pin-cluster";
          el.innerHTML = `<span class="pin-halo"><span class="pin-core" style="background:#c9d3e6">${iconSvg("Cluster", 22)}</span><span class="pin-badge">${fp.point_count}</span></span>`;
          const clusterId = fp.cluster_id!;
          el.addEventListener("click", async (ev) => {
            ev.stopPropagation();
            const src = map?.getSource("props") as GeoJSONSource | undefined;
            if (!src || !map) return;
            const zoom = await src.getClusterExpansionZoom(clusterId);
            map.easeTo({ center: [lng, lat], zoom: zoom + 0.5 });
          });
        } else {
          id = fp.id!;
          const item = itemsRef.current.get(id);
          if (!item) continue;
          el.className = "pin";
          el.dataset.id = String(id);
          el.innerHTML = `<span class="pin-halo"><span class="pin-core" style="background:${TYPE_COLOR[item.propertyType]}">${iconSvg(item.propertyType)}</span></span><span class="pin-price"></span>`;
          el.querySelector(".pin-price")!.textContent = priceLabel(item.price, item.listingType);
          el.addEventListener("click", (ev) => {
            ev.stopPropagation();
            callbacks.current.onSelect(item.id);
          });
        }
        const marker = new ml.Marker({ element: el, anchor: "center" }).setLngLat([lng, lat]).addTo(map);
        markers.set(key, { marker, el, id });
      }
      for (const [key, m] of markers) {
        if (!seen.has(key)) {
          m.marker.remove();
          markers.delete(key);
        }
      }
      markSelected();
    }

    function markSelected() {
      for (const m of markers.values()) {
        m.el.classList.toggle("selected", m.id !== undefined && m.id === selectedRef.current);
      }
    }
    markSelectedRef.current = markSelected;

    return () => {
      cancelled = true;
      for (const m of markers.values()) m.marker.remove();
      markers.clear();
      map?.remove();
      mapRef.current = null;
      setReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Push items into the clustered source and optionally fit to them.
  useEffect(() => {
    const map = mapRef.current;
    const ml = mlRef.current;
    if (!ready || !map || !ml) return;
    itemsRef.current = new Map(items.map((p) => [p.id, p]));
    // Drop markers: ids may now belong to different items, so rebuild from scratch.
    for (const m of markersRef.current.values()) m.marker.remove();
    markersRef.current.clear();
    (map.getSource("props") as GeoJSONSource).setData({
      type: "FeatureCollection",
      features: items.map((p) => ({
        type: "Feature",
        geometry: { type: "Point", coordinates: [p.longitude, p.latitude] },
        properties: { id: p.id },
      })),
    });
    if (autoFit && items.length > 0) {
      const b = new ml.LngLatBounds();
      items.forEach((p) => b.extend([p.longitude, p.latitude]));
      const { clientWidth: w, clientHeight: h } = map.getContainer();
      // Padding is clamped to the canvas size; oversized padding makes fitBounds throw.
      if (w > 0 && h > 0) {
        const side = Math.min(60, w * 0.1);
        map.fitBounds(b, { padding: { top: Math.min(100, h * 0.15), bottom: Math.min(260, h * 0.3), left: side, right: side }, maxZoom: 14, duration: 800 });
      }
    }
    // autoFit intentionally not a dependency: only refit when the items change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, ready]);

  // Selection: highlight, popup and fly.
  useEffect(() => {
    selectedRef.current = selectedId;
    markSelectedRef.current();
    popupRef.current?.remove();
    popupRef.current = null;
    const map = mapRef.current;
    const ml = mlRef.current;
    if (!ready || !map || !ml || selectedId === null) return;
    const item = itemsRef.current.get(selectedId);
    if (!item) return;
    popupRef.current = new ml.Popup({ offset: 18, closeButton: true, maxWidth: "none" })
      .setLngLat([item.longitude, item.latitude])
      .setDOMContent(popupContent(item))
      .addTo(map);
    const popup = popupRef.current;
    popup.on("close", () => {
      if (selectedRef.current === selectedId) callbacks.current.onSelect(null);
    });
  }, [selectedId, ready, items]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || !focus) return;
    const item = itemsRef.current.get(focus.id);
    if (!item) return;
    map.flyTo({ center: [item.longitude, item.latitude], zoom: Math.max(map.getZoom(), 15.5), pitch: provider.supports3D ? 60 : 0, duration: 1400, padding: { bottom: Math.min(200, map.getContainer().clientHeight * 0.25) } });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focus?.nonce, ready]);

  useEffect(() => {
    const map = mapRef.current;
    if (!ready || !map || resetNonce === 0) return;
    map.flyTo({
      center: DEFAULT_VIEW.center,
      zoom: DEFAULT_VIEW.zoom,
      pitch: provider.supports3D ? DEFAULT_VIEW.pitch : 0,
      bearing: provider.supports3D ? DEFAULT_VIEW.bearing : 0,
      duration: 1200,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetNonce]);

  useEffect(() => {
    if (visible) mapRef.current?.resize();
  }, [visible]);

  return (
    <div className="map-mono relative h-full w-full">
      {/* Inline style: maplibre-gl.css sets .maplibregl-map { position: relative } and would override Tailwind utilities. */}
      <div ref={containerRef} style={{ position: "absolute", inset: 0 }} />
      {!ready && !error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100 text-sm text-slate-500">กำลังโหลดแผนที่…</div>
      )}
      {error && (
        <div className="absolute inset-x-3 top-3 z-10 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
      )}
      {provider.notice && !error && (
        <div className="pointer-events-none absolute bottom-6 left-3 z-10 max-w-xs rounded-md bg-white/90 px-3 py-2 text-xs text-slate-600 shadow">
          {provider.notice}
        </div>
      )}
    </div>
  );
}
