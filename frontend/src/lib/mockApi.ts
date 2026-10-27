import { MOCK_PROPERTIES } from "./mockData";
import type { Bounds, PagedResult, PropertyDetail, PropertyListItem, SearchFilters } from "./types";

/** Mirrors the filtering/sorting rules of the real API, over in-memory mock data. */

function toItem(p: PropertyDetail): PropertyListItem {
  const { description, status, images, agent, ...rest } = p;
  void description;
  void status;
  void agent;
  return { ...rest, coverImage: images[0] ?? null };
}

function filter(f: SearchFilters): PropertyDetail[] {
  const q = f.q?.trim().toLowerCase();
  const list = MOCK_PROPERTIES.filter(
    (p) =>
      (!f.listingType || p.listingType === f.listingType) &&
      (!f.propertyType || p.propertyType === f.propertyType) &&
      (f.minPrice === undefined || p.price >= f.minPrice) &&
      (f.maxPrice === undefined || p.price <= f.maxPrice) &&
      (f.bedrooms === undefined || p.bedrooms >= f.bedrooms) &&
      (f.bathrooms === undefined || p.bathrooms >= f.bathrooms) &&
      (!f.province || p.province === f.province) &&
      (!f.district || p.district === f.district) &&
      (!q || [p.title, p.address, p.district, p.province].some((s) => s.toLowerCase().includes(q))),
  );
  const sorted = [...list];
  if (f.sort === "PriceAsc") sorted.sort((a, b) => a.price - b.price);
  else if (f.sort === "PriceDesc") sorted.sort((a, b) => b.price - a.price);
  else sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  return sorted;
}

const delay = () => new Promise((r) => setTimeout(r, 150));

export const mockApi = {
  async search(f: SearchFilters, page: number, pageSize: number): Promise<PagedResult<PropertyListItem>> {
    await delay();
    const all = filter(f);
    return { items: all.slice((page - 1) * pageSize, page * pageSize).map(toItem), total: all.length, page, pageSize };
  },

  async map(f: SearchFilters, b: Bounds): Promise<PropertyListItem[]> {
    await delay();
    return filter(f)
      .filter((p) => p.latitude >= b.south && p.latitude <= b.north)
      .filter((p) => (b.west <= b.east ? p.longitude >= b.west && p.longitude <= b.east : p.longitude >= b.west || p.longitude <= b.east))
      .map(toItem);
  },

  async featured(count: number): Promise<PropertyListItem[]> {
    await delay();
    return filter({}).slice(0, count).map(toItem);
  },

  async detail(id: number): Promise<PropertyDetail> {
    await delay();
    const p = MOCK_PROPERTIES.find((x) => x.id === id);
    if (!p) throw new Error("API ตอบกลับผิดพลาด (404)");
    return p;
  },

  async nearby(id: number, count: number): Promise<PropertyListItem[]> {
    await delay();
    const o = MOCK_PROPERTIES.find((x) => x.id === id);
    if (!o) return [];
    const d = (p: PropertyDetail) => (p.latitude - o.latitude) ** 2 + (p.longitude - o.longitude) ** 2;
    return MOCK_PROPERTIES.filter((p) => p.id !== id)
      .sort((a, b) => d(a) - d(b))
      .slice(0, count)
      .map(toItem);
  },
};
