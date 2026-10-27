import type { ListingType, PropertySort, PropertyType, SearchFilters } from "./types";

const LISTING: ListingType[] = ["Sale", "Rent"];
const TYPES: PropertyType[] = ["House", "Condo", "Townhome", "Land", "Commercial"];
const SORTS: PropertySort[] = ["Relevance", "PriceAsc", "PriceDesc", "Newest"];

const posNum = (v: string | null) => {
  if (!v) return undefined;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : undefined;
};

export function filtersFromParams(sp: URLSearchParams): SearchFilters {
  const listing = sp.get("listingType") as ListingType | null;
  const type = sp.get("propertyType") as PropertyType | null;
  const sort = sp.get("sort") as PropertySort | null;
  return {
    listingType: listing && LISTING.includes(listing) ? listing : undefined,
    propertyType: type && TYPES.includes(type) ? type : undefined,
    minPrice: posNum(sp.get("minPrice")),
    maxPrice: posNum(sp.get("maxPrice")),
    bedrooms: posNum(sp.get("bedrooms")),
    bathrooms: posNum(sp.get("bathrooms")),
    province: sp.get("province") || undefined,
    district: sp.get("district") || undefined,
    q: sp.get("q") || undefined,
    sort: sort && SORTS.includes(sort) ? sort : undefined,
  };
}

export function filtersToParams(f: SearchFilters): URLSearchParams {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(f)) if (v !== undefined && v !== "") sp.set(k, String(v));
  return sp;
}
