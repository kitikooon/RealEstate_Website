using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RealEstate.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Agents",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Phone = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    LineId = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agents", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    DisplayName = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    PasswordHash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Properties",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Title = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Description = table.Column<string>(type: "nvarchar(4000)", maxLength: 4000, nullable: false),
                    PropertyType = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    ListingType = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    Price = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Bedrooms = table.Column<int>(type: "int", nullable: false),
                    Bathrooms = table.Column<int>(type: "int", nullable: false),
                    Area = table.Column<decimal>(type: "decimal(12,2)", precision: 12, scale: 2, nullable: false),
                    Latitude = table.Column<double>(type: "float", nullable: false),
                    Longitude = table.Column<double>(type: "float", nullable: false),
                    Address = table.Column<string>(type: "nvarchar(300)", maxLength: 300, nullable: false),
                    Province = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    District = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Status = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IsDemo = table.Column<bool>(type: "bit", nullable: false),
                    AgentId = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Properties", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Properties_Agents_AgentId",
                        column: x => x.AgentId,
                        principalTable: "Agents",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                });

            migrationBuilder.CreateTable(
                name: "PropertyImages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PropertyId = table.Column<int>(type: "int", nullable: false),
                    ImageUrl = table.Column<string>(type: "nvarchar(1000)", maxLength: 1000, nullable: false),
                    SortOrder = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyImages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_PropertyImages_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Agents",
                columns: new[] { "Id", "Email", "LineId", "Name", "Phone" },
                values: new object[,]
                {
                    { 1, "demo1@example.com", "demo_agent_1", "Demo Agent - Somchai", "0800000001" },
                    { 2, "demo2@example.com", "demo_agent_2", "Demo Agent - Natthaya", "0800000002" },
                    { 3, "demo3@example.com", null, "Demo Agent - Pranee", "0800000003" }
                });

            migrationBuilder.InsertData(
                table: "Properties",
                columns: new[] { "Id", "Address", "AgentId", "Area", "Bathrooms", "Bedrooms", "CreatedAt", "Description", "District", "IsDemo", "Latitude", "ListingType", "Longitude", "Price", "PropertyType", "Province", "Status", "Title" },
                values: new object[,]
                {
                    { 1, "สุขุมวิท 21", 1, 38m, 1, 1, new DateTime(2026, 9, 1, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - คอนโดหรูใกล้ BTS อโศก ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "วัฒนา", true, 13.736700000000001, "Sale", 100.5603, 6500000m, "Condo", "กรุงเทพมหานคร", "Active", "คอนโดหรูใกล้ BTS อโศก" },
                    { 2, "สุขุมวิท 39", 1, 65m, 2, 2, new DateTime(2026, 8, 30, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - คอนโดวิวเมือง ใกล้ BTS พร้อมพงษ์ ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "วัฒนา", true, 13.730499999999999, "Rent", 100.5698, 28000m, "Condo", "กรุงเทพมหานคร", "Active", "คอนโดวิวเมือง ใกล้ BTS พร้อมพงษ์" },
                    { 3, "ถนนสาทรเหนือ", 2, 520m, 5, 5, new DateTime(2026, 8, 28, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - บ้านเดี่ยวหรู ย่านสาทร ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "สาทร", true, 13.7189, "Sale", 100.5301, 48000000m, "House", "กรุงเทพมหานคร", "Active", "บ้านเดี่ยวหรู ย่านสาทร" },
                    { 4, "ลาดพร้าว 71", 2, 180m, 3, 3, new DateTime(2026, 8, 26, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - ทาวน์โฮม 3 ชั้น ใกล้ MRT ลาดพร้าว ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "ลาดพร้าว", true, 13.805999999999999, "Sale", 100.5731, 7900000m, "Townhome", "กรุงเทพมหานคร", "Active", "ทาวน์โฮม 3 ชั้น ใกล้ MRT ลาดพร้าว" },
                    { 5, "ถนนเจริญกรุง", 3, 320m, 4, 0, new DateTime(2026, 8, 24, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - อาคารพาณิชย์ 4 ชั้น ริมถนนใหญ่ ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "บางรัก", true, 13.7563, "Rent", 100.5018, 85000m, "Commercial", "กรุงเทพมหานคร", "Active", "อาคารพาณิชย์ 4 ชั้น ริมถนนใหญ่" },
                    { 6, "เจริญนคร", 1, 78m, 2, 2, new DateTime(2026, 8, 22, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - คอนโดริมแม่น้ำเจ้าพระยา ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "คลองสาน", true, 13.7234, "Rent", 100.5116, 35000m, "Condo", "กรุงเทพมหานคร", "Active", "คอนโดริมแม่น้ำเจ้าพระยา" },
                    { 7, "ถนนหางดง", 3, 380m, 4, 4, new DateTime(2026, 8, 20, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - บ้านสวนพร้อมสระว่ายน้ำ เชียงใหม่ ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "หางดง", true, 18.807600000000001, "Sale", 98.963999999999999, 12900000m, "House", "เชียงใหม่", "Active", "บ้านสวนพร้อมสระว่ายน้ำ เชียงใหม่" },
                    { 8, "นิมมานเหมินท์ ซอย 9", 3, 34m, 1, 1, new DateTime(2026, 8, 18, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - คอนโดใกล้นิมมานเหมินท์ ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "เมืองเชียงใหม่", true, 18.800000000000001, "Sale", 98.968000000000004, 3200000m, "Condo", "เชียงใหม่", "Active", "คอนโดใกล้นิมมานเหมินท์" },
                    { 9, "ถนนแม่ริม-สะเมิง", 3, 1600m, 0, 0, new DateTime(2026, 8, 16, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - ที่ดินวิวดอย แม่ริม ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "แม่ริม", true, 18.91, "Sale", 98.950000000000003, 5400000m, "Land", "เชียงใหม่", "Active", "ที่ดินวิวดอย แม่ริม" },
                    { 10, "กะตะ", 2, 450m, 5, 4, new DateTime(2026, 8, 14, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - พูลวิลล่าใกล้หาดกะตะ ภูเก็ต ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "เมืองภูเก็ต", true, 7.8209999999999997, "Sale", 98.299999999999997, 24500000m, "House", "ภูเก็ต", "Active", "พูลวิลล่าใกล้หาดกะตะ ภูเก็ต" },
                    { 11, "กะรน", 2, 45m, 1, 1, new DateTime(2026, 8, 12, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - คอนโดวิวทะเล หาดกะรน ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "เมืองภูเก็ต", true, 7.843, "Rent", 98.293999999999997, 22000m, "Condo", "ภูเก็ต", "Active", "คอนโดวิวทะเล หาดกะรน" },
                    { 12, "ราไวย์", 2, 3200m, 0, 0, new DateTime(2026, 8, 10, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - ที่ดินติดทะเล ราไวย์ ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "เมืองภูเก็ต", true, 7.7779999999999996, "Sale", 98.322000000000003, 38000000m, "Land", "ภูเก็ต", "Active", "ที่ดินติดทะเล ราไวย์" },
                    { 13, "พัทยากลาง", 1, 36m, 1, 1, new DateTime(2026, 8, 8, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - คอนโดวิวทะเล พัทยากลาง ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "บางละมุง", true, 12.935, "Sale", 100.877, 4100000m, "Condo", "ชลบุรี", "Active", "คอนโดวิวทะเล พัทยากลาง" },
                    { 14, "นาจอมเทียน", 1, 260m, 3, 3, new DateTime(2026, 8, 6, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - บ้านเดี่ยวให้เช่า นาจอมเทียน ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "สัตหีบ", true, 12.818, "Rent", 100.926, 45000m, "House", "ชลบุรี", "Active", "บ้านเดี่ยวให้เช่า นาจอมเทียน" },
                    { 15, "ถนนมิตรภาพ", 3, 130m, 2, 3, new DateTime(2026, 8, 4, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - ทาวน์โฮมใหม่ ใกล้ถนนมิตรภาพ ขอนแก่น ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "เมืองขอนแก่น", true, 16.432200000000002, "Sale", 102.8236, 2890000m, "Townhome", "ขอนแก่น", "Active", "ทาวน์โฮมใหม่ ใกล้ถนนมิตรภาพ ขอนแก่น" },
                    { 16, "ถนนนิพัทธ์อุทิศ", 3, 240m, 3, 0, new DateTime(2026, 8, 2, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - ตึกแถวทำเลทอง หาดใหญ่ ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "หาดใหญ่", true, 7.0086000000000004, "Sale", 100.4747, 9800000m, "Commercial", "สงขลา", "Active", "ตึกแถวทำเลทอง หาดใหญ่" },
                    { 17, "ติวานนท์", 2, 220m, 3, 4, new DateTime(2026, 7, 31, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - บ้านเดี่ยวโครงการใหม่ นนทบุรี ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "เมืองนนทบุรี", true, 13.8621, "Sale", 100.51439999999999, 6950000m, "House", "นนทบุรี", "Active", "บ้านเดี่ยวโครงการใหม่ นนทบุรี" },
                    { 18, "สุขุมวิท 105", 1, 30m, 1, 1, new DateTime(2026, 7, 29, 0, 0, 0, 0, DateTimeKind.Utc), "[DEMO DATA] ประกาศตัวอย่างสำหรับการพัฒนา - คอนโดติดรถไฟฟ้าสีเขียว บางนา ทำเลดี เดินทางสะดวก ใกล้สิ่งอำนวยความสะดวกครบครัน ข้อมูลทั้งหมดเป็นข้อมูลสมมติ", "บางนา", true, 13.6685, "Sale", 100.605, 3450000m, "Condo", "กรุงเทพมหานคร", "Active", "คอนโดติดรถไฟฟ้าสีเขียว บางนา" }
                });

            migrationBuilder.InsertData(
                table: "PropertyImages",
                columns: new[] { "Id", "ImageUrl", "PropertyId", "SortOrder" },
                values: new object[,]
                {
                    { 10, "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=70", 1, 0 },
                    { 11, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=70", 1, 1 },
                    { 12, "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=70", 1, 2 },
                    { 20, "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=70", 2, 0 },
                    { 21, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=70", 2, 1 },
                    { 22, "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=70", 2, 2 },
                    { 30, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=70", 3, 0 },
                    { 31, "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=70", 3, 1 },
                    { 32, "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=70", 3, 2 },
                    { 40, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=70", 4, 0 },
                    { 41, "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=70", 4, 1 },
                    { 42, "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=70", 4, 2 },
                    { 50, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=70", 5, 0 },
                    { 51, "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=70", 5, 1 },
                    { 52, "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=70", 5, 2 },
                    { 60, "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=70", 6, 0 },
                    { 61, "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=70", 6, 1 },
                    { 62, "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=70", 6, 2 },
                    { 70, "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=70", 7, 0 },
                    { 71, "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=70", 7, 1 },
                    { 72, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=70", 7, 2 },
                    { 80, "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=70", 8, 0 },
                    { 81, "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=70", 8, 1 },
                    { 82, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=70", 8, 2 },
                    { 90, "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=70", 9, 0 },
                    { 91, "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=70", 9, 1 },
                    { 92, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=70", 9, 2 },
                    { 100, "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=70", 10, 0 },
                    { 101, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=70", 10, 1 },
                    { 102, "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=70", 10, 2 },
                    { 110, "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=70", 11, 0 },
                    { 111, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=70", 11, 1 },
                    { 112, "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=70", 11, 2 },
                    { 120, "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=70", 12, 0 },
                    { 121, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=70", 12, 1 },
                    { 122, "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=70", 12, 2 },
                    { 130, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=70", 13, 0 },
                    { 131, "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=70", 13, 1 },
                    { 132, "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=70", 13, 2 },
                    { 140, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=70", 14, 0 },
                    { 141, "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=70", 14, 1 },
                    { 142, "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=70", 14, 2 },
                    { 150, "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&q=70", 15, 0 },
                    { 151, "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=70", 15, 1 },
                    { 152, "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=70", 15, 2 },
                    { 160, "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=1200&q=70", 16, 0 },
                    { 161, "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=70", 16, 1 },
                    { 162, "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&q=70", 16, 2 },
                    { 170, "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=70", 17, 0 },
                    { 171, "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=70", 17, 1 },
                    { 172, "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=70", 17, 2 },
                    { 180, "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=70", 18, 0 },
                    { 181, "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=70", 18, 1 },
                    { 182, "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=70", 18, 2 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Properties_AgentId",
                table: "Properties",
                column: "AgentId");

            migrationBuilder.CreateIndex(
                name: "IX_Properties_Latitude_Longitude",
                table: "Properties",
                columns: new[] { "Latitude", "Longitude" });

            migrationBuilder.CreateIndex(
                name: "IX_Properties_Status_ListingType_PropertyType",
                table: "Properties",
                columns: new[] { "Status", "ListingType", "PropertyType" });

            migrationBuilder.CreateIndex(
                name: "IX_PropertyImages_PropertyId",
                table: "PropertyImages",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PropertyImages");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "Properties");

            migrationBuilder.DropTable(
                name: "Agents");
        }
    }
}
