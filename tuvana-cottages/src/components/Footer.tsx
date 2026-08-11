import { whatsappLink } from "@/lib/format";
import type { Settings } from "@/lib/types";

/** Three lines of contact detail. Nothing else belongs down here. */
export function Footer({ settings }: { settings: Settings }) {
  return (
    <footer className="bg-espresso px-6 pt-16 pb-28 text-cream">
      <div className="mx-auto max-w-5xl">
        <div className="text-2xl font-extrabold">أكواخ توفانا</div>
        <div className="mt-1 text-[10px] tracking-[0.32em] text-cream/45">
          TUVANA COTTAGES
        </div>

        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3 text-sm text-cream/70">
          <a href={`tel:${settings.phone}`} className="hover:text-gold" dir="ltr">
            {settings.phone}
          </a>
          <a
            href={whatsappLink(settings.whatsapp, "السلام عليكم، أرغب بالاستفسار عن أكواخ توفانا")}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold"
          >
            واتساب
          </a>
          {settings.map_url && (
            <a
              href={settings.map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-gold"
            >
              {settings.address}
            </a>
          )}
        </div>

        <div className="mt-10 text-xs text-cream/30">
          © {new Date().getFullYear()} — جميع الحقوق محفوظة
        </div>
      </div>
    </footer>
  );
}
