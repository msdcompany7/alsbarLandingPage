import { Resend } from "resend";
import { siteConfig } from "@/lib/site-config";

type InquiryEmailPayload = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
};

export async function sendInquiryEmail(payload: InquiryEmailPayload) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.WEBSITE_INQUIRY_EMAIL ?? siteConfig.email;
  const from = process.env.WEBSITE_FROM_EMAIL ?? "onboarding@resend.dev";

  if (!apiKey) {
    console.info("[website] Inquiry received (email skipped — RESEND_API_KEY not set):", payload);
    return { sent: false as const, reason: "missing_api_key" as const };
  }

  const resend = new Resend(apiKey);

  const lines = [
    `שם: ${payload.name}`,
    `טלפון: ${payload.phone}`,
    payload.email ? `אימייל: ${payload.email}` : null,
    payload.message ? `\nהודעה:\n${payload.message}` : null,
  ]
    .filter(Boolean)
    .join("\n");

  const { error } = await resend.emails.send({
    from,
    to,
    subject: `פנייה חדשה מהאתר — ${payload.name}`,
    text: lines,
  });

  if (error) {
    console.error("[website] Failed to send inquiry email:", error);
    return { sent: false as const, reason: "send_failed" as const };
  }

  return { sent: true as const };
}
