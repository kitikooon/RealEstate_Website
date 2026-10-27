import Link from "next/link";
import { LISTING_LABEL, PROPERTY_TYPE_LABEL, priceFull } from "@/lib/format";
import type { PropertyListItem } from "@/lib/types";

interface Props {
  property: PropertyListItem;
  selected?: boolean;
  /** When given, clicking the card selects the listing (map view) in addition to the link. */
  onSelect?: (id: number) => void;
}

export default function PropertyCard({ property: p, selected, onSelect }: Props) {
  return (
    <article
      onClick={onSelect ? () => onSelect(p.id) : undefined}
      className={`overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md ${
        selected ? "border-navy ring-2 ring-navy" : "border-slate-200"
      } ${onSelect ? "cursor-pointer" : ""}`}
    >
      <div className="relative aspect-[4/3] bg-slate-100">
        {p.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.coverImage} alt={p.title} loading="lazy" className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-slate-400">ไม่มีรูปภาพ</div>
        )}
        <span className="absolute left-2 top-2 rounded bg-navy px-2 py-0.5 text-xs font-semibold text-white">
          {LISTING_LABEL[p.listingType]}
        </span>
        {p.isDemo && (
          <span className="absolute right-2 top-2 rounded bg-amber-400 px-2 py-0.5 text-xs font-semibold text-slate-900">DEMO</span>
        )}
      </div>
      <div className="p-4">
        <div className="text-lg font-bold text-navy">{priceFull(p.price, p.listingType)}</div>
        <h3 className="mt-1 line-clamp-1 font-medium text-slate-800">{p.title}</h3>
        <p className="line-clamp-1 text-sm text-slate-500">
          {p.district}, {p.province}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
          <span>{PROPERTY_TYPE_LABEL[p.propertyType]}</span>
          {p.bedrooms > 0 && <span>{p.bedrooms} นอน</span>}
          {p.bathrooms > 0 && <span>{p.bathrooms} น้ำ</span>}
          <span>{p.area.toLocaleString("th-TH")} ตร.ม.</span>
        </div>
        <Link
          href={`/properties/${p.id}`}
          onClick={(e) => e.stopPropagation()}
          className="mt-3 inline-block text-sm font-medium text-navy hover:underline"
        >
          ดูรายละเอียด →
        </Link>
      </div>
    </article>
  );
}
