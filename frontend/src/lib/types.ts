export type ListingType = "Sale" | "Rent";
export type PropertyType = "House" | "Condo" | "Townhome" | "Land" | "Commercial";
export type PropertySort = "Relevance" | "PriceAsc" | "PriceDesc" | "Newest";

export interface Agent {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  lineId: string | null;
}

export interface PropertyListItem {
  id: number;
  title: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  latitude: number;
  longitude: number;
  address: string;
  province: string;
  district: string;
  coverImage: string | null;
  createdAt: string;
  isDemo: boolean;
}

export interface PropertyDetail extends Omit<PropertyListItem, "coverImage"> {
  description: string;
  status: string;
  images: string[];
  agent: Agent | null;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SearchFilters {
  listingType?: ListingType;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  province?: string;
  district?: string;
  q?: string;
  sort?: PropertySort;
}

export interface Bounds {
  west: number;
  south: number;
  east: number;
  north: number;
}
