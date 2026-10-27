import { mockApi } from "./mockApi";
import type { Bounds, PagedResult, PropertyDetail, PropertyListItem, SearchFilters } from "./types";

const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5080").replace(/\/$/, "");

/** When true the app uses in-memory mock data and never calls the API. */
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";

export class ApiError extends Error {
  constructor(message: string, readonly status: number | null) {
    super(message);
  }
}

function toQuery(params: Record<string, string | number | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

async function get<T>(path: string, signal?: AbortSignal): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, { signal });
  } catch (e) {
    if (e instanceof DOMException && e.name === "AbortError") throw e;
    throw new ApiError(`เชื่อมต่อ API ไม่ได้ (${API_URL})`, null);
  }
  if (!res.ok) throw new ApiError(`API ตอบกลับผิดพลาด (${res.status})`, res.status);
  return (await res.json()) as T;
}

export const api = {
  search: (f: SearchFilters, page = 1, pageSize = 12, signal?: AbortSignal): Promise<PagedResult<PropertyListItem>> =>
    USE_MOCK ? mockApi.search(f, page, pageSize) : get(`/api/properties${toQuery({ ...f, page, pageSize })}`, signal),

  map: (f: SearchFilters, b: Bounds, signal?: AbortSignal): Promise<PropertyListItem[]> =>
    USE_MOCK ? mockApi.map(f, b) : get(`/api/properties/map${toQuery({ ...f, ...b })}`, signal),

  featured: (count = 6, signal?: AbortSignal): Promise<PropertyListItem[]> =>
    USE_MOCK ? mockApi.featured(count) : get(`/api/properties/featured${toQuery({ count })}`, signal),

  detail: (id: number, signal?: AbortSignal): Promise<PropertyDetail> =>
    USE_MOCK ? mockApi.detail(id) : get(`/api/properties/${id}`, signal),

  nearby: (id: number, count = 4, signal?: AbortSignal): Promise<PropertyListItem[]> =>
    USE_MOCK ? mockApi.nearby(id, count) : get(`/api/properties/${id}/nearby${toQuery({ count })}`, signal),
};
