"use client";

import Link from "next/link";
import { useState } from "react";

const LINKS = [
  { href: "/search?listingType=Sale", label: "ซื้อ" },
  { href: "/search?listingType=Rent", label: "เช่า" },
  { href: "/search", label: "ขายอสังหาริมทรัพย์" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold tracking-tight text-navy">
          Real<span className="text-slate-500">Estate</span>
        </Link>
        <ul className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <li key={l.label}>
              <Link href={l.href} className="text-sm font-medium text-slate-700 hover:text-navy">
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center gap-2">
          {/* Membership is a later phase; this button is a placeholder, not a working login. */}
          <button
            type="button"
            disabled
            title="ระบบสมาชิกจะเปิดใช้งานในระยะถัดไป"
            className="hidden rounded-md bg-navy px-4 py-2 text-sm font-medium text-white opacity-90 disabled:cursor-not-allowed md:block"
          >
            เข้าสู่ระบบ
          </button>
          <button
            type="button"
            aria-label="เมนู"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-2 text-slate-700 md:hidden"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
      {open && (
        <ul className="border-t border-slate-100 bg-white px-4 py-2 md:hidden">
          {LINKS.map((l) => (
            <li key={l.label}>
              <Link href={l.href} onClick={() => setOpen(false)} className="block py-3 text-sm font-medium text-slate-700">
                {l.label}
              </Link>
            </li>
          ))}
          <li className="py-3 text-sm text-slate-400">เข้าสู่ระบบ (เร็ว ๆ นี้)</li>
        </ul>
      )}
    </header>
  );
}
