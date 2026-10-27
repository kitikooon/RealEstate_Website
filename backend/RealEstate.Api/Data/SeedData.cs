using Microsoft.EntityFrameworkCore;
using RealEstate.Api.Models;

namespace RealEstate.Api.Data;

/// <summary>
/// DEMO DATA ONLY. Sample listings placed at real-world coordinates for each area.
/// Prices, descriptions, agents and phone numbers are fictional.
/// All rows are flagged IsDemo = true.
/// </summary>
public static class SeedData
{
    private static readonly DateTime Base = new(2026, 9, 1, 0, 0, 0, DateTimeKind.Utc);

    // Unsplash demo photos (hot-linked placeholders; replace with your own storage).
    private static readonly string[] Photos =
    {
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
    };

    private record P(PropertyType T, ListingType L, string Title, decimal Price, int Bed, int Bath, decimal Area,
        double Lat, double Lng, string Addr, string Prov, string Dist, int Agent);

    public static void Apply(ModelBuilder b)
    {
        b.Entity<Agent>().HasData(
            new Agent { Id = 1, Name = "Demo Agent - Somchai", Phone = "0800000001", Email = "demo1@example.com", LineId = "demo_agent_1" },
            new Agent { Id = 2, Name = "Demo Agent - Natthaya", Phone = "0800000002", Email = "demo2@example.com", LineId = "demo_agent_2" },
            new Agent { Id = 3, Name = "Demo Agent - Pranee", Phone = "0800000003", Email = "demo3@example.com", LineId = null });

        var list = new List<P>
        {
            new(PropertyType.Condo, ListingType.Sale, "คอนโดหรูใกล้ BTS อโศก", 6_500_000, 1, 1, 38, 13.7367, 100.5603, "สุขุมวิท 21", "กรุงเทพมหานคร", "วัฒนา", 1),
            new(PropertyType.Condo, ListingType.Rent, "คอนโดวิวเมือง ใกล้ BTS พร้อมพงษ์", 28_000, 2, 2, 65, 13.7305, 100.5698, "สุขุมวิท 39", "กรุงเทพมหานคร", "วัฒนา", 1),
            new(PropertyType.House, ListingType.Sale, "บ้านเดี่ยวหรู ย่านสาทร", 48_000_000, 5, 5, 520, 13.7189, 100.5301, "ถนนสาทรเหนือ", "กรุงเทพมหานคร", "สาทร", 2),
            new(PropertyType.Townhome, ListingType.Sale, "ทาวน์โฮม 3 ชั้น ใกล้ MRT ลาดพร้าว", 7_900_000, 3, 3, 180, 13.8060, 100.5731, "ลาดพร้าว 71", "กรุงเทพมหานคร", "ลาดพร้าว", 2),
            new(PropertyType.Commercial, ListingType.Rent, "อาคารพาณิชย์ 4 ชั้น ริมถนนใหญ่", 85_000, 0, 4, 320, 13.7563, 100.5018, "ถนนเจริญกรุง", "กรุงเทพมหานคร", "บางรัก", 3),
            new(PropertyType.Condo, ListingType.Rent, "คอนโดริมแม่น้ำเจ้าพระยา", 35_000, 2, 2, 78, 13.7234, 100.5116, "เจริญนคร", "กรุงเทพมหานคร", "คลองสาน", 1),
            new(PropertyType.House, ListingType.Sale, "บ้านสวนพร้อมสระว่ายน้ำ เชียงใหม่", 12_900_000, 4, 4, 380, 18.8076, 98.9640, "ถนนหางดง", "เชียงใหม่", "หางดง", 3),
            new(PropertyType.Condo, ListingType.Sale, "คอนโดใกล้นิมมานเหมินท์", 3_200_000, 1, 1, 34, 18.8000, 98.9680, "นิมมานเหมินท์ ซอย 9", "เชียงใหม่", "เมืองเชียงใหม่", 3),
            new(PropertyType.Land, ListingType.Sale, "ที่ดินวิวดอย แม่ริม", 5_400_000, 0, 0, 1600, 18.9100, 98.9500, "ถนนแม่ริม-สะเมิง", "เชียงใหม่", "แม่ริม", 3),
            new(PropertyType.House, ListingType.Sale, "พูลวิลล่าใกล้หาดกะตะ ภูเก็ต", 24_500_000, 4, 5, 450, 7.8210, 98.3000, "กะตะ", "ภูเก็ต", "เมืองภูเก็ต", 2),
            new(PropertyType.Condo, ListingType.Rent, "คอนโดวิวทะเล หาดกะรน", 22_000, 1, 1, 45, 7.8430, 98.2940, "กะรน", "ภูเก็ต", "เมืองภูเก็ต", 2),
            new(PropertyType.Land, ListingType.Sale, "ที่ดินติดทะเล ราไวย์", 38_000_000, 0, 0, 3200, 7.7780, 98.3220, "ราไวย์", "ภูเก็ต", "เมืองภูเก็ต", 2),
            new(PropertyType.Condo, ListingType.Sale, "คอนโดวิวทะเล พัทยากลาง", 4_100_000, 1, 1, 36, 12.9350, 100.8770, "พัทยากลาง", "ชลบุรี", "บางละมุง", 1),
            new(PropertyType.House, ListingType.Rent, "บ้านเดี่ยวให้เช่า นาจอมเทียน", 45_000, 3, 3, 260, 12.8180, 100.9260, "นาจอมเทียน", "ชลบุรี", "สัตหีบ", 1),
            new(PropertyType.Townhome, ListingType.Sale, "ทาวน์โฮมใหม่ ใกล้ถนนมิตรภาพ ขอนแก่น", 2_890_000, 3, 2, 130, 16.4322, 102.8236, "ถนนมิตรภาพ", "ขอนแก่น", "เมืองขอนแก่น", 3),
            new(PropertyType.Commercial, ListingType.Sale, "ตึกแถวทำเลทอง หาดใหญ่", 9_800_000, 0, 3, 240, 7.0086, 100.4747, "ถนนนิพัทธ์อุทิศ", "สงขลา", "หาดใหญ่", 3),
            new(PropertyType.House, ListingType.Sale, "บ้านเดี่ยวโครงการใหม่ นนทบุรี", 6_950_000, 4, 3, 220, 13.8621, 100.5144, "ติวานนท์", "นนทบุรี", "เมืองนนทบุรี", 2),
            new(PropertyType.Condo, ListingType.Sale, "คอนโดติดรถไฟฟ้าสีเขียว บางนา", 3_450_000, 1, 1, 30, 13.6685, 100.6050, "สุขุมวิท 105", "กรุงเทพมหานคร", "บางนา", 1),
        };

        var props = new List<Property>();
        var imgs = new List<PropertyImage>();
        for (var i = 0; i < list.Count; i++)
        {
            var p = list[i];
            var id = i + 1;
            props.Add(new Property
            {
                Id = id,
                Title = p.Title,
                Description = $"[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - {p.Title} ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ",
                PropertyType = p.T, ListingType = p.L, Price = p.Price, Bedrooms = p.Bed, Bathrooms = p.Bath, Area = p.Area,
                Latitude = p.Lat, Longitude = p.Lng, Address = p.Addr, Province = p.Prov, District = p.Dist,
                Status = PropertyStatus.Active, CreatedAt = Base.AddDays(-i * 2), IsDemo = true, AgentId = p.Agent,
            });
            for (var k = 0; k < 3; k++)
                imgs.Add(new PropertyImage { Id = id * 10 + k, PropertyId = id, SortOrder = k, ImageUrl = Photos[(i + k * 3) % Photos.Length] });
        }
        b.Entity<Property>().HasData(props);
        b.Entity<PropertyImage>().HasData(imgs);
    }
}
