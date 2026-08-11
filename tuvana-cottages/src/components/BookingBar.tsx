import Link from "next/link";
import { formatSAR } from "@/lib/format";

/**
 * The only permanent interface element on the site.
 *
 * A photo-led page has nowhere obvious to put a call to action, so this
 * thin bar stays pinned at the bottom on every screen size and holds the
 * price and the one button that matters.
 */
export function BookingBar({ fromPrice }: { fromPrice: number }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-cream/10 bg-espresso/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <div className="leading-tight">
          <div className="text-[11px] text-cream/55">تبدأ من</div>
          <div className="text-base font-bold text-cream">
            {formatSAR(fromPrice)}
            <span className="mr-1 text-xs font-normal text-cream/60">ر.س / ليلة</span>
          </div>
        </div>

        <Link
          href="/booking"
          className="rounded-full bg-gold px-8 py-3 text-sm font-bold text-espresso transition-transform active:scale-95"
        >
          احجز
        </Link>
      </div>
    </div>
  );
}
