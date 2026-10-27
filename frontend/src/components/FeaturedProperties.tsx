"use client";

import { useAsync } from "@/hooks/useAsync";
import { api } from "@/lib/api";
import PropertyCard from "./PropertyCard";

export default function FeaturedProperties() {
  const { data, loading, error } = useAsync((s) => api.featured(6, s), "featured");

  if (loading)
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-xl bg-slate-100" />
        ))}
      </div>
    );
  if (error)
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        โหลดประกาศแนะนำไม่สำเร็จ: {error}
        <div className="mt-1 text-red-600">ตรวจสอบว่า API (ASP.NET Core) และ SQL Server ทำงานอยู่ และตั้งค่า NEXT_PUBLIC_API_URL ถูกต้อง</div>
      </div>
    );
  if (!data || data.length === 0)
    return <div className="rounded-lg bg-slate-50 p-6 text-center text-slate-500">ยังไม่มีประกาศแนะนำ</div>;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {data.map((p) => (
        <PropertyCard key={p.id} property={p} />
      ))}
    </div>
  );
}
