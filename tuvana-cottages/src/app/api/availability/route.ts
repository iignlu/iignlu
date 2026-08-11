import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/supabase";
import { isValidISO } from "@/lib/dates";

export const dynamic = "force-dynamic";

/**
 * Nights that cannot be booked in a window.
 *
 * Never cached: a hold taken ten seconds ago has to show up here, and an
 * expired one has to disappear. unavailable_dates() evaluates
 * hold_expires_at against now() on every call, so this is always live.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("cabin");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  if (!slug || !isValidISO(from) || !isValidISO(to)) {
    return NextResponse.json({ error: "معطيات غير صحيحة" }, { status: 400 });
  }

  // Before Supabase is connected, everything reads as available so the
  // calendar can still be demonstrated.
  if (!isDbConfigured) {
    return NextResponse.json({ dates: [], configured: false });
  }

  const supabase = db();

  const { data: cabin, error: cabinError } = await supabase
    .from("cabins")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (cabinError || !cabin) {
    return NextResponse.json({ error: "الكوخ غير موجود" }, { status: 404 });
  }

  const { data, error } = await supabase.rpc("unavailable_dates", {
    p_cabin: cabin.id,
    p_from: from,
    p_to: to,
  });

  if (error) {
    return NextResponse.json({ error: "تعذر جلب التواريخ" }, { status: 500 });
  }

  // The function returns a set of dates; normalise to plain YYYY-MM-DD.
  const dates = (data as unknown as (string | { unavailable_dates: string })[] | null)?.map((row) =>
    typeof row === "string" ? row : row.unavailable_dates,
  ) ?? [];

  return NextResponse.json(
    { dates, configured: true },
    { headers: { "Cache-Control": "no-store" } },
  );
}
