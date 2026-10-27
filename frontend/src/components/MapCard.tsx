import Link from "next/link";
import { LISTING_LABEL, PROPERTY_TYPE_LABEL, priceFull } from "@/lib/format";
import { iconSvg } from "@/lib/markerStyle";
import type { PropertyListItem } from "@/lib/types";

interface Props {
  property: PropertyListItem;
  selected: boolean;
  onSelect: (id: number) => void;
}

const chip = "rounded-full bg-white/70 px-2.5 py-1 text-xs font-medium text-slate-700";

/** Floating glass card shown in the map's bottom rail. */
export default function MapCard({ property: p, selected, onSelect }: Props) {
  return (
    <article
      data-card-id={p.id}
      onClick={() => onSelect(p.id)}
      className={`relative flex w-[320px] shrink-0 cursor-pointer snap-start overflow-hidden rounded-[28px] border bg-white/70 shadow-xl backdrop-blur-xl transition ${
        selected ? "border-black ring-2 ring-black" : "border-white/60 hover:bg-white/80"
      }`}
    >
      <div className="relative w-[120px] shrink-0 bg-slate-200">
        {p.coverImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.coverImage} alt={p.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <span className="absolute left-2 top-2 rounded-full bg-black/45 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur">
          {p.listingType === "Sale" ? "For Sale" : "For Rent"}
        </span>
        {p.isDemo && (
          <span className="absolute bottom-2 left-2 rounded-full bg-amber-400 px-2 py-0.5 text-[10px] font-bold text-slate-900">DEMO</span>
        )}
      </div>
      <div className="min-w-0 flex-1 p-3.5">
        <div className="flex items-start gap-2">
          <span
            className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/80"
            dangerouslySetInnerHTML={{ __html: iconSvg(p.propertyType, 16) }}
          />
          <div className="min-w-0 flex-1 pr-8">
            <h3 className="line-clamp-1 text-sm font-semibold text-slate-900">{p.title}</h3>
            <p className="line-clamp-1 text-xs text-slate-500">
              {p.district}, {p.province}
            </p>
          </div>
        </div>
        <div className="mt-2 text-xl font-bold text-slate-900">{priceFull(p.price, p.listingType)}</div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <span className={chip}>{PROPERTY_TYPE_LABEL[p.propertyType]}</span>
          {p.bedrooms > 0 && <span className={chip}>{p.bedrooms} นอน</span>}
          {p.bathrooms > 0 && <span className={chip}>{p.bathrooms} น้ำ</span>}
          <span className={chip}>{p.area.toLocaleString("th-TH")} ตร.ม.</span>
        </div>
      </div>
      <Link
        href={`/properties/${p.id}`}
        onClick={(e) => e.stopPropagation()}
        aria-label={`ดูรายละเอียด ${p.title} (${LISTING_LABEL[p.listingType]})`}
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black !text-white"
      >
        ↗
      </Link>
    </article>
  );
}
