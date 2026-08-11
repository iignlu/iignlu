import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the service role key.
 *
 * Every table has RLS enabled with no policies, so this key is the only
 * way into the data — which is why it must never be imported from a
 * client component. Guest phone numbers and transfer receipts stay on
 * the server.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * False until the owner fills in .env. The site is designed to stay
 * fully browsable in that state: the home page falls back to demo
 * content so it can be previewed and deployed before the database
 * exists, and the booking flow says so plainly instead of erroring.
 */
export const isDbConfigured = Boolean(url && serviceKey);

let cached: SupabaseClient | null = null;

export function db(): SupabaseClient {
  if (!isDbConfigured) {
    throw new Error("DB_NOT_CONFIGURED");
  }
  if (!cached) {
    cached = createClient(url!, serviceKey!, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}

/**
 * Postgres raises our domain errors as plain messages (`dates_unavailable`,
 * `hold_expired_or_not_found`, …). Map them to Arabic the guest can act on.
 */
export function translateDbError(message: string): string {
  const text = message || "";
  if (text.includes("dates_unavailable"))
    return "عذرًا، تم حجز أحد التواريخ المختارة للتو. الرجاء اختيار تواريخ أخرى.";
  if (text.includes("hold_expired_or_not_found"))
    return "انتهت مهلة الحجز أو أن البيانات غير صحيحة. الرجاء إعادة الحجز.";
  if (text.includes("invalid_range"))
    return "تواريخ غير صحيحة. تاريخ المغادرة يجب أن يكون بعد تاريخ الوصول.";
  if (text.includes("past_date"))
    return "لا يمكن الحجز في تاريخ مضى.";
  if (text.includes("invalid_guests"))
    return "عدد الضيوف غير مناسب لسعة الكوخ.";
  if (text.includes("cabin_not_found"))
    return "الكوخ غير متاح حاليًا.";
  return "حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.";
}
