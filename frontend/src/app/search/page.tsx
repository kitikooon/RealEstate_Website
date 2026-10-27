import { Suspense } from "react";
import SearchClient from "@/components/SearchClient";

export const metadata = { title: "ค้นหาอสังหาริมทรัพย์บนแผนที่ | RealEstate" };

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-500">กำลังโหลด…</div>}>
      <SearchClient />
    </Suspense>
  );
}
