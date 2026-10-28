import Image from "next/image";
import Link from "next/link";
import FeatureShowcase from "@/components/FeatureShowcase";

export default function Home() {
  return (
    <>
      <section className="relative flex min-h-dvh items-center overflow-hidden px-4 pb-16 pt-28 text-white">
        <Image
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=75"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-zoom object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/45 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/50 to-transparent" />

        <div className="relative mx-auto w-full max-w-6xl">
          <p className="mb-6 text-base tracking-wide text-white/80 md:text-xl">บ้านและคอนโด ซื้อ เช่า ทั่วประเทศไทย</p>
          <h1 className="font-[family-name:var(--font-serif)] text-6xl leading-[1.05] tracking-tight md:text-8xl lg:text-9xl">
            Find a home,
            <br />
            <em className="text-amber-100/90">chosen with care.</em>
          </h1>
          <p className="mt-8 max-w-3xl text-lg font-light text-white/85 md:text-2xl md:leading-relaxed">
            ค้นหาบ้าน คอนโด ทาวน์โฮม และที่ดิน ปักหมุดตามพิกัดจริงบนแผนที่ 3D ดูราคาและทำเลได้ในมุมมองเดียว
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-6">
            <Link href="/search" className="rounded-md bg-white px-9 py-4 text-lg font-semibold text-navy hover:bg-white/90">
              เปิดแผนที่ค้นหา →
            </Link>
            <Link
              href="/compare"
              className="rounded-md border border-white/70 px-9 py-4 text-lg font-semibold text-white backdrop-blur-sm hover:bg-white/15"
            >
              เปรียบเทียบ
            </Link>
            <a href="#features" className="border-b border-white/60 pb-0.5 text-base text-white/90 hover:border-white md:text-lg">
              ดูวิธีใช้งาน ↓
            </a>
          </div>
        </div>
      </section>

      <section id="features" className="scroll-mt-0 bg-[#f4f1ec] px-4 py-20 text-stone-900 md:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="max-w-3xl text-4xl font-medium leading-tight tracking-tight md:text-6xl md:leading-[1.15]">
            เลือกบ้านจากทำเลจริง
            <br />
            ไม่ใช่แค่รูปถ่าย
          </h2>
          <div className="mt-14 md:mt-20">
            <FeatureShowcase />
          </div>
        </div>
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
