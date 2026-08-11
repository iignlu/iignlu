import type { Metadata, Viewport } from "next";
import { Tajawal } from "next/font/google";
import "./globals.css";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800"],
  variable: "--font-tajawal",
  display: "swap",
});

export const metadata: Metadata = {
  title: "أكواخ توفانا | Tuvana Cottages — تنومة، عسير",
  description:
    "أكواخ توفانا في تنومة بمنطقة عسير. خصوصية تامة، جلسات خارجية، وأجواء دافئة. احجز كوخك مباشرة عبر الموقع.",
  keywords: [
    "أكواخ توفانا", "شاليهات تنومة", "أكواخ عسير", "حجز أكواخ",
    "تنومة", "عسير", "Tuvana Cottages",
  ],
  openGraph: {
    title: "أكواخ توفانا | لحظات من الهدوء تصنع ذكريات لا تُنسى",
    description: "أكواخ خشبية بخصوصية تامة في تنومة، منطقة عسير. احجز مباشرة.",
    locale: "ar_SA",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#23150d",
  width: "device-width",
  initialScale: 1,
  // Guests pinch-zoom photos and IBANs on a phone; never lock that out.
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={tajawal.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
