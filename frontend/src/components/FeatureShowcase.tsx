"use client";

import Image from "next/image";
import { useState } from "react";

const FEATURES = [
  {
    title: "ปักหมุดตามพิกัดจริง",
    text: "ทุกประกาศอยู่บนแผนที่ 3D ดูย่าน ถนน และอาคารรอบข้างได้ทันที",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1400&q=75",
  },
  {
    title: "กรองตามที่ต้องการ",
    text: "เลือกซื้อหรือเช่า ประเภททรัพย์ ช่วงราคา และจำนวนห้องนอน",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1400&q=75",
  },
  {
    title: "ดูราคาบนหมุด",
    text: "ราคาแสดงบนแผนที่ กดที่หมุดเพื่อดูรายละเอียดของทรัพย์ได้เลย",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1400&q=75",
  },
  {
    title: "ค้นหาเฉพาะพื้นที่ที่ดูอยู่",
    text: "เลื่อนแผนที่ไปยังย่านที่สนใจ แล้วกดค้นหาเพื่อเห็นเฉพาะทรัพย์ในกรอบนั้น",
    image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=75",
  },
];

/** Numbered feature list on the left; the device frame on the right follows the selected item. */
export default function FeatureShowcase() {
  const [active, setActive] = useState(0);

  return (
    <div className="grid items-center gap-10 md:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)] md:gap-16">
      <ul className="border-t border-stone-300/70">
        {FEATURES.map((f, i) => {
          const on = i === active;
          return (
            <li key={f.title} className="border-b border-stone-300/70">
              <button
                type="button"
                onClick={() => setActive(i)}
                onMouseEnter={() => setActive(i)}
                aria-current={on ? "true" : undefined}
                className={`flex w-full gap-5 py-5 text-left transition-opacity duration-300 ${on ? "opacity-100" : "opacity-45 hover:opacity-80"}`}
              >
                <span className="pt-1 font-[family-name:var(--font-serif)] text-sm italic">0{i + 1}</span>
                <span>
                  <span className="block text-lg font-medium">{f.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-stone-600">{f.text}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="rounded-[22px] bg-stone-900 p-2.5 shadow-2xl shadow-stone-900/25 md:p-3">
        <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-stone-800">
          {FEATURES.map((f, i) => (
            <Image
              key={f.image}
              src={f.image}
              alt=""
              fill
              sizes="(min-width: 768px) 55vw, 100vw"
              className={`object-cover transition-opacity duration-700 ${i === active ? "opacity-100" : "opacity-0"}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 max-w-[75%] rounded-xl bg-white/90 px-4 py-3 text-stone-900 shadow-lg backdrop-blur md:bottom-6 md:left-6 md:px-5 md:py-4">
            <div className="font-[family-name:var(--font-serif)] text-xs italic text-stone-500">0{active + 1}</div>
            <div className="font-medium">{FEATURES[active].title}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
