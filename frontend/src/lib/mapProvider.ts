import type { StyleSpecification } from "maplibre-gl";

/**
 * Map provider abstraction. Add a provider by implementing `MapProviderConfig`
 * and registering it in `PROVIDERS`; the map component only reads this config.
 */
export interface MapProviderConfig {
  id: string;
  /** Style URL or inline style object for MapLibre GL. */
  style: string | StyleSpecification;
  /** True when the style supports terrain + building extrusion (vector tiles + DEM). */
  supports3D: boolean;
  /** TileJSON URL of DEM tiles used for terrain, if supported. */
  terrainUrl?: string;
  /** Raw DEM tile templates (alternative to terrainUrl) and their encoding. */
  terrainTiles?: string[];
  terrainEncoding?: "mapbox" | "terrarium";
  attribution?: string;
  /** Human-readable reason when the provider is limited or unavailable. */
  notice?: string;
}

const OSM_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      maxzoom: 19,
      attribution: "© OpenStreetMap contributors",
    },
  },
  layers: [{ id: "osm", type: "raster", source: "osm" }],
};

function maptiler(key: string): MapProviderConfig {
  return {
    id: "maptiler",
    style: `https://api.maptiler.com/maps/streets-v2/style.json?key=${encodeURIComponent(key)}`,
    supports3D: true,
    terrainUrl: `https://api.maptiler.com/tiles/terrain-rgb-v2/tiles.json?key=${encodeURIComponent(key)}`,
  };
}

/** Free, keyless vector tiles (OpenFreeMap) + open elevation tiles (AWS Terrain Tiles): 3D with no API key. */
const OPENFREEMAP: MapProviderConfig = {
  id: "openfreemap",
  style: "https://tiles.openfreemap.org/styles/liberty",
  supports3D: true,
  terrainTiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
  terrainEncoding: "terrarium",
};

const OSM: MapProviderConfig = {
  id: "osm",
  style: OSM_STYLE,
  supports3D: false,
  notice:
    "กำลังใช้แผนที่ OpenStreetMap แบบ 2 มิติ (ยังไม่ได้ตั้งค่า NEXT_PUBLIC_MAPTILER_KEY จึงไม่มีอาคาร 3D และ terrain)",
};

export function getMapProvider(): MapProviderConfig {
  const key = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const wanted = process.env.NEXT_PUBLIC_MAP_PROVIDER ?? "maptiler";
  if (wanted === "osm") return OSM;
  if (wanted === "maptiler" && key) return maptiler(key);
  return OPENFREEMAP;
}

export const DEFAULT_VIEW = { center: [100.5018, 13.7563] as [number, number], zoom: 10.5, pitch: 55, bearing: -15 };
