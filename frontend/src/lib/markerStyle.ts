import type { PropertyType } from "./types";

/** Pastel colour + line icon per property type, used by map pins and cards. */
export const TYPE_COLOR: Record<PropertyType, string> = {
  Condo: "#7fd1cf",
  House: "#ff8a80",
  Townhome: "#5aa9ff",
  Land: "#6fdc8c",
  Commercial: "#ffa974",
};

const PATHS: Record<PropertyType | "Cluster", string> = {
  Condo: "M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18M2 22h20M10 7h4M10 11h4M10 15h4",
  House: "M3 11l9-8 9 8M5 10v11h14V10M10 21v-6h4v6",
  Townhome: "M3 21V9l5-4 5 4v12M13 21V12l4-3 4 3v9M2 21h20",
  Land: "M12 22V10M12 10c0-4 3-6 6-6 0 4-2 6-6 6zM12 14c0-3-2-5-5-5 0 3 2 5 5 5z",
  Commercial: "M3 9l1-5h16l1 5M3 9v11h18V9M9 20v-6h6v6M3 9c0 2 3 2 3 0 0 2 3 2 3 0 0 2 3 2 3 0 0 2 3 2 3 0 0 2 3 2 3 0",
  Cluster: "M4 21V8l6-4v17M10 21h10V11l-6-3M2 21h20M7 11h0M7 15h0",
};

export function iconSvg(type: PropertyType | "Cluster", size = 18): string {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="#1f2933" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${PATHS[type]}"/></svg>`;
}
