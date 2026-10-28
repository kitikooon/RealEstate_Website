"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Only Thai is available for now; the other languages are placeholders for a later phase.
const LANGS = [
  { code: "th", label: "ไทย", available: true },
  { code: "en", label: "EN", available: false },
  { code: "zh", label: "中文", available: false },
];

export default function Navbar() {
  // On the home page the bar floats transparently over the hero image; elsewhere it is a solid sticky bar.
  const overHero = usePathname() === "/";

  return (
    <header
      className={
        overHero
          ? "absolute inset-x-0 top-0 z-40 text-white"
          : "sticky top-0 z-40 border-b border-white/40 bg-white/60 text-navy backdrop-blur-xl"
      }
    >
      <nav className="flex h-16 w-full items-center justify-between px-5 md:px-12">
        <Link href="/" className="font-[family-name:var(--font-serif)] text-2xl font-medium tracking-tight">
          Plot<em className="font-normal opacity-70">line</em>
        </Link>
        <ul className="flex items-center gap-5 text-sm">
          {LANGS.map((l) => (
            <li key={l.code}>
              <button
                type="button"
                disabled={!l.available}
                title={l.available ? undefined : "เร็ว ๆ นี้"}
                aria-current={l.available ? "true" : undefined}
                className={`pb-0.5 disabled:cursor-not-allowed ${
                  l.available ? "border-b border-current font-medium" : "opacity-60"
                }`}
              >
                {l.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
