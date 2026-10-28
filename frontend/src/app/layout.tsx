import type { Metadata } from "next";
import { Playfair_Display, Sarabun } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { USE_MOCK } from "@/lib/api";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Plotline -ค้นหาบ้าน คอนโด ที่ดิน ผ่านแผนที่ 3D",
  description: "ค้นหาอสังหาริมทรัพย์ซื้อ-เช่า พร้อมแผนที่ 3D แบบ Interactive",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="th" className={`${sarabun.variable} ${playfair.variable} h-full antialiased`}>
      {/* suppressHydrationWarning: browser extensions inject attributes (e.g. cz-shortcut-listen) into <body>. */}
      <body className="flex min-h-full flex-col" suppressHydrationWarning>
        <Navbar />
        <main className="flex flex-1 flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
