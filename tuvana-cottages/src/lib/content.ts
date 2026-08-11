import { db, isDbConfigured } from "./supabase";
import type { Cabin, Settings } from "./types";

/**
 * Content layer for the public pages.
 *
 * Before the owner connects Supabase these fall back to demo content
 * that mirrors supabase/seed.sql, so the site can be previewed and
 * deployed on day one and the real data simply replaces it later.
 */

const DEMO_SETTINGS: Settings = {
  brand_name: "أكواخ توفانا",
  brand_name_en: "Tuvana Cottages",
  about:
    "أكواخ توفانا في قلب تنومة بمنطقة عسير، حيث الهدوء والجبال والأجواء الدافئة. صممنا المكان ليمنحك خصوصية تامة وراحة كاملة، مع جلسات خارجية تطل على الطبيعة وتفاصيل دافئة في كل زاوية.",
  phone: "0534007175",
  whatsapp: "966534007175",
  address: "منطقة عسير - تنومة",
  map_url: "https://maps.app.goo.gl/4TCHvz6PCBJpBJXK9",
  latitude: null,
  longitude: null,
  bank_name: "مصرف الراجحي",
  account_name: "اسم صاحب الحساب",
  iban: "SA0000000000000000000000",
  hold_minutes: 15,
  deposit_percent: 100,
  check_in_time: "4:00 م",
  check_out_time: "12:00 م",
  policies: [
    "الحجز يبدأ من الساعة 4:00 مساءً وينتهي الساعة 12:00 ظهرًا",
    "الإلغاء المجاني قبل 48 ساعة من موعد الوصول",
    "التدخين ممنوع داخل الكوخ",
    "يمنع إقامة الحفلات أو إصدار الإزعاج احترامًا للجيران",
  ],
};

const DEMO_CABINS: Cabin[] = [
  {
    id: "demo-1",
    slug: "tuvana-1",
    name: "كوخ توفانا الأول",
    tagline: "إطلالة على الجبل وجلسة خارجية دافئة",
    description:
      "كوخ خشبي بتصميم دافئ يتسع لعائلة كاملة، يضم صالة واسعة ومطبخًا مجهزًا وجلسة خارجية مطلة على الجبال. مثالي لقضاء ليلة هادئة بعيدًا عن الزحام.",
    capacity: 6,
    bedrooms: 2,
    bathrooms: 2,
    price_weekday: 600,
    price_weekend: 850,
    images: [
      "/images/cabins/cabin-1-a.jpg",
      "/images/cabins/cabin-1-b.jpg",
      "/images/cabins/cabin-1-c.jpg",
    ],
    amenities: ["واي فاي", "مطبخ مجهز", "جلسة خارجية", "مدفأة", "موقف خاص", "تكييف"],
    sort_order: 1,
    is_active: true,
  },
  {
    id: "demo-2",
    slug: "tuvana-2",
    name: "كوخ توفانا الثاني",
    tagline: "خصوصية تامة ومساحة عائلية",
    description:
      "كوخ من دورين بمساحة أوسع، يوفر خصوصية كاملة ومدخلًا مستقلًا، مع جلسة نار خارجية ومساحة خضراء محيطة.",
    capacity: 8,
    bedrooms: 3,
    bathrooms: 2,
    price_weekday: 750,
    price_weekend: 1000,
    images: ["/images/cabins/cabin-2-a.jpg", "/images/cabins/cabin-2-b.jpg"],
    amenities: ["واي فاي", "مطبخ مجهز", "جلسة نار", "مسبح خاص", "موقف خاص", "شواية"],
    sort_order: 2,
    is_active: true,
  },
];

function normalizeCabin(row: Record<string, unknown>): Cabin {
  return {
    ...(row as unknown as Cabin),
    price_weekday: Number(row.price_weekday),
    price_weekend: Number(row.price_weekend),
    images: Array.isArray(row.images) ? (row.images as string[]) : [],
    amenities: Array.isArray(row.amenities) ? (row.amenities as string[]) : [],
  };
}

export async function getSettings(): Promise<Settings> {
  if (!isDbConfigured) return DEMO_SETTINGS;
  const { data, error } = await db()
    .from("settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error || !data) return DEMO_SETTINGS;
  return {
    ...DEMO_SETTINGS,
    ...(data as Partial<Settings>),
    policies: Array.isArray(data.policies) ? (data.policies as string[]) : [],
  };
}

export async function getCabins(): Promise<Cabin[]> {
  if (!isDbConfigured) return DEMO_CABINS;
  const { data, error } = await db()
    .from("cabins")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return DEMO_CABINS;
  return data.map(normalizeCabin);
}

export async function getCabin(slug: string): Promise<Cabin | null> {
  const cabins = await getCabins();
  return cabins.find((c) => c.slug === slug) ?? null;
}
