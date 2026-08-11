/** Money, phone numbers and WhatsApp links — shared by guest and admin views. */

export function formatSAR(amount: number): string {
  return new Intl.NumberFormat("ar-SA", {
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
    minimumFractionDigits: 0,
  }).format(amount);
}

/**
 * Turn whatever the guest typed into an international number so the
 * WhatsApp link works: 05xxxxxxxx → 9665xxxxxxxx.
 */
export function toInternational(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("966")) return digits;
  if (digits.startsWith("0")) return `966${digits.slice(1)}`;
  if (digits.startsWith("5") && digits.length === 9) return `966${digits}`;
  return digits;
}

/** Saudi mobile numbers, in any of the forms people actually type. */
export function isValidSaudiMobile(phone: string): boolean {
  return /^9665\d{8}$/.test(toInternational(phone));
}

export function whatsappLink(number: string, message: string): string {
  return `https://wa.me/${toInternational(number)}?text=${encodeURIComponent(message)}`;
}

/** Groups an IBAN into fours so it can be read off a phone screen. */
export function formatIban(iban: string): string {
  return iban.replace(/\s/g, "").replace(/(.{4})/g, "$1 ").trim();
}
