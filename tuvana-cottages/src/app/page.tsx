import Link from "next/link";
import { getCabins, getSettings } from "@/lib/content";
import { formatSAR } from "@/lib/format";
import { Footer } from "@/components/Footer";
import { MinimalHeader } from "@/components/MinimalHeader";
import { PhotoPanel } from "@/components/PhotoPanel";
import { BookingBar } from "@/components/BookingBar";

export const revalidate = 60;

export default async function HomePage() {
  const [settings, cabins] = await Promise.all([getSettings(), getCabins()]);

  // Every photo, in order, tagged with the cabin it belongs to. The first
  // photo of each cabin carries that cabin's line; the rest are silent.
  const photos = cabins.flatMap((cabin) =>
    cabin.images.map((src, index) => ({
      src,
      alt: cabin.name,
      caption: index === 0 ? (cabin.tagline ?? undefined) : undefined,
    })),
  );

  const [hero, ...rest] = photos;
  const fromPrice = Math.min(...cabins.map((c) => c.price_weekday));

  return (
    <>
      {/* ------------------------------------------------------------ Hero */}
      <div className="relative">
        <MinimalHeader />
        <PhotoPanel
          src={hero?.src}
          alt="أكواخ توفانا"
          tone={0}
          height="h-svh"
          priority
        >
          <div className="pb-2">
            <h1 className="text-5xl leading-[1.15] font-extrabold text-cream sm:text-6xl">
              أكواخ توفانا
            </h1>
            <p className="mt-3 text-xs tracking-[0.3em] text-gold">
              TUVANA COTTAGES
            </p>
            <p className="mt-6 text-sm text-cream/70">{settings.address}</p>
          </div>
        </PhotoPanel>
      </div>

      {/* --------------------------------------------- The flyer's promise */}
      <div className="bg-cream px-6 py-7 text-center">
        <p className="text-[11px] leading-relaxed tracking-[0.18em] text-cocoa sm:text-xs">
          خصوصية تامة &nbsp;·&nbsp; أجواء دافئة &nbsp;·&nbsp; جلسات خارجية
          &nbsp;·&nbsp; أمان وراحة
        </p>
      </div>

      {rest[0] && (
        <PhotoPanel
          src={rest[0].src}
          alt={rest[0].alt}
          caption={rest[0].caption}
          tone={1}
        />
      )}

      {/* ---------------------------------------------------------- About */}
      <div className="bg-paper px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-xl">
          <p className="text-xl leading-[2] font-medium text-bark sm:text-2xl">
            {settings.about}
          </p>
          <div className="mt-8 flex gap-8 text-sm text-cocoa/70">
            <span>الدخول {settings.check_in_time}</span>
            <span>الخروج {settings.check_out_time}</span>
          </div>
        </div>
      </div>

      {rest.slice(1, 3).map((photo, i) => (
        <PhotoPanel
          key={`${photo.src}-${i}`}
          src={photo.src}
          alt={photo.alt}
          caption={photo.caption}
          tone={i + 2}
        />
      ))}

      {/* --------------------------------------------------------- Cabins */}
      <div className="bg-paper px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-xl">
          {cabins.map((cabin, i) => (
            <div
              key={cabin.id}
              className="border-t border-sand py-9 first:border-t-0 first:pt-0"
            >
              <div className="text-xs font-medium text-caramel">
                {String(i + 1).padStart(2, "0")}
              </div>

              <h2 className="mt-2 text-2xl font-extrabold text-bark sm:text-3xl">
                {cabin.name}
              </h2>

              <p className="mt-2.5 text-sm text-cocoa/75">
                {cabin.bedrooms} غرف نوم &nbsp;·&nbsp; حتى {cabin.capacity} أشخاص
                &nbsp;·&nbsp; {cabin.bathrooms} دورات مياه
              </p>

              <p className="mt-4 text-base leading-loose text-cocoa">
                {cabin.description}
              </p>

              <p className="mt-5 text-sm text-cocoa/70">
                {cabin.amenities.join(" · ")}
              </p>

              <div className="mt-7 flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-bark">
                  {formatSAR(cabin.price_weekday)} ر.س
                </span>
                <span className="text-sm text-cocoa/60">
                  الليلة · نهاية الأسبوع {formatSAR(cabin.price_weekend)}
                </span>
              </div>

              <Link
                href={`/booking?cabin=${cabin.slug}`}
                className="mt-5 inline-block border-b-2 border-gold pb-1 text-sm font-bold text-bark transition-colors hover:text-caramel"
              >
                احجز هذا الكوخ
              </Link>
            </div>
          ))}
        </div>
      </div>

      {rest.slice(3).map((photo, i) => (
        <PhotoPanel
          key={`${photo.src}-tail-${i}`}
          src={photo.src}
          alt={photo.alt}
          caption={photo.caption}
          tone={i + 4}
        />
      ))}

      {/* ------------------------------------------------------- Location */}
      <div className="bg-cream px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-xl">
          <h2 className="text-2xl font-extrabold text-bark">الموقع</h2>
          <p className="mt-3 text-base text-cocoa">{settings.address}</p>

          {settings.latitude != null && settings.longitude != null && (
            <iframe
              title="موقع أكواخ توفانا على الخريطة"
              src={`https://maps.google.com/maps?q=${settings.latitude},${settings.longitude}&z=15&output=embed`}
              className="mt-7 h-[300px] w-full border border-sand"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}

          {settings.map_url && (
            <a
              href={settings.map_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block border-b-2 border-gold pb-1 text-sm font-bold text-bark transition-colors hover:text-caramel"
            >
              افتح في خرائط جوجل
            </a>
          )}
        </div>
      </div>

      <Footer settings={settings} />
      <BookingBar fromPrice={fromPrice} />
    </>
  );
}
