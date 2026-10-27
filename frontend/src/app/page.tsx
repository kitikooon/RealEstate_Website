import Link from "next/link";
import FeaturedProperties from "@/components/FeaturedProperties";
import HeroSearch from "@/components/HeroSearch";

export default function Home() {
  return (
    <>
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white px-4 pb-16 pt-14 text-navy md:pb-24 md:pt-20">
        <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-sky-200/40 blur-3xl" />
        <div className="pointer-events-none absolute -right-24 top-10 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
        <div className="relative mx-auto max-w-5xl text-center">
          <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">ค้นหาบ้านในฝันของคุณบนแผนที่ 3D</h1>
          <p className="mx-auto mb-8 mt-4 max-w-2xl font-light text-slate-500">
            บ้าน คอนโด ทาวน์โฮม ที่ดิน และอาคารพาณิชย์ ปักหมุดตามพิกัดจริง ค้นหาตามพื้นที่บนแผนที่ได้ทันที
          </p>
        </div>
        <HeroSearch />
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-navy">ประกาศแนะนำ</h2>
            <p className="text-sm text-slate-500">ประกาศล่าสุดจากทั่วประเทศ</p>
          </div>
          <Link href="/search" className="text-sm font-medium text-navy hover:underline">
            ดูทั้งหมด →
          </Link>
        </div>
        <FeaturedProperties />
      </section>

      <section className="bg-slate-50 px-4 py-14">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 text-center md:flex-row md:text-left">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-navy">ค้นหาผ่านแผนที่</h2>
            <p className="mt-2 text-slate-600">
              หมุน เอียง ซูมแผนที่ ดูอาคาร 3D และราคาของแต่ละประกาศบนหมุด แล้วกดค้นหาเฉพาะพื้นที่ที่คุณกำลังดูอยู่
            </p>
          </div>
          <Link href="/search" className="rounded-lg bg-navy px-8 py-3 font-semibold text-white hover:bg-navy-soft">
            เปิดแผนที่ค้นหา
          </Link>
        </div>
      </section>
    </>
  );
}
