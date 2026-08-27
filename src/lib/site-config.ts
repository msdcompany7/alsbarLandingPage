export const siteConfig = {
  name: "S.Light",
  brandNameHe: "חשמל אלסבינר",
  tagline: "פתרונות תאורה וחשמל מקצועיים",
  description:
    "חשמל אלסבינר — ספק חשמל ותאורה עם מלאי רחב, שירות אישי ומשלוחים מהירים. קבלו הצעת מחיר ב-WhatsApp.",
  phone: "050-000-0000",
  phoneHref: "tel:+972500000000",
  whatsapp: "972500000000",
  email: "info@electricity-shop.co.il",
  address: "רחוב התעשייה 12, אזור תעשייה, ישראל",
  wazeUrl: "https://waze.com/ul?q=חנות%20חשמל",
  googleMapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3380.5!2d34.7818!3d32.0853!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzLCsDA1JzA3LjEiTiAzNMKwNDYnNTQuNSJF!5e0!3m2!1she!2sil!4v1",
  hours: [
    { days: "ראשון – חמישי", time: "08:00 – 18:00" },
    { days: "שישי", time: "08:00 – 13:00" },
    { days: "שבת", time: "סגור" },
  ],
  stats: {
    yearsInBusiness: 15,
    productCount: 1200,
    serviceArea: "כל האזור המרכזי",
    supportHours: "08:00 – 18:00",
  },
  social: {
    facebook: "#",
    instagram: "#",
  },
  nav: [
    { label: "בית", href: "/" },
    { label: "מוצרים", href: "/products" },
    { label: "אודות", href: "/about" },
    { label: "אירועים", href: "/events" },
    { label: "צור קשר", href: "/contact" },
  ],
  events: [
    {
      title: "יריד ציוד חשמל ותאורה",
      date: "2026-09-15",
      location: "חנות חשמל אלסבינר",
      description:
        "מבצעים מיוחדים, הדגמות מוצרים חדשים וייעוץ מקצועי לקבלנים וחשמלאים. כניסה חופשית.",
    },
    {
      title: "סדנת תאורת LED לפרויקטים מסחריים",
      date: "2026-10-08",
      location: "אולם ההדרכה, אזור התעשייה",
      description:
        "סדנה מעשית על בחירת גופי תאורה, חישובי הספק ופתרונות חיסכון באנרגיה.",
    },
    {
      title: "ערב לקוחות VIP — קבלנים וחשמלאים",
      date: "2026-11-20",
      location: "חנות חשמל אלסבינר",
      description:
        "הצגת קטלוג חורף, הטבות בלעדיות ומפגש עם נציגי הספקים המובילים.",
    },
  ],
} as const;
