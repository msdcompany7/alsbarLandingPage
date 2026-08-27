import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendInquiryEmail } from "@/lib/email";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { inquiryApiSchema } from "@/lib/validation/inquiry";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);
    const rate = checkRateLimit(`inquiry:${ip}`, 3, 60 * 60 * 1000);

    if (!rate.allowed) {
      return NextResponse.json(
        { error: `יותר מדי ניסיונות. נסו שוב בעוד ${rate.retryAfterSec} שניות.` },
        { status: 429 },
      );
    }

    const body = (await request.json()) as Record<string, unknown>;

    if (typeof body.website === "string" && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true });
    }

    const parsed = inquiryApiSchema.safeParse(body);

    if (!parsed.success) {
      const firstError = parsed.error.issues[0]?.message ?? "נתונים לא תקינים";
      return NextResponse.json({ error: firstError }, { status: 400 });
    }

    const inquiry = await db.inquiry.create({
      data: {
        name: parsed.data.name,
        phone: parsed.data.phone,
        email: parsed.data.email,
        message: parsed.data.message,
        source: "contact_form",
      },
    });

    await sendInquiryEmail(parsed.data);

    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch (error) {
    console.error("[website] Inquiry submission failed:", error);
    return NextResponse.json(
      { error: "שגיאה בשמירת הפנייה. נסו שוב או צרו קשר בטלפון." },
      { status: 500 },
    );
  }
}
