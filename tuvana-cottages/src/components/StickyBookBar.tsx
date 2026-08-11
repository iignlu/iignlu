import Link from "next/link";
import { PhoneIcon, WhatsappIcon } from "./Icons";
import { whatsappLink } from "@/lib/format";

/**
 * Fixed action bar for phones. Most guests arrive on mobile, so booking
 * and calling stay within thumb reach no matter how far they scroll.
 * Hidden on desktop, where the header CTA is always visible instead.
 */
export function StickyBookBar({ phone, whatsapp }: { phone: string; whatsapp: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-paper/95 px-3 py-2.5 backdrop-blur md:hidden">
      <div className="flex items-center gap-2">
        <a
          href={`tel:${phone}`}
          aria-label="اتصال"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sand text-cocoa active:scale-95"
        >
          <PhoneIcon className="h-5 w-5" />
        </a>
        <a
          href={whatsappLink(whatsapp, "السلام عليكم، أرغب بالاستفسار عن أكواخ توفانا")}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="واتساب"
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-sand text-moss active:scale-95"
        >
          <WhatsappIcon className="h-5 w-5" />
        </a>
        <Link
          href="/booking"
          className="flex h-12 flex-1 items-center justify-center rounded-xl bg-bark text-base font-bold text-cream active:scale-[0.98]"
        >
          احجز الآن
        </Link>
      </div>
    </div>
  );
}
