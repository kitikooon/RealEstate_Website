export default function Footer() {
  return (
    <footer className="bg-slate-800 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="font-[family-name:var(--font-serif)] text-2xl text-white">
            Plot<em className="text-slate-400">line</em>
          </div>
          <p className="mt-2 text-sm text-slate-400">แพลตฟอร์มค้นหาอสังหาริมทรัพย์ผ่านแผนที่ 3D</p>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-white">ติดต่อเรา</div>
          <p className="mt-2">อีเมล: contact@example.com</p>
          <p>โทร: 02-000-0000</p>
          <p>LINE: @realestate-demo</p>
        </div>
        <div className="text-sm">
          <div className="font-semibold text-white">ข้อมูลสาธิต</div>
          <p className="mt-2 text-slate-400">
            ประกาศและข้อมูลติดต่อทั้งหมดในเว็บไซต์นี้เป็นข้อมูลตัวอย่าง (Demo Data) ไม่ใช่ทรัพย์สินจริง
          </p>
        </div>
      </div>
      <div className="border-t border-slate-700 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} Plotline
      </div>
    </footer>
  );
}
