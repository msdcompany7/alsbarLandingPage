import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/utils";

type WhatsAppFabProps = {
  whatsapp: string;
  siteName: string;
};

export function WhatsAppFab({ whatsapp, siteName }: WhatsAppFabProps) {
  const url = buildWhatsAppUrl(
    whatsapp,
    `שלום, אשמח לקבל מידע על מוצרי ${siteName}`,
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="שלח הודעה ב-WhatsApp"
      className="fixed bottom-20 start-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#25D366] focus-visible:ring-offset-2 sm:bottom-6"
    >
      <MessageCircle className="h-7 w-7 fill-current" />
    </a>
  );
}
