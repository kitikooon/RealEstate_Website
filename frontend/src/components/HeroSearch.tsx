"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import FilterFields from "./FilterFields";
import { filtersToParams } from "@/lib/filters";
import type { ListingType, SearchFilters } from "@/lib/types";

export default function HeroSearch() {
  const router = useRouter();
  const [filters, setFilters] = useState<SearchFilters>({ listingType: "Sale" });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (filters.minPrice && filters.maxPrice && filters.minPrice > filters.maxPrice) return;
    router.push(`/search?${filtersToParams(filters).toString()}`);
  };

  const invalidPrice = Boolean(filters.minPrice && filters.maxPrice && filters.minPrice > filters.maxPrice);

  return (
    <form onSubmit={submit} className="glass-form relative mx-auto w-full max-w-5xl rounded-2xl border border-white/70 bg-white/50 p-4 shadow-[0_8px_32px_rgba(15,37,69,0.06)] backdrop-blur-xl md:p-6">
      <div className="mb-4 inline-flex rounded-lg bg-white/60 p-1 ring-1 ring-slate-200/60">
        {(["Sale", "Rent"] as ListingType[]).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setFilters({ ...filters, listingType: t })}
            className={`rounded-md px-5 py-1.5 text-sm font-semibold ${
              filters.listingType === t ? "bg-navy text-white" : "text-slate-600"
            }`}
          >
            {t === "Sale" ? "ซื้อ" : "เช่า"}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <FilterFields value={filters} onChange={setFilters} />
      </div>
      {invalidPrice && <p className="mt-2 text-sm text-red-600">ราคาต่ำสุดต้องไม่มากกว่าราคาสูงสุด</p>}
      <button
        type="submit"
        disabled={invalidPrice}
        className="mt-4 w-full rounded-lg bg-navy py-3 font-semibold text-white hover:bg-navy-soft disabled:opacity-50 md:w-auto md:px-10"
      >
        ค้นหา
      </button>
    </form>
  );
}
