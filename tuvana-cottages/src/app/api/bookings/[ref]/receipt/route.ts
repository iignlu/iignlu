import { NextResponse } from "next/server";
import { db, isDbConfigured, translateDbError } from "@/lib/supabase";
import { toInternational } from "@/lib/format";

export const dynamic = "force-dynamic";

const MAX_BYTES = 6 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "application/pdf"];

/**
 * Guest declares they transferred the money and attaches the receipt.
 *
 * The phone number they booked with acts as the shared secret: knowing a
 * reference code alone is not enough to touch someone else's booking.
 * mark_paid() enforces that match in SQL, and refuses once the hold has
 * lapsed, so a late upload cannot revive a released date.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ ref: string }> },
) {
  if (!isDbConfigured) {
    return NextResponse.json({ error: "الخدمة غير مفعّلة" }, { status: 503 });
  }

  const { ref } = await params;
  const refCode = ref.toUpperCase();

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ error: "طلب غير صحيح" }, { status: 400 });
  }

  const phone = toInternational(String(form.get("phone") ?? ""));
  const file = form.get("file");

  if (!/^9665\d{8}$/.test(phone)) {
    return NextResponse.json({ error: "رقم الجوال غير صحيح" }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "الرجاء إرفاق صورة الإيصال" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "حجم الملف كبير. الحد الأقصى 6 ميجابايت" }, { status: 400 });
  }
  if (!ALLOWED.includes(file.type)) {
    return NextResponse.json(
      { error: "صيغة غير مدعومة. أرفق صورة (JPG/PNG) أو ملف PDF" },
      { status: 400 },
    );
  }

  const supabase = db();

  const extension = file.type === "application/pdf" ? "pdf" : file.type.split("/")[1] ?? "jpg";
  const path = `${refCode}/${Date.now()}.${extension}`;

  const { error: uploadError } = await supabase.storage
    .from("receipts")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) {
    return NextResponse.json({ error: "تعذر رفع الإيصال. حاول مرة أخرى." }, { status: 500 });
  }

  const { error } = await supabase.rpc("mark_paid", {
    p_ref: refCode,
    p_phone: phone,
    p_receipt: path,
  });

  if (error) {
    // The booking did not move to awaiting_review, so the uploaded file is
    // an orphan — remove it rather than leaving it in the bucket.
    await supabase.storage.from("receipts").remove([path]);
    return NextResponse.json({ error: translateDbError(error.message) }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}
