import Link from "next/link";
import { getCabins, getSettings } from "@/lib/content";
import { formatSAR } from "@/lib/format";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Gallery } from "@/components/Gallery";
import { SmartImage } from "@/components/SmartImage";
import { StickyBookBar } from "@/components/StickyBookBar";
import {
  BathIcon, BedIcon, CheckIcon, FlameIcon, LeafIcon,
  LockIcon, PinIcon, ShieldIcon, UsersIcon,
} from "@/components/Icons";

// Prices and cabin details are owner-editable, so re-render periodically
// rather than freezing them into the build.
export const revalidate = 60;

const PROMISES = [
  { icon: ShieldIcon, label: "خصوصية تامة" },
  { icon: FlameIcon, label: "أجواء دافئة" },
  { icon: LeafIcon, label: "جلسات خارجية" },
  { icon: LockIcon, label: "أمان وراحة" },
];

export default async function HomePage() {
  const [settings, cabins] = await Promise.all([getSettings(), getCabins()]);
  const galleryImages = cabins.flatMap((c) => c.images).slice(0, 9);
  const heroImage = cabins[0]?.images?.[0];

  return (
    <>
      <Header />

      <main className="pb-20 md:pb-0">
        {/* ---------------------------------------------------------- Hero */}
        <section className="night-gradient relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-10 opacity-35">
            <SmartImage
              src={heroImage}
              alt=""
              priority
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-espresso via-espresso/70 to-espresso/40" />

          <div className="mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-center px-4 pt-24 pb-14">
            <p className="animate-fade-up text-sm font-medium tracking-[0.2em] text-gold">
              TUVANA COTTAGES
            </p>

            <h1 className="animate-fade-up mt-4 max-w-2xl text-4xl leading-[1.25] font-extrabold text-cream sm:text-5xl md:text-6xl">
              لحظات من الهدوء
              <br />
              <span className="text-gold-soft">تصنع ذكريات لا تُنسى</span>
            </h1>

            <p className="animate-fade-up mt-5 max-w-lg text-base leading-relaxed text-cream/75 sm:text-lg">
              أكواخ خشبية دافئة بين جبال تنومة، مصممة لتمنحك خصوصية كاملة
              وراحة تستحقها.
            </p>

            <div className="animate-fade-up mt-8 flex flex-wrap items-center gap-3">
              <Link
                href="/booking"
                className="rounded-full bg-gold px-8 py-3.5 text-base font-bold text-espresso shadow-lg shadow-black/25 transition-transform hover:scale-[1.03] active:scale-95"
              >
                احجز كوخك الآن
              </Link>
              <Link
                href="#cabins"
                className="rounded-full border border-cream/25 px-8 py-3.5 text-base font-medium text-cream transition-colors hover:border-gold hover:text-gold"
              >
                تصفح الأكواخ
              </Link>
            </div>

            <div className="animate-fade-up mt-10 inline-flex w-fit items-center gap-2 rounded-full border border-cream/15 bg-cream/5 px-4 py-2 text-sm text-cream/80">
              <PinIcon className="h-4 w-4 text-gold" />
              {settings.address}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------ Promise strip */}
        <section className="border-b border-sand bg-cream">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-px overflow-hidden px-4 py-8 sm:grid-cols-4 sm:gap-6">
            {PROMISES.map(({ icon: Icon, label }) => (
              <div key={label} className="flex flex-col items-center gap-2.5 py-3 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bark text-gold">
                  <Icon className="h-6 w-6" />
                </span>
                <span className="text-sm font-bold text-bark">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* -------------------------------------------------------- About */}
        <section id="about" className="scroll-mt-20 bg-paper py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-4 text-center">
            <h2 className="text-3xl font-extrabold text-bark sm:text-4xl">عن المكان</h2>
            <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold" />
            <p className="mt-7 text-base leading-loose text-cocoa sm:text-lg">
              {settings.about}
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="rounded-xl2 border border-sand bg-cream p-5">
                <dt className="text-xs text-cocoa/70">تسجيل الدخول</dt>
                <dd className="mt-1 text-lg font-bold text-bark">{settings.check_in_time}</dd>
              </div>
              <div className="rounded-xl2 border border-sand bg-cream p-5">
                <dt className="text-xs text-cocoa/70">تسجيل الخروج</dt>
                <dd className="mt-1 text-lg font-bold text-bark">{settings.check_out_time}</dd>
              </div>
              <div className="col-span-2 rounded-xl2 border border-sand bg-cream p-5 sm:col-span-1">
                <dt className="text-xs text-cocoa/70">عدد الأكواخ</dt>
                <dd className="mt-1 text-lg font-bold text-bark">{cabins.length}</dd>
              </div>
            </dl>
          </div>
        </section>

        {/* ------------------------------------------------------- Cabins */}
        <section id="cabins" className="scroll-mt-20 bg-cream py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-bark sm:text-4xl">أكواخنا</h2>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold" />
            </div>

            <div className="mt-10 grid gap-7 md:grid-cols-2">
              {cabins.map((cabin) => (
                <article
                  key={cabin.id}
                  className="overflow-hidden rounded-xl2 border border-sand bg-paper shadow-sm transition-shadow hover:shadow-xl hover:shadow-bark/10"
                >
                  <div className="aspect-4/3 w-full overflow-hidden">
                    <SmartImage
                      src={cabin.images[0]}
                      alt={cabin.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-extrabold text-bark">{cabin.name}</h3>
                    {cabin.tagline && (
                      <p className="mt-1.5 text-sm text-caramel">{cabin.tagline}</p>
                    )}

                    <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-cocoa">
                      <span className="flex items-center gap-1.5">
                        <UsersIcon className="h-4 w-4 text-caramel" />
                        حتى {cabin.capacity} أشخاص
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BedIcon className="h-4 w-4 text-caramel" />
                        {cabin.bedrooms} غرف نوم
                      </span>
                      <span className="flex items-center gap-1.5">
                        <BathIcon className="h-4 w-4 text-caramel" />
                        {cabin.bathrooms} دورات مياه
                      </span>
                    </div>

                    {cabin.description && (
                      <p className="mt-4 text-sm leading-relaxed text-cocoa/85">
                        {cabin.description}
                      </p>
                    )}

                    <ul className="mt-4 flex flex-wrap gap-2">
                      {cabin.amenities.map((a) => (
                        <li
                          key={a}
                          className="flex items-center gap-1 rounded-full bg-sand/60 px-3 py-1 text-xs font-medium text-bark"
                        >
                          <CheckIcon className="h-3 w-3 text-moss" />
                          {a}
                        </li>
                      ))}
                    </ul>

                    <div className="mt-6 flex items-end justify-between border-t border-sand pt-5">
                      <div>
                        <div className="text-xs text-cocoa/70">تبدأ من</div>
                        <div className="text-2xl font-extrabold text-bark">
                          {formatSAR(cabin.price_weekday)}
                          <span className="mr-1 text-sm font-medium text-cocoa/70">ر.س / ليلة</span>
                        </div>
                        <div className="mt-0.5 text-xs text-cocoa/60">
                          نهاية الأسبوع {formatSAR(cabin.price_weekend)} ر.س
                        </div>
                      </div>
                      <Link
                        href={`/booking?cabin=${cabin.slug}`}
                        className="rounded-full bg-bark px-6 py-3 text-sm font-bold text-cream transition-transform hover:scale-[1.03] active:scale-95"
                      >
                        احجز
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ Gallery */}
        {galleryImages.length > 0 && (
          <section id="gallery" className="scroll-mt-20 bg-paper py-16 sm:py-20">
            <div className="mx-auto max-w-6xl px-4">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-bark sm:text-4xl">من داخل الأكواخ</h2>
                <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold" />
              </div>
              <div className="mt-10">
                <Gallery images={galleryImages} />
              </div>
            </div>
          </section>
        )}

        {/* ----------------------------------------------------- Location */}
        <section id="location" className="scroll-mt-20 bg-cream py-16 sm:py-20">
          <div className="mx-auto max-w-6xl px-4">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-bark sm:text-4xl">الموقع</h2>
              <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold" />
              <p className="mt-4 text-cocoa">{settings.address}</p>
            </div>

            <div className="mt-9 overflow-hidden rounded-xl2 border border-sand shadow-sm">
              {settings.latitude != null && settings.longitude != null ? (
                <iframe
                  title="موقع أكواخ توفانا على الخريطة"
                  src={`https://maps.google.com/maps?q=${settings.latitude},${settings.longitude}&z=15&output=embed`}
                  className="h-[320px] w-full sm:h-[420px]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              ) : (
                <div className="night-gradient flex h-[240px] flex-col items-center justify-center gap-4 px-6 text-center sm:h-[300px]">
                  <PinIcon className="h-10 w-10 text-gold" />
                  <p className="text-cream/80">اضغط لفتح الموقع في تطبيق الخرائط</p>
                </div>
              )}
            </div>

            {settings.map_url && (
              <div className="mt-5 text-center">
                <a
                  href={settings.map_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-bark px-7 py-3 text-sm font-bold text-cream transition-transform hover:scale-[1.03] active:scale-95"
                >
                  <PinIcon className="h-4 w-4" />
                  افتح في خرائط جوجل
                </a>
              </div>
            )}
          </div>
        </section>

        {/* ----------------------------------------------------- Policies */}
        {settings.policies.length > 0 && (
          <section className="bg-paper py-16 sm:py-20">
            <div className="mx-auto max-w-3xl px-4">
              <div className="text-center">
                <h2 className="text-3xl font-extrabold text-bark sm:text-4xl">شروط الحجز</h2>
                <div className="mx-auto mt-4 h-1 w-16 rounded-full bg-gold" />
              </div>
              <ul className="mt-9 space-y-3">
                {settings.policies.map((p) => (
                  <li
                    key={p}
                    className="flex items-start gap-3 rounded-xl2 border border-sand bg-cream p-4 text-sm leading-relaxed text-cocoa"
                  >
                    <CheckIcon className="mt-0.5 h-4 w-4 shrink-0 text-moss" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* ---------------------------------------------------- Final CTA */}
        <section className="night-gradient py-16 text-center sm:py-20">
          <div className="mx-auto max-w-2xl px-4">
            <h2 className="text-3xl font-extrabold text-cream sm:text-4xl">
              جاهز لتجربة الهدوء؟
            </h2>
            <p className="mt-4 text-cream/70">
              اختر تاريخك واحجز خلال دقيقة — بدون دفع إلكتروني، التحويل مباشر على حساب المالك.
            </p>
            <Link
              href="/booking"
              className="mt-8 inline-block rounded-full bg-gold px-10 py-4 text-base font-bold text-espresso shadow-lg shadow-black/25 transition-transform hover:scale-[1.03] active:scale-95"
            >
              احجز الآن
            </Link>
          </div>
        </section>
      </main>

      <Footer settings={settings} />
      <StickyBookBar phone={settings.phone} whatsapp={settings.whatsapp} />
    </>
  );
}
