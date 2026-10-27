# RealEstate_Website

เว็บไซต์ค้นหาอสังหาริมทรัพย์พร้อมแผนที่ 3D แบบ Interactive

| ส่วน | เทคโนโลยี | โฟลเดอร์ |
|---|---|---|
| Frontend | Next.js (App Router) + React + TypeScript + Tailwind CSS | `frontend/` |
| 3D Map | MapLibre GL JS (เปลี่ยน Provider ได้ที่ `src/lib/mapProvider.ts`) | `frontend/` |
| Backend | ASP.NET Core Web API (.NET 10) + EF Core | `backend/RealEstate.Api/` |
| Database | Microsoft SQL Server | - |

## สิ่งที่ต้องมี

- Node.js 20+ (ทดสอบกับ 24) และ npm
- .NET SDK 10
- SQL Server (LocalDB, Express หรือ Docker) และเครื่องมือ `dotnet tool install --global dotnet-ef`
- MapTiler API key (ฟรี) สำหรับแผนที่ 3D — ถ้าไม่มี ระบบจะใช้ OpenStreetMap แบบ 2 มิติและแสดงข้อความแจ้งบนแผนที่

## 1. ตั้งค่าและรัน Backend

```bash
cd backend/RealEstate.Api
```

ตั้งค่า connection string ใน `appsettings.json` (ค่าเริ่มต้นใช้ LocalDB) หรือเก็บค่าจริงด้วย user-secrets / environment variable:

```bash
dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:Default" "Server=localhost,1433;Database=RealEstateDb;User Id=sa;Password=<รหัสผ่าน>;TrustServerCertificate=True"
# หรือ: ConnectionStrings__Default=... (environment variable)
```

สร้างฐานข้อมูลและใส่ข้อมูลตัวอย่าง (migration `InitialCreate` มี Demo Data รวมอยู่แล้ว):

```bash
dotnet ef database update
dotnet run --urls http://localhost:5080
```

ในโหมด Development แอปจะรัน `Database.Migrate()` ให้อัตโนมัติเมื่อเริ่มต้น  
CORS อนุญาตเฉพาะ origin ใน `Cors:AllowedOrigins` (ค่าเริ่มต้น `http://localhost:3000`)

### SQL Server ด้วย Docker (ทางเลือก)

```bash
docker run -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD='<รหัสผ่านที่ซับซ้อน>' -p 1433:1433 -d mcr.microsoft.com/mssql/server:2022-latest
```

### API

| Endpoint | คำอธิบาย |
|---|---|
| `GET /api/properties` | ค้นหา + แบ่งหน้า (`page`, `pageSize`) |
| `GET /api/properties/{id}` | รายละเอียดประกาศ (รูป + ผู้ลงประกาศ) |
| `GET /api/properties/map?west&south&east&north` | ประกาศภายในขอบเขตแผนที่ (ต้องส่งครบทั้ง 4 ค่า, `limit` สูงสุด 1000) |
| `GET /api/properties/featured?count=6` | ประกาศแนะนำ |
| `GET /api/properties/{id}/nearby?count=4` | ประกาศใกล้เคียง |

พารามิเตอร์ค้นหา: `listingType` (Sale/Rent), `propertyType` (House/Condo/Townhome/Land/Commercial), `minPrice`, `maxPrice`, `bedrooms`, `bathrooms`, `province`, `district`, `q`, `sort` (Relevance/PriceAsc/PriceDesc/Newest)  
ค่าที่ไม่ถูกต้อง (พิกัดนอกช่วง, `south > north`, `minPrice > maxPrice`) จะได้ `400` พร้อมรายละเอียดข้อผิดพลาด

## 2. ตั้งค่าและรัน Frontend

```bash
cd frontend
cp .env.example .env.local     # แล้วกรอก NEXT_PUBLIC_MAPTILER_KEY
npm install
npm run dev                    # http://localhost:3000
```

| ตัวแปร | ความหมาย |
|---|---|
| `NEXT_PUBLIC_API_URL` | URL ของ API (ค่าเริ่มต้น `http://localhost:5080`) |
| `NEXT_PUBLIC_MAP_PROVIDER` | `maptiler` (3D) หรือ `osm` (2D, ไม่ต้องใช้ key) |
| `NEXT_PUBLIC_MAPTILER_KEY` | key จาก https://cloud.maptiler.com/ — ตัวแปร `NEXT_PUBLIC_*` จะถูกส่งไปที่เบราว์เซอร์ ให้จำกัด domain ของ key ใน MapTiler dashboard |

คำสั่งตรวจสอบ: `npm run lint`, `npm run build`

### โหมดข้อมูลจำลอง (ไม่ต้องมี API / SQL Server)

ตั้ง `NEXT_PUBLIC_USE_MOCK=true` ใน `frontend/.env.local` แล้ว Frontend จะใช้ข้อมูลตัวอย่างใน `src/lib/mockData.ts` แทนการเรียก API (ใช้ดูหน้าเว็บและแผนที่ได้ทันที) ตั้งเป็น `false` หรือลบออกเพื่อใช้ API จริง  
ถ้าไม่ใส่ `NEXT_PUBLIC_MAPTILER_KEY` แผนที่จะใช้ OpenFreeMap + AWS Terrain Tiles (3D ไม่ต้องใช้ key) และจำกัดมุมมองให้อยู่ในประเทศไทย

## ฟีเจอร์

- หน้าแรก: Hero + ช่องค้นหา, ประกาศแนะนำ, ลิงก์ไปแผนที่
- `/search`: แผนที่ 3D (terrain + อาคาร 3D เมื่อใช้ MapTiler), Marker ราคา (฿2.5M, ฿15K/mo), จัดกลุ่ม Marker (cluster), Popup, คลิกการ์ดแล้วแผนที่บินไปตำแหน่งนั้น, ปุ่ม "ค้นหาในพื้นที่นี้", ปุ่มกลับตำแหน่งเริ่มต้น, สลับ Map/List บนมือถือ
- `/properties/{id}`: แกลเลอรีรูป, รายละเอียด, แผนที่ตำแหน่ง, ปุ่มโทร/LINE (แสดงเมื่อมีข้อมูลผู้ลงประกาศ), ประกาศใกล้เคียง
- ปุ่ม "เข้าสู่ระบบ" ยังปิดอยู่ (ระบบสมาชิกอยู่ในระยะถัดไป; มี entity `User` เตรียมไว้แล้ว)

## ข้อมูลตัวอย่าง (Demo Data)

ข้อมูลใน migration (`Data/SeedData.cs`) เป็นข้อมูลสมมติทั้งหมด 18 ประกาศ ใช้พิกัดจริงของแต่ละย่าน (กรุงเทพฯ เชียงใหม่ ภูเก็ต ชลบุรี ขอนแก่น สงขลา นนทบุรี) ทุกแถวมี `IsDemo = true`, คำอธิบายขึ้นต้นด้วย `[DEMO DATA]` และหน้าเว็บแสดงป้าย DEMO  
เบอร์โทร/อีเมล/LINE ของ Agent เป็นค่าสมมติ รูปภาพอ้างอิงจาก Unsplash (เปลี่ยนเป็นที่เก็บรูปของคุณเองก่อนใช้งานจริง)  
ก่อนขึ้น production ให้ลบ seed ออกจาก migration/DB แล้วนำข้อมูลจริงเข้า

## การเปลี่ยน Map Provider

แก้ที่ `frontend/src/lib/mapProvider.ts` — เพิ่มฟังก์ชันที่คืนค่า `MapProviderConfig` (style, terrain URL, supports3D) แล้วเลือกใน `getMapProvider()` คอมโพเนนต์ `MapView` อ่านค่าจาก config นี้เท่านั้น  
OpenStreetMap ใช้เป็น 2D fallback; โปรดอ่านนโยบายการใช้งาน tile server สาธารณะของ OSM ก่อนใช้งานจริง (production ควรใช้ผู้ให้บริการ tile ที่รองรับ)

## สถานะการทดสอบ

- Frontend: `tsc`, `npm run lint`, `npm run build` ผ่าน และทดสอบแผนที่ 3D, การ์ด, popup, หน้ารายละเอียดใน Chrome (โหมดข้อมูลจำลอง) แล้ว
- Backend: `dotnet build` ผ่าน และสร้าง migration แล้ว
- **ยังไม่ได้ทดสอบรัน API กับ SQL Server จริง** เพราะเครื่องที่พัฒนา LocalDB เริ่มทำงานไม่ได้ ให้ทำตามขั้นตอนข้างต้นแล้วตรวจสอบ `GET /api/properties/featured`
- ยังไม่ได้ทดสอบกับ MapTiler key จริง

## งานที่เหลือ / ขั้นต่อไป

- ระบบสมาชิก (Authentication) และหน้าลงประกาศ / admin
- อัปโหลดรูปภาพ (ปัจจุบันเก็บเป็น URL)
- ค้นหาแบบ full-text และการจัดอันดับ "ความเกี่ยวข้อง" (ตอนนี้เรียงตามวันที่ลงประกาศ)
- Unit/integration tests
