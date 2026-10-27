import type { Agent, ListingType, PropertyDetail, PropertyType } from "./types";

/**
 * MOCK DATA ONLY - used when NEXT_PUBLIC_USE_MOCK=true (no API / database).
 * Coordinates are real places; prices, agents and phone numbers are fictional.
 */
const PHOTOS = [
  "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=70",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=70",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=70",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=70",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=70",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=70",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=70",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=70",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=70",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=70",
];

const AGENTS: Agent[] = [
  { id: 1, name: "Demo Agent - Somchai", phone: "0800000001", email: "demo1@example.com", lineId: "demo_agent_1" },
  { id: 2, name: "Demo Agent - Natthaya", phone: "0800000002", email: "demo2@example.com", lineId: "demo_agent_2" },
  { id: 3, name: "Demo Agent - Pranee", phone: "0800000003", email: "demo3@example.com", lineId: null },
];

type Row = [PropertyType, ListingType, string, number, number, number, number, number, number, string, string, string, number];

// type, listing, title, price, bed, bath, area, lat, lng, address, province, district, agentId
const ROWS: Row[] = [
  ["Condo", "Sale", "คอนโดหรูใกล้ BTS อโศก", 6_500_000, 1, 1, 38, 13.7367, 100.5603, "สุขุมวิท 21", "กรุงเทพมหานคร", "วัฒนา", 1],
  ["Condo", "Rent", "คอนโดวิวเมือง ใกล้ BTS พร้อมพงษ์", 28_000, 2, 2, 65, 13.7305, 100.5698, "สุขุมวิท 39", "กรุงเทพมหานคร", "วัฒนา", 1],
  ["House", "Sale", "บ้านเดี่ยวหรู ย่านสาทร", 48_000_000, 5, 5, 520, 13.7189, 100.5301, "ถนนสาทรเหนือ", "กรุงเทพมหานคร", "สาทร", 2],
  ["Townhome", "Sale", "ทาวน์โฮม 3 ชั้น ใกล้ MRT ลาดพร้าว", 7_900_000, 3, 3, 180, 13.806, 100.5731, "ลาดพร้าว 71", "กรุงเทพมหานคร", "ลาดพร้าว", 2],
  ["Commercial", "Rent", "อาคารพาณิชย์ 4 ชั้น ริมถนนใหญ่", 85_000, 0, 4, 320, 13.7563, 100.5018, "ถนนเจริญกรุง", "กรุงเทพมหานคร", "บางรัก", 3],
  ["Condo", "Rent", "คอนโดริมแม่น้ำเจ้าพระยา", 35_000, 2, 2, 78, 13.7234, 100.5116, "เจริญนคร", "กรุงเทพมหานคร", "คลองสาน", 1],
  ["House", "Sale", "บ้านสวนพร้อมสระว่ายน้ำ เชียงใหม่", 12_900_000, 4, 4, 380, 18.8076, 98.964, "ถนนหางดง", "เชียงใหม่", "หางดง", 3],
  ["Condo", "Sale", "คอนโดใกล้นิมมานเหมินท์", 3_200_000, 1, 1, 34, 18.8, 98.968, "นิมมานเหมินท์ ซอย 9", "เชียงใหม่", "เมืองเชียงใหม่", 3],
  ["Land", "Sale", "ที่ดินวิวดอย แม่ริม", 5_400_000, 0, 0, 1600, 18.91, 98.95, "ถนนแม่ริม-สะเมิง", "เชียงใหม่", "แม่ริม", 3],
  ["House", "Sale", "พูลวิลล่าใกล้หาดกะตะ ภูเก็ต", 24_500_000, 4, 5, 450, 7.821, 98.3, "กะตะ", "ภูเก็ต", "เมืองภูเก็ต", 2],
  ["Condo", "Rent", "คอนโดวิวทะเล หาดกะรน", 22_000, 1, 1, 45, 7.843, 98.294, "กะรน", "ภูเก็ต", "เมืองภูเก็ต", 2],
  ["Land", "Sale", "ที่ดินติดทะเล ราไวย์", 38_000_000, 0, 0, 3200, 7.778, 98.322, "ราไวย์", "ภูเก็ต", "เมืองภูเก็ต", 2],
  ["Condo", "Sale", "คอนโดวิวทะเล พัทยากลาง", 4_100_000, 1, 1, 36, 12.935, 100.877, "พัทยากลาง", "ชลบุรี", "บางละมุง", 1],
  ["House", "Rent", "บ้านเดี่ยวให้เช่า นาจอมเทียน", 45_000, 3, 3, 260, 12.818, 100.926, "นาจอมเทียน", "ชลบุรี", "สัตหีบ", 1],
  ["Townhome", "Sale", "ทาวน์โฮมใหม่ ใกล้ถนนมิตรภาพ ขอนแก่น", 2_890_000, 3, 2, 130, 16.4322, 102.8236, "ถนนมิตรภาพ", "ขอนแก่น", "เมืองขอนแก่น", 3],
  ["Commercial", "Sale", "ตึกแถวทำเลทอง หาดใหญ่", 9_800_000, 0, 3, 240, 7.0086, 100.4747, "ถนนนิพัทธ์อุทิศ", "สงขลา", "หาดใหญ่", 3],
  ["House", "Sale", "บ้านเดี่ยวโครงการใหม่ นนทบุรี", 6_950_000, 4, 3, 220, 13.8621, 100.5144, "ติวานนท์", "นนทบุรี", "เมืองนนทบุรี", 2],
  ["Condo", "Sale", "คอนโดติดรถไฟฟ้าสีเขียว บางนา", 3_450_000, 1, 1, 30, 13.6685, 100.605, "สุขุมวิท 105", "กรุงเทพมหานคร", "บางนา", 1],
];

const BASE = Date.UTC(2026, 8, 1);

export const MOCK_PROPERTIES: PropertyDetail[] = ROWS.map((r, i) => ({
  id: i + 1,
  title: r[2],
  description: `[MOCK DATA] ประกาศตัวอย่างสำหรับแสดงผล - ${r[2]} ทำเลดี เดินทางสะดวก ข้อมูลทั้งหมดเป็นข้อมูลสมมติ`,
  propertyType: r[0],
  listingType: r[1],
  price: r[3],
  bedrooms: r[4],
  bathrooms: r[5],
  area: r[6],
  latitude: r[7],
  longitude: r[8],
  address: r[9],
  province: r[10],
  district: r[11],
  status: "Active",
  createdAt: new Date(BASE - i * 2 * 86_400_000).toISOString(),
  isDemo: true,
  images: [0, 3, 6].map((k) => PHOTOS[(i + k) % PHOTOS.length]),
  agent: AGENTS.find((a) => a.id === r[12]) ?? null,
}));
