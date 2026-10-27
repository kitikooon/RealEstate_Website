"use client";

import dynamic from "next/dynamic";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import FilterFields from "./FilterFields";
import MapCard from "./MapCard";
import PropertyCard from "./PropertyCard";
import { useAsync } from "@/hooks/useAsync";
import { api } from "@/lib/api";
import { filtersFromParams, filtersToParams } from "@/lib/filters";
import { PROPERTY_TYPE_LABEL } from "@/lib/format";
import type { Bounds, PropertyListItem, PropertyType, SearchFilters } from "@/lib/types";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-500">กำลังโหลดแผนที่…</div>,
});

const EMPTY: PropertyListItem[] = [];

const glass = "border border-white/60 bg-white/65 shadow-lg backdrop-blur-xl";
const pill = `${glass} rounded-full px-4 py-2 text-sm font-medium text-slate-800`;

export default function SearchClient() {
  const router = useRouter();
  const params = useSearchParams();
  const initial = useMemo(() => filtersFromParams(new URLSearchParams(params.toString())), [params]);

  const [draft, setDraft] = useState<SearchFilters>(initial);
  const [applied, setApplied] = useState<SearchFilters>(initial);
  const [showFilters, setShowFilters] = useState(false);
  const [showList, setShowList] = useState(false);
  // Start on the default 3D view; only re-fit the map after the filters change.
  const [fitOnItems, setFitOnItems] = useState(false);

  const [currentBounds, setCurrentBounds] = useState<Bounds | null>(null);
  const [areaBounds, setAreaBounds] = useState<Bounds | null>(null);
  const [movedByUser, setMovedByUser] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [focus, setFocus] = useState<{ id: number; nonce: number } | null>(null);
  const [resetNonce, setResetNonce] = useState(0);
  const railRef = useRef<HTMLDivElement>(null);

  const invalidPrice = Boolean(draft.minPrice && draft.maxPrice && draft.minPrice > draft.maxPrice);

  const key = JSON.stringify([applied, areaBounds]);
  const { data, loading, error } = useAsync<PropertyListItem[]>(
    async (signal) =>
      areaBounds ? api.map(applied, areaBounds, signal) : (await api.search(applied, 1, 100, signal)).items,
    key,
  );
  const items = data ?? EMPTY;

  const onBoundsChange = useCallback((b: Bounds, byUser: boolean) => {
    setCurrentBounds(b);
    if (byUser) setMovedByUser(true);
  }, []);

  const commit = (next: SearchFilters) => {
    setDraft(next);
    setApplied(next);
    setFitOnItems(true);
    setAreaBounds(null);
    setMovedByUser(false);
    setSelectedId(null);
    router.replace(`/search?${filtersToParams(next).toString()}`, { scroll: false });
  };

  const apply = () => {
    if (invalidPrice) return;
    commit(draft);
    setShowFilters(false);
  };

  const select = (id: number) => {
    setSelectedId(id);
    setFocus({ id, nonce: Date.now() });
  };

  // Keep the selected card visible in the rail (also when a pin was clicked).
  useEffect(() => {
    if (selectedId === null) return;
    railRef.current
      ?.querySelector(`[data-card-id="${selectedId}"]`)
      ?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [selectedId]);

  const showAreaButton = movedByUser && currentBounds !== null;

  return (
    <div className="relative h-[calc(100dvh-4rem)] overflow-hidden bg-slate-200">
      <div className="absolute inset-0">
      <MapView
        items={items}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onBoundsChange={onBoundsChange}
        focus={focus}
        autoFit={fitOnItems && areaBounds === null}
        resetNonce={resetNonce}
      />
      </div>

      {/* Top bar */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 flex flex-col gap-3 p-3 pr-16 md:p-5 md:pr-20">
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <div className={`${glass} flex items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4`}>
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-700">⌕</span>
            <span className="text-sm font-semibold text-slate-900">
              {loading ? "กำลังค้นหา…" : `${items.length.toLocaleString("th-TH")} รายการ`}
              {areaBounds ? " ในพื้นที่แผนที่" : ""}
            </span>
          </div>

          <div className={`${glass} inline-flex rounded-full p-1`}>
            {(["Sale", "Rent"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => commit({ ...draft, listingType: draft.listingType === t ? undefined : t })}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold ${draft.listingType === t ? "bg-black text-white" : "text-slate-700"}`}
              >
                {t === "Sale" ? "ซื้อ" : "เช่า"}
              </button>
            ))}
          </div>

          <select
            aria-label="ประเภทอสังหาริมทรัพย์"
            value={draft.propertyType ?? ""}
            onChange={(e) => commit({ ...draft, propertyType: (e.target.value || undefined) as PropertyType | undefined })}
            className={`${pill} appearance-none pr-8`}
          >
            <option value="">ทุกประเภท</option>
            {Object.entries(PROPERTY_TYPE_LABEL).map(([k, l]) => (
              <option key={k} value={k}>{l}</option>
            ))}
          </select>

          <button type="button" onClick={() => setShowFilters((v) => !v)} className={pill} aria-expanded={showFilters}>
            ตัวกรอง {showFilters ? "▲" : "▼"}
          </button>
          <button type="button" onClick={() => setShowList((v) => !v)} className={pill} aria-expanded={showList}>
            รายการทั้งหมด
          </button>
          {areaBounds && (
            <button type="button" onClick={() => setAreaBounds(null)} className={`${pill} text-navy`}>
              ล้างพื้นที่
            </button>
          )}
        </div>

        {showFilters && (
          <div className={`${glass} pointer-events-auto max-h-[55dvh] max-w-4xl overflow-y-auto rounded-3xl p-4`}>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <FilterFields value={draft} onChange={setDraft} extended />
            </div>
            {invalidPrice && <p className="mt-2 text-sm text-red-600">ราคาต่ำสุดต้องไม่มากกว่าราคาสูงสุด</p>}
            <div className="mt-3 flex gap-2">
              <button type="button" onClick={apply} disabled={invalidPrice} className="rounded-full bg-black px-6 py-2 text-sm font-semibold text-white disabled:opacity-50">
                ค้นหา
              </button>
              <button type="button" onClick={() => setDraft({ listingType: draft.listingType })} className="rounded-full bg-white/80 px-4 py-2 text-sm text-slate-700">
                ล้างตัวกรอง
              </button>
            </div>
          </div>
        )}

        {showAreaButton && (
          <div className="pointer-events-auto flex justify-center">
            <button
              type="button"
              onClick={() => {
                setAreaBounds(currentBounds);
                setMovedByUser(false);
              }}
              className="rounded-full bg-black px-5 py-2 text-sm font-semibold text-white shadow-xl"
            >
              ค้นหาในพื้นที่นี้
            </button>
          </div>
        )}
      </div>

      {/* Full list drawer */}
      {showList && (
        <aside className={`${glass} absolute bottom-[200px] left-3 top-28 z-20 w-[calc(100%-1.5rem)] overflow-y-auto rounded-3xl p-3 sm:w-[380px] md:left-5`}>
          {items.length === 0 ? (
            <p className="p-6 text-center text-sm text-slate-500">ไม่มีรายการ</p>
          ) : (
            <div className="space-y-3">
              {items.map((p) => (
                <PropertyCard
                  key={p.id}
                  property={p}
                  selected={p.id === selectedId}
                  onSelect={(id) => {
                    select(id);
                    setShowList(false);
                  }}
                />
              ))}
            </div>
          )}
        </aside>
      )}

      {/* Reset view */}
      <button
        type="button"
        onClick={() => {
          setResetNonce((n) => n + 1);
          setSelectedId(null);
        }}
        className={`${pill} absolute bottom-[196px] right-3 z-20 md:right-5`}
      >
        ตำแหน่งเริ่มต้น
      </button>

      {/* Bottom card rail */}
      <div className="absolute inset-x-0 bottom-0 z-20 pb-4">
        {error ? (
          <div className="mx-4 rounded-3xl border border-red-200 bg-red-50/95 p-4 text-sm text-red-700 backdrop-blur">
            ค้นหาไม่สำเร็จ: {error}
            <div className="mt-1">ตรวจสอบว่า API และ SQL Server ทำงานอยู่</div>
          </div>
        ) : !loading && items.length === 0 ? (
          <div className={`${glass} mx-auto max-w-md rounded-3xl p-5 text-center text-sm text-slate-600`}>
            ไม่พบประกาศที่ตรงกับเงื่อนไข
            <div className="mt-1 text-xs">ลองปรับตัวกรอง หรือเลื่อนแผนที่ไปพื้นที่อื่น</div>
          </div>
        ) : (
          <div ref={railRef} className="no-scrollbar flex snap-x gap-4 overflow-x-auto px-4 pb-1 pt-2 md:px-5">
            {loading && items.length === 0
              ? [0, 1, 2].map((i) => <div key={i} className="h-[150px] w-[320px] shrink-0 animate-pulse rounded-[28px] bg-white/60" />)
              : items.map((p) => <MapCard key={p.id} property={p} selected={p.id === selectedId} onSelect={select} />)}
          </div>
        )}
      </div>
    </div>
  );
}
