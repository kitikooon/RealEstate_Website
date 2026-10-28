"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import FilterFields from "./FilterFields";
import { api } from "@/lib/api";
import { LISTING_LABEL, PROPERTY_TYPE_LABEL, priceFull } from "@/lib/format";
import type { ListingType, PropertyListItem, SearchFilters } from "@/lib/types";

const FETCH_SIZE = 100; // the API's maximum page size; the top 3 are picked from these
const TOP = 3;

interface Row extends PropertyListItem {
  pricePerArea: number | null;
}

type MetricKey = "price" | "pricePerArea" | "area" | "bedrooms" | "bathrooms";
type RankKey = "value" | "price" | "area";

const RANKS: { key: RankKey; label: string; hint: string }[] = [
  { key: "value", label: "คุ้มที่สุด", hint: "ราคาต่อตร.ม. ต่ำสุด" },
  { key: "price", label: "ราคาถูกที่สุด", hint: "ราคาต่ำสุด" },
  { key: "area", label: "ใหญ่ที่สุด", hint: "พื้นที่มากสุด" },
];

const BETTER: Record<MetricKey, "low" | "high"> = { price: "low", pricePerArea: "low", area: "high", bedrooms: "high", bathrooms: "high" };

const ROWS: { label: string; metric?: MetricKey; text: (r: Row) => string }[] = [
  { label: "ประเภท", text: (r) => PROPERTY_TYPE_LABEL[r.propertyType] },
  { label: "ราคา", metric: "price", text: (r) => priceFull(r.price, r.listingType) },
  {
    label: "ราคา / ตร.ม.",
    metric: "pricePerArea",
    text: (r) =>
      r.pricePerArea === null ? "-" : `฿${Math.round(r.pricePerArea).toLocaleString("th-TH")}${r.listingType === "Rent" ? "/เดือน" : ""}`,
  },
  { label: "ขนาด (ตร.ม.)", metric: "area", text: (r) => r.area.toLocaleString("th-TH") },
  { label: "ห้องนอน", metric: "bedrooms", text: (r) => (r.bedrooms > 0 ? String(r.bedrooms) : "-") },
  { label: "ห้องน้ำ", metric: "bathrooms", text: (r) => (r.bathrooms > 0 ? String(r.bathrooms) : "-") },
  { label: "ทำเล", text: (r) => `${r.district}, ${r.province}` },
  { label: "ที่อยู่", text: (r) => r.address || "-" },
];

function rank(list: Row[], by: RankKey): Row[] {
  const score = (r: Row): number | null => (by === "value" ? r.pricePerArea : by === "price" ? r.price : r.area > 0 ? -r.area : null);
  return list
    .map((r) => ({ r, s: score(r) }))
    .filter((x): x is { r: Row; s: number } => x.s !== null)
    .sort((a, b) => a.s - b.s)
    .slice(0, TOP)
    .map((x) => x.r);
}

const labelCell = "w-28 bg-slate-50 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 md:w-36";

export default function CompareClient() {
  const [filters, setFilters] = useState<SearchFilters>({ listingType: "Sale" });
  const [result, setResult] = useState<{ items: PropertyListItem[]; total: number; listing: ListingType } | null>(null);
  const [rankBy, setRankBy] = useState<RankKey>("value");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ctrl = useRef<AbortController | null>(null);

  const invalidPrice = Boolean(filters.minPrice && filters.maxPrice && filters.minPrice > filters.maxPrice);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (invalidPrice) return;
    ctrl.current?.abort();
    const c = new AbortController();
    ctrl.current = c;
    setLoading(true);
    setError(null);
    try {
      const page = await api.search({ ...filters, sort: "PriceAsc" }, 1, FETCH_SIZE, c.signal);
      setResult({ items: page.items, total: page.total, listing: filters.listingType ?? "Sale" });
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาด");
    } finally {
      if (ctrl.current === c) setLoading(false);
    }
  };

  // Price per sqm is not shown for rentals, so "best value" is not offered there either.
  const isRent = result?.listing === "Rent";
  const ranks = isRent ? RANKS.filter((r) => r.key !== "value") : RANKS;
  const activeRank: RankKey = isRent && rankBy === "value" ? "price" : rankBy;

  const top = useMemo(() => {
    const rows: Row[] = (result?.items ?? []).map((p) => ({ ...p, pricePerArea: p.area > 0 ? p.price / p.area : null }));
    return rank(rows, activeRank);
  }, [result, activeRank]);

  // Best value per metric among the shown properties, to highlight. Zero (e.g. land has no bedrooms) never counts.
  const best = useMemo(() => {
    const out: Partial<Record<MetricKey, number>> = {};
    if (top.length < 2) return out;
    for (const m of Object.keys(BETTER) as MetricKey[]) {
      const vals = top.map((r) => r[m]).filter((v): v is number => v !== null && v > 0);
      if (vals.length > 0) out[m] = BETTER[m] === "low" ? Math.min(...vals) : Math.max(...vals);
    }
    return out;
  }, [top]);

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-5 py-8 md:py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-navy md:text-4xl">เปรียบเทียบทรัพย์</h1>
          <p className="mt-2 text-slate-600">เลือกขอบเขตที่สนใจ แล้วดู 3 อันดับที่ดีที่สุดเทียบกันเป็นตาราง</p>
        </div>
      </div>

      <form onSubmit={submit} className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-6">
        <div className="mb-4 inline-flex rounded-lg bg-slate-100 p-1">
          {(["Sale", "Rent"] as ListingType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setFilters({ ...filters, listingType: t })}
              className={`rounded-md px-6 py-1.5 text-sm font-semibold ${filters.listingType === t ? "bg-navy text-white" : "text-slate-600"}`}
            >
              {t === "Sale" ? "ซื้อ" : "เช่า"}
            </button>
          ))}
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FilterFields value={filters} onChange={setFilters} extended />
        </div>
        {invalidPrice && <p className="mt-2 text-sm text-red-600">ราคาต่ำสุดต้องไม่มากกว่าราคาสูงสุด</p>}
        <div className="mt-5 flex items-center gap-4">
          <button
            type="submit"
            disabled={invalidPrice || loading}
            className="rounded-lg bg-navy px-10 py-3 font-semibold text-white hover:bg-navy-soft disabled:opacity-50"
          >
            {loading ? "กำลังค้นหา…" : "เปรียบเทียบ"}
          </button>
          <button
            type="button"
            onClick={() => setFilters({ listingType: filters.listingType })}
            className="text-sm text-slate-500 underline-offset-2 hover:underline"
          >
            ล้างตัวกรอง
          </button>
        </div>
      </form>

      <section className="mt-8 flex flex-1 flex-col" aria-live="polite">
        {error && <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">{error}</div>}

        {!result && !error && (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            เลือกตัวกรองแล้วกด &quot;เปรียบเทียบ&quot; เพื่อดูทรัพย์ที่ดีที่สุด 3 อันดับ
          </div>
        )}

        {result && !error && top.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-2xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            ไม่พบทรัพย์ที่เข้าข่าย ลองปรับตัวกรองให้กว้างขึ้น
          </div>
        )}

        {result && !error && top.length > 0 && (
          <>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex rounded-lg bg-white p-1 ring-1 ring-slate-200">
                {ranks.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    title={r.hint}
                    onClick={() => setRankBy(r.key)}
                    className={`rounded-md px-4 py-1.5 text-sm font-semibold ${activeRank === r.key ? "bg-navy text-white" : "text-slate-600"}`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-500">
                จัดอันดับจาก {result.items.length.toLocaleString("th-TH")}
                {result.total > result.items.length ? ` (จากทั้งหมด ${result.total.toLocaleString("th-TH")})` : ""} รายการที่เข้าข่าย ·{" "}
                {RANKS.find((r) => r.key === activeRank)?.hint} · ค่าสีเขียวคือดีที่สุดในกลุ่ม
              </p>
            </div>

            <div className="flex-1 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
              <table className="h-full w-full min-w-[720px] table-fixed border-collapse">
                <thead>
                  <tr>
                    <th className={`${labelCell} align-bottom`} />
                    {top.map((r, i) => (
                      <th key={r.id} className="border-l border-slate-200 p-0 text-left align-top font-normal">
                        <Link href={`/properties/${r.id}`} className="group block">
                          <span className="relative block aspect-[16/10] w-full overflow-hidden bg-slate-200">
                            {r.coverImage && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={r.coverImage}
                                alt={r.title}
                                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            )}
                            <span className="absolute left-3 top-3 rounded-full bg-black/60 px-3 py-1 font-[family-name:var(--font-serif)] text-sm text-white backdrop-blur">
                              อันดับ {i + 1}
                            </span>
                            {r.isDemo && (
                              <span className="absolute bottom-3 left-3 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900">DEMO</span>
                            )}
                          </span>
                          <span className="block px-4 py-4 text-base font-semibold text-slate-900 group-hover:underline">{r.title}</span>
                        </Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.filter((row) => !(isRent && row.metric === "pricePerArea")).map((row) => (
                    <tr key={row.label} className="border-t border-slate-200">
                      <th scope="row" className={labelCell}>
                        {row.label}
                      </th>
                      {top.map((r) => {
                        const isBest = row.metric !== undefined && best[row.metric] !== undefined && r[row.metric] === best[row.metric];
                        return (
                          <td
                            key={r.id}
                            className={`border-l border-slate-200 px-4 py-3 text-sm ${
                              isBest ? "bg-emerald-50 font-semibold text-emerald-800" : "text-slate-700"
                            }`}
                          >
                            {row.text(r)}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  <tr className="border-t border-slate-200">
                    <th scope="row" className={labelCell} />
                    {top.map((r) => (
                      <td key={r.id} className="border-l border-slate-200 px-4 py-4">
                        <Link
                          href={`/properties/${r.id}`}
                          className="block rounded-lg bg-navy py-2.5 text-center text-sm font-semibold !text-white hover:bg-navy-soft"
                        >
                          ดูรายละเอียด
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs text-slate-500">เปรียบเทียบเฉพาะทรัพย์ประเภท{LISTING_LABEL[result.listing]} เพื่อให้ราคาเทียบกันได้</p>
          </>
        )}
      </section>
    </div>
  );
}
