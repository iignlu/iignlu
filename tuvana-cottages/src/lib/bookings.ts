import { db, isDbConfigured } from "./supabase";
import type { Booking } from "./types";

/** Server-side reads of a single booking. Never import from a client component. */

export type BookingWithCabin = Booking & {
  cabins: { name: string; slug: string; images: string[] } | null;
};

function normalize(row: Record<string, unknown>): BookingWithCabin {
  return {
    ...(row as unknown as BookingWithCabin),
    total_amount: Number(row.total_amount),
  };
}

export async function getBookingByRef(ref: string): Promise<BookingWithCabin | null> {
  if (!isDbConfigured) return null;
  const { data, error } = await db()
    .from("bookings")
    .select("*, cabins(name, slug, images)")
    .eq("ref_code", ref.toUpperCase())
    .eq("is_block", false)
    .maybeSingle();

  if (error || !data) return null;
  return normalize(data);
}

/**
 * Whether a hold is still live. Computed from the timestamp rather than
 * the stored status, because the sweep that flips pending_payment to
 * expired may not have run yet — the timestamp is the real authority.
 */
export function isHoldLive(booking: Pick<Booking, "status" | "hold_expires_at">): boolean {
  if (booking.status !== "pending_payment") return false;
  if (!booking.hold_expires_at) return false;
  return new Date(booking.hold_expires_at).getTime() > Date.now();
}

/** What the guest should actually be shown, accounting for a lapsed hold. */
export function effectiveStatus(booking: Booking): Booking["status"] {
  if (booking.status === "pending_payment" && !isHoldLive(booking)) return "expired";
  return booking.status;
}

/** Hide most of the phone number in anything rendered to a page. */
export function maskPhone(phone: string | null): string {
  if (!phone) return "";
  const tail = phone.slice(-3);
  return `${"•".repeat(Math.max(phone.length - 3, 3))}${tail}`;
}

/** First name only, so a reference code alone never exposes a full identity. */
export function firstName(name: string | null): string {
  if (!name) return "ضيفنا";
  return name.trim().split(/\s+/)[0];
}
