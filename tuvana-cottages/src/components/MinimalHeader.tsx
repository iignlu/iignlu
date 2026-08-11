import Link from "next/link";
import { LogoMark } from "./Logo";

/**
 * Wordmark and a single link. There is no navigation menu: the page is a
 * scroll of photos, so there is nowhere to navigate to.
 */
export function MinimalHeader() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-5">
        <Link href="/" className="flex items-center gap-2 text-cream" aria-label="أكواخ توفانا">
          <LogoMark className="h-7 w-7 text-gold" />
          <span className="text-base font-bold">توفانا</span>
        </Link>

        <Link
          href="/my-booking"
          className="text-xs font-medium text-cream/70 underline-offset-4 hover:text-gold hover:underline"
        >
          حجزي
        </Link>
      </div>
    </header>
  );
}
