import { NextResponse } from "next/server";
import { db, isDbConfigured, translateDbError } from "@/lib/supabase";
import { isValidISO, nightsBetween, todayISO, addDays } from "@/lib/dates";
import { isValidSaudiMobile, toInternational } from "@/lib/format";

export const dynamic = "force-dynamic";

const MAX_NIGHTS = 30;
const MAX_DAYS_AHEAD = 365;

/**
 * Create a booking and start the hold timer.
 *
 * All validation is repeated here even though the client already checked:
 * the request can be replayed with anything. The final word on both
 * availability and price belongs to create_booking() in Postgres.
 */
export async function POST(request: Request) {
  if (!isDbConfigured) {
    return NextResponse.json(
      { error: "الحجز غير مفعّل بعد. الرجاء التواصل معنا عبر واتساب." },
      { status: 503 },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "طلب غير صحيح" }, { status: 400 });
  }

  const slug = String(body.cabin ?? "");
  const checkIn = String(body.check_in ?? "");
  const checkOut = String(body.check_out ?? "");
  const name = String(body.name ?? "").trim();
  const phoneRaw = String(body.phone ?? "").trim();
  const guests = Number(body.guests);
  const notes = body.notes ? String(body.notes).trim().slice(0, 500) : null;

  if (!slug) {
    return NextResponse.json({ error: "الرجاء اختيار الكوخ" }, { status: 400 });
  }
  if (!isValidISO(checkIn) || !isValidISO(checkOut)) {
    return NextResponse.json({ error: "الرجاء اختيار تواريخ صحيحة" }, { status: 400 });
  }
  if (checkIn < todayISO()) {
    return NextResponse.json({ error: "لا يمكن الحجز في تاريخ مضى" }, { status: 400 });
  }
  if (checkIn > addDays(todayISO(), MAX_DAYS_AHEAD)) {
    return NextResponse.json({ error: "الحجز متاح حتى سنة قادمة فقط" }, { status: 400 });
  }

  const nights = nightsBetween(checkIn, checkOut);
  if (nights < 1) {
    return NextResponse.json({ error: "يجب أن تكون ليلة واحدة على الأقل" }, { status: 400 });
  }
  if (nights > MAX_NIGHTS) {
    return NextResponse.json(
      { error: `الحد الأقصى ${MAX_NIGHTS} ليلة في الحجز الواحد` },
      { status: 400 },
    );
  }
  if (name.length < 3 || name.length > 80) {
    return NextResponse.json({ error: "الرجاء إدخال الاسم كاملًا" }, { status: 400 });
  }
  if (!isValidSaudiMobile(phoneRaw)) {
    return NextResponse.json(
      { error: "رقم جوال غير صحيح. مثال: 05xxxxxxxx" },
      { status: 400 },
    );
  }
  if (!Number.isInteger(guests) || guests < 1 || guests > 50) {
    return NextResponse.json({ error: "عدد الضيوف غير صحيح" }, { status: 400 });
  }

  const supabase = db();

  const { data: cabin, error: cabinError } = await supabase
    .from("cabins")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (cabinError || !cabin) {
    return NextResponse.json({ error: "الكوخ غير متاح" }, { status: 404 });
  }

  const { data, error } = await supabase.rpc("create_booking", {
    p_cabin: cabin.id,
    p_check_in: checkIn,
    p_check_out: checkOut,
    p_name: name,
    p_phone: toInternational(phoneRaw),
    p_guests: guests,
    p_notes: notes,
  });

  if (error) {
    // "dates_unavailable" is the expected outcome of losing a race for the
    // same nights, not a server fault — tell the guest to pick again.
    const message = translateDbError(error.message);
    const status = error.message?.includes("dates_unavailable") ? 409 : 400;
    return NextResponse.json({ error: message }, { status });
  }

  const booking = Array.isArray(data) ? data[0] : data;
  return NextResponse.json({ ref_code: booking.ref_code }, { status: 201 });
}
