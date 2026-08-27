import { Phone } from "lucide-react";

type MobileCallBarProps = {
  phone: string;
  phoneHref: string;
  whatsapp: string;
};

export function MobileCallBar({ phone, phoneHref, whatsapp }: MobileCallBarProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 backdrop-blur-md sm:hidden">
      <div className="grid grid-cols-2 divide-x divide-border rtl:divide-x-reverse">
        <a
          href={phoneHref}
          className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-primary"
        >
          <Phone className="h-4 w-4" />
          <span dir="ltr">{phone}</span>
        </a>
        <a
          href={`https://wa.me/${whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3.5 text-sm font-semibold text-[#25D366]"
        >
          WhatsApp
        </a>
      </div>
    </div>
  );
}
