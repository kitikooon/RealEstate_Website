import type { ListingType, PropertyType } from "./types";

/** Short marker label: ฿2.5M, ฿15K/mo. */
export function priceLabel(price: number, listing: ListingType): string {
  const short =
    price >= 1_000_000
      ? `${trim(price / 1_000_000)}M`
      : price >= 1_000
        ? `${trim(price / 1_000)}K`
        : String(price);
  return `฿${short}${listing === "Rent" ? "/mo" : ""}`;
}

/** Full price: ฿2,500,000 or ฿15,000/เดือน. */
export function priceFull(price: number, listing: ListingType): string {
  return `฿${price.toLocaleString("th-TH")}${listing === "Rent" ? "/เดือน" : ""}`;
}

function trim(n: number): string {
  return n.toFixed(n >= 10 ? 0 : 1).replace(/\.0$/, "");
}

export const PROPERTY_TYPE_LABEL: Record<PropertyType, string> = {
  House: "บ้านเดี่ยว",
  Condo: "คอนโด",
  Townhome: "ทาวน์โฮม",
  Land: "ที่ดิน",
  Commercial: "อาคารพาณิชย์",
};

export const LISTING_LABEL: Record<ListingType, string> = { Sale: "ขาย", Rent: "เช่า" };
