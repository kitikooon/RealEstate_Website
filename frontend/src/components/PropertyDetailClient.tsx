"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useMemo, useState } from "react";
import PropertyCard from "./PropertyCard";
import { useAsync } from "@/hooks/useAsync";
import { api } from "@/lib/api";
import { LISTING_LABEL, PROPERTY_TYPE_LABEL, priceFull } from "@/lib/format";
import type { PropertyDetail } from "@/lib/types";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => <div className="flex h-full items-center justify-center bg-slate-100 text-sm text-slate-500">กำลังโหลดแผนที่…</div>,
});

function Gallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);
  if (images.length === 0)
    return <div className="flex aspect-[16/9] items-center justify-center rounded-xl bg-slate-100 text-slate-400">ไม่มีรูปภาพ</div>;
  return (
    <div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[active]} alt={`${title} รูปที่ ${active + 1}`} className="aspect-[16/9] w-full rounded-xl object-cover" />
      {images.length > 1 && (
        <div className="mt-2 flex gap-2 overflow-x-auto">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`รูปที่ ${i + 1}`}
              className={`h-16 w-24 shrink-0 overflow-hidden rounded-md border-2 ${i === active ? "border-navy" : "border-transparent"}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center">
      <div className="text-lg font-bold text-navy">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

export default function PropertyDetailClient({ id }: { id: number }) {
  const { data: p, loading, error } = useAsync((s) => api.detail(id, s), `detail-${id}`);
  const nearby = useAsync((s) => api.nearby(id, 4, s), `nearby-${id}`);

  const mapItems = useMemo(() => (p ? [{ ...p, coverImage: p.images[0] ?? null }] : []), [p]);
  const focus = useMemo(() => (p ? { id: p.id, nonce: 1 } : null), [p]);

  if (loading) return <div className="mx-auto w-full max-w-6xl p-8"><div className="h-96 animate-pulse rounded-xl bg-slate-100" /></div>;

  if (error || !p) {
    const notFound = error?.includes("404");
    return (
      <div className="mx-auto max-w-xl p-12 text-center">
        <h1 className="text-xl font-bold text-navy">{notFound ? "ไม่พบประกาศนี้" : "โหลดข้อมูลไม่สำเร็จ"}</h1>
        <p className="mt-2 text-slate-500">{notFound ? "ประกาศอาจถูกลบหรือปิดการแสดงผลแล้ว" : error}</p>
        <Link href="/search" className="mt-6 inline-block rounded-md bg-navy px-6 py-2 text-white">กลับไปค้นหา</Link>
      </div>
    );
  }

  return <Detail p={p} nearby={nearby} mapItems={mapItems} focus={focus} />;
}

function Detail({
  p,
  nearby,
  mapItems,
  focus,
}: {
  p: PropertyDetail;
  nearby: ReturnType<typeof useAsync<import("@/lib/types").PropertyListItem[]>>;
  mapItems: import("@/lib/types").PropertyListItem[];
  focus: { id: number; nonce: number } | null;
}) {
  const agent = p.agent;
  const phone = agent?.phone?.replace(/[^\d+]/g, "");
  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-6">
      <Link href="/search" className="text-sm text-navy hover:underline">← กลับไปผลการค้นหา</Link>
      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_340px]">
        <div>
          <Gallery images={p.images} title={p.title} />
          <div className="mt-6">
            <span className="rounded bg-navy px-2 py-0.5 text-xs font-semibold text-white">{LISTING_LABEL[p.listingType]}</span>
            <h1 className="mt-2 text-2xl font-bold text-slate-900">{p.title}</h1>
            <p className="text-slate-500">{[p.address, p.district, p.province].filter(Boolean).join(", ")}</p>
            <div className="mt-2 text-3xl font-bold text-navy">{priceFull(p.price, p.listingType)}</div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="ประเภท" value={PROPERTY_TYPE_LABEL[p.propertyType]} />
            <Stat label="พื้นที่ (ตร.ม.)" value={p.area.toLocaleString("th-TH")} />
            <Stat label="ห้องนอน" value={String(p.bedrooms)} />
            <Stat label="ห้องน้ำ" value={String(p.bathrooms)} />
          </div>
          <h2 className="mt-8 text-lg font-bold text-navy">รายละเอียด</h2>
          <p className="mt-2 whitespace-pre-line text-slate-700">{p.description}</p>

          <h2 className="mt-8 text-lg font-bold text-navy">ตำแหน่งที่ตั้ง</h2>
          <div className="mt-2 h-80 overflow-hidden rounded-xl border border-slate-200">
            <MapView items={mapItems} selectedId={null} onSelect={() => { }} focus={focus} autoFit={false} resetNonce={0} />
          </div>
        </div>

        <aside className="h-fit rounded-xl border border-slate-200 p-5 lg:sticky lg:top-20">
          <h2 className="font-bold text-navy">ผู้ลงประกาศ</h2>
          {agent ? (
            <>
              <p className="mt-2 font-medium text-slate-800">{agent.name}</p>
              {agent.email && <p className="text-sm text-slate-500">{agent.email}</p>}
              <div className="mt-4 space-y-2">
                {phone && (
                  <a href={`tel:${phone}`} className="block rounded-md bg-navy py-2.5 text-center font-medium !text-white hover:bg-navy-soft">
                    โทร {agent.phone}
                  </a>
                )}
                {agent.lineId && (
                  <a
                    href={`https://line.me/ti/p/~${encodeURIComponent(agent.lineId)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block rounded-md bg-[#06c755] py-2.5 text-center font-medium !text-white"
                  >
                    LINE: {agent.lineId}
                  </a>
                )}
                {!phone && !agent.lineId && <p className="text-sm text-slate-500">ยังไม่มีช่องทางติดต่อ</p>}
              </div>
            </>
          ) : (
            <p className="mt-2 text-sm text-slate-500">ยังไม่มีข้อมูลผู้ลงประกาศ</p>
          )}
        </aside>
      </div>

      {nearby.data && nearby.data.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-lg font-bold text-navy">อสังหาริมทรัพย์ใกล้เคียง</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {nearby.data.map((n) => (
              <PropertyCard key={n.id} property={n} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
