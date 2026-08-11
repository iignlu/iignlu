"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";

const LINKS = [
  { href: "/#cabins", label: "الأكواخ" },
  { href: "/#about", label: "عن المكان" },
  { href: "/#gallery", label: "الصور" },
  { href: "/#location", label: "الموقع" },
  { href: "/my-booking", label: "حجزي" },
];

export function Header() {
  // Transparent over the hero photo, solid once the guest scrolls past it.
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "bg-espresso/95 shadow-lg shadow-espresso/20 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" aria-label="أكواخ توفانا — الصفحة الرئيسية">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-cream/85 transition-colors hover:text-gold"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/booking"
          className="rounded-full bg-gold px-5 py-2 text-sm font-bold text-espresso transition-transform hover:scale-[1.03] active:scale-95"
        >
          احجز الآن
        </Link>
      </div>
    </header>
  );
}
