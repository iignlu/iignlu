import Link from "next/link";
import { Logo } from "./Logo";
import { PhoneIcon, PinIcon, WhatsappIcon } from "./Icons";
import { whatsappLink } from "@/lib/format";
import type { Settings } from "@/lib/types";

export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="night-gradient text-cream">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/70">
              لحظات من الهدوء تصنع ذكريات لا تُنسى.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wide text-gold">تواصل معنا</h3>
            <ul className="space-y-3 text-sm text-cream/80">
              <li>
                <a href={`tel:${settings.phone}`} className="flex items-center gap-2.5 hover:text-gold">
                  <PhoneIcon className="h-4 w-4 shrink-0" />
                  <span dir="ltr">{settings.phone}</span>
                </a>
              </li>
              <li>
                <a
                  href={whatsappLink(settings.whatsapp, "السلام عليكم، أرغب بالاستفسار عن أكواخ توفانا")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2.5 hover:text-gold"
                >
                  <WhatsappIcon className="h-4 w-4 shrink-0" />
                  واتساب
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <PinIcon className="h-4 w-4 shrink-0" />
                {settings.address}
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-bold tracking-wide text-gold">روابط</h3>
            <ul className="space-y-3 text-sm text-cream/80">
              <li><Link href="/booking" className="hover:text-gold">حجز جديد</Link></li>
              <li><Link href="/my-booking" className="hover:text-gold">متابعة حجزي</Link></li>
              <li><Link href="/#location" className="hover:text-gold">الموقع على الخريطة</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-cream/10 pt-6 text-center text-xs text-cream/50">
          © {new Date().getFullYear()} {settings.brand_name} — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
