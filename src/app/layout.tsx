import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";
import "./globals.css";

const fa = Vazirmatn({ subsets: ["arabic", "latin"], variable: "--font-fa" });

export const metadata: Metadata = { title: "بانک پارسیان", description: "تجربه‌ی تعاملی بانک پارسیان" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fa" dir="rtl" className={fa.variable}>
      <body>{children}</body>
    </html>
  );
}
