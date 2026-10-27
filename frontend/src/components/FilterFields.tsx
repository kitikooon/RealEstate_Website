"use client";

import { PROPERTY_TYPE_LABEL } from "@/lib/format";
import type { PropertySort, PropertyType, SearchFilters } from "@/lib/types";

const PRICE_STEPS = [5_000, 10_000, 30_000, 100_000, 1_000_000, 3_000_000, 5_000_000, 10_000_000, 30_000_000, 100_000_000];

function stepLabel(v: number): string {
  if (v >= 1_000_000) return `฿${v / 1_000_000}M`;
  return `฿${v / 1_000}K`;
}

const field =
  "mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-navy focus:outline-none focus:ring-1 focus:ring-navy";
const label = "block text-xs font-medium text-slate-500";

interface Props {
  value: SearchFilters;
  onChange: (next: SearchFilters) => void;
  /** Search page shows every filter; the hero form keeps the short list. */
  extended?: boolean;
}

export default function FilterFields({ value, onChange, extended }: Props) {
  const set = (patch: Partial<SearchFilters>) => onChange({ ...value, ...patch });
  const num = (s: string) => (s === "" || s === "0" ? undefined : Number(s));

  return (
    <>
      <label className={label}>
        ทำเล / คำค้นหา
        <input
          className={field}
          placeholder="จังหวัด เขต/อำเภอ หรือชื่อโครงการ"
          maxLength={100}
          value={value.q ?? ""}
          onChange={(e) => set({ q: e.target.value || undefined })}
        />
      </label>
      <label className={label}>
        ประเภท
        <select
          className={field}
          value={value.propertyType ?? ""}
          onChange={(e) => set({ propertyType: (e.target.value || undefined) as PropertyType | undefined })}
        >
          <option value="">ทุกประเภท</option>
          {Object.entries(PROPERTY_TYPE_LABEL).map(([k, l]) => (
            <option key={k} value={k}>
              {l}
            </option>
          ))}
        </select>
      </label>
      <label className={label}>
        ราคาต่ำสุด
        <select className={field} value={value.minPrice ?? 0} onChange={(e) => set({ minPrice: num(e.target.value) })}>
          <option value={0}>ไม่มีขั้นต่ำ</option>
          {PRICE_STEPS.map((v) => (
            <option key={v} value={v}>
              {stepLabel(v)}
            </option>
          ))}
        </select>
      </label>
      <label className={label}>
        ราคาสูงสุด
        <select className={field} value={value.maxPrice ?? 0} onChange={(e) => set({ maxPrice: num(e.target.value) })}>
          <option value={0}>ไม่จำกัด</option>
          {PRICE_STEPS.map((v) => (
            <option key={v} value={v}>
              {stepLabel(v)}
            </option>
          ))}
        </select>
      </label>
      <label className={label}>
        ห้องนอน (ขั้นต่ำ)
        <select className={field} value={value.bedrooms ?? 0} onChange={(e) => set({ bedrooms: num(e.target.value) })}>
          {[0, 1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n === 0 ? "ทุกขนาด" : `${n}+`}
            </option>
          ))}
        </select>
      </label>
      {extended && (
        <>
          <label className={label}>
            ห้องน้ำ (ขั้นต่ำ)
            <select className={field} value={value.bathrooms ?? 0} onChange={(e) => set({ bathrooms: num(e.target.value) })}>
              {[0, 1, 2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n === 0 ? "ทุกขนาด" : `${n}+`}
                </option>
              ))}
            </select>
          </label>
          <label className={label}>
            จังหวัด
            <input
              className={field}
              maxLength={100}
              placeholder="เช่น เชียงใหม่"
              value={value.province ?? ""}
              onChange={(e) => set({ province: e.target.value || undefined })}
            />
          </label>
          <label className={label}>
            เขต/อำเภอ
            <input
              className={field}
              maxLength={100}
              placeholder="เช่น วัฒนา"
              value={value.district ?? ""}
              onChange={(e) => set({ district: e.target.value || undefined })}
            />
          </label>
          <label className={label}>
            เรียงตาม
            <select className={field} value={value.sort ?? "Relevance"} onChange={(e) => set({ sort: e.target.value as PropertySort })}>
              <option value="Relevance">ความเกี่ยวข้อง</option>
              <option value="Newest">ลงประกาศล่าสุด</option>
              <option value="PriceAsc">ราคา: ต่ำ → สูง</option>
              <option value="PriceDesc">ราคา: สูง → ต่ำ</option>
            </select>
          </label>
        </>
      )}
    </>
  );
}
