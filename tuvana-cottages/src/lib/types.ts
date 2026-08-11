export type BookingStatus =
  | "pending_payment"
  | "awaiting_review"
  | "confirmed"
  | "rejected"
  | "cancelled"
  | "expired";

export type Cabin = {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  price_weekday: number;
  price_weekend: number;
  images: string[];
  amenities: string[];
  sort_order: number;
  is_active: boolean;
};

export type Booking = {
  id: string;
  ref_code: string;
  cabin_id: string;
  guest_name: string | null;
  guest_phone: string | null;
  guests_count: number | null;
  notes: string | null;
  check_in: string;
  check_out: string;
  nights: number;
  total_amount: number;
  status: BookingStatus;
  hold_expires_at: string | null;
  paid_declared_at: string | null;
  receipt_path: string | null;
  admin_note: string | null;
  is_block: boolean;
  created_at: string;
};

export type Settings = {
  brand_name: string;
  brand_name_en: string;
  about: string | null;
  phone: string;
  whatsapp: string;
  address: string;
  map_url: string | null;
  latitude: number | null;
  longitude: number | null;
  bank_name: string | null;
  account_name: string | null;
  iban: string | null;
  hold_minutes: number;
  deposit_percent: number;
  check_in_time: string;
  check_out_time: string;
  policies: string[];
};

/** Arabic labels for every booking state, used by guests and by the owner. */
export const STATUS_LABEL: Record<BookingStatus, string> = {
  pending_payment: "بانتظار التحويل",
  awaiting_review: "بانتظار تأكيد المالك",
  confirmed: "حجز مؤكد",
  rejected: "تم رفض الإيصال",
  cancelled: "ملغي",
  expired: "انتهت مهلة الحجز",
};
