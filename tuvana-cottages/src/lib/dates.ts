/**
 * Calendar dates are handled as plain "YYYY-MM-DD" strings throughout the
 * app. A stay is a half-open range [checkIn, checkOut): the checkout day
 * itself is never occupied, so a guest can check in the morning another
 * checks out. Everything below works in UTC so a server in one timezone
 * and a phone in another always agree on which day is which.
 */

export type ISODate = string;

export function toISO(d: Date): ISODate {
  return d.toISOString().slice(0, 10);
}

export function parseISO(s: ISODate): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function addDays(s: ISODate, n: number): ISODate {
  const d = parseISO(s);
  d.setUTCDate(d.getUTCDate() + n);
  return toISO(d);
}

export function addMonths(s: ISODate, n: number): ISODate {
  const d = parseISO(s);
  d.setUTCMonth(d.getUTCMonth() + n);
  return toISO(d);
}

/** Today in Riyadh (UTC+3), which is the day the guest actually sees. */
export function todayISO(): ISODate {
  return new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function nightsBetween(checkIn: ISODate, checkOut: ISODate): number {
  return Math.round(
    (parseISO(checkOut).getTime() - parseISO(checkIn).getTime()) / 86_400_000,
  );
}

/** Every night occupied by a stay — i.e. excluding the checkout day. */
export function nightsInRange(checkIn: ISODate, checkOut: ISODate): ISODate[] {
  const out: ISODate[] = [];
  for (let d = checkIn; d < checkOut; d = addDays(d, 1)) out.push(d);
  return out;
}

export function isValidISO(s: unknown): s is ISODate {
  return typeof s === "string" && /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(parseISO(s).getTime());
}

export const AR_MONTHS = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

/** Week starts on Sunday, matching Saudi calendars. */
export const AR_WEEKDAYS_SHORT = ["أحد", "إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت"];

export function formatArabicDate(s: ISODate): string {
  const d = parseISO(s);
  return `${d.getUTCDate()} ${AR_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

export function formatMonthTitle(s: ISODate): string {
  const d = parseISO(s);
  return `${AR_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Saudi weekend: the nights beginning Thursday and Friday. */
export function isWeekendNight(s: ISODate): boolean {
  const dow = parseISO(s).getUTCDay();
  return dow === 4 || dow === 5;
}

/**
 * Price a stay client-side so the guest sees a live total while picking
 * dates. Purely cosmetic — the amount actually charged is recomputed by
 * calc_stay_price() in Postgres when the booking is created.
 */
export function estimateTotal(
  checkIn: ISODate,
  checkOut: ISODate,
  priceWeekday: number,
  priceWeekend: number,
): number {
  return nightsInRange(checkIn, checkOut).reduce(
    (sum, night) => sum + (isWeekendNight(night) ? priceWeekend : priceWeekday),
    0,
  );
}

/** Grid of a month padded to whole weeks, Sunday-first. null = padding cell. */
export function monthGrid(anchor: ISODate): (ISODate | null)[] {
  const d = parseISO(anchor);
  const year = d.getUTCFullYear();
  const month = d.getUTCMonth();
  const first = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();

  const cells: (ISODate | null)[] = [];
  for (let i = 0; i < first.getUTCDay(); i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) {
    cells.push(toISO(new Date(Date.UTC(year, month, day))));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}
