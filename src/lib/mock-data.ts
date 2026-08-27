export type ProductSpec = {
  label: string;
  value: string;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  nameEn?: string;
  sku?: string;
  shortDescription: string;
  description: string;
  categorySlug: string;
  category: string;
  image: string;
  images: string[];
  specs: ProductSpec[];
  featured?: boolean;
  viewCount: number;
  createdAt: string;
};

export const categories: Category[] = [
  {
    id: "1",
    slug: "cables",
    name: "כבלים ונחושת",
    description:
      "כבלי חשמל, נחושת, גלילים ואביזרי חיבור לכל סוגי התשתיות — ביתיות, מסחריות ותעשייתיות.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format",
    productCount: 6,
  },
  {
    id: "2",
    slug: "breakers",
    name: "מפסקים ולוחות",
    description:
      "מפסקים, לוחות חשמל, ממסרים וציוד הגנה — תקן ישראלי, מותגים מובילים.",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80&auto=format",
    productCount: 3,
  },
  {
    id: "3",
    slug: "switches",
    name: "מפסקי תאורה ושקעים",
    description:
      "מפסקים, שקעים, מפסקי מחלקה ורכיבי התקנה — סérie ביתית, מסחרית ופרימיום.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format",
    productCount: 3,
  },
  {
    id: "4",
    slug: "lighting",
    name: "תאורה",
    description:
      "גופי תאורה, פאנלים, ספוטים ונורות LED — פתרונות לבית, משרד וחנות.",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80&auto=format",
    productCount: 3,
  },
  {
    id: "5",
    slug: "tools",
    name: "כלי עבודה",
    description:
      "כלי עבודה מקצועיים לחשמלאים — מדידה, חיתוך, התקנה ואביזרי בטיחות.",
    image:
      "https://images.unsplash.com/photo-1581147036320-8657a8f5a5c5?w=800&q=80&auto=format",
    productCount: 2,
  },
  {
    id: "6",
    slug: "conduit",
    name: "צנרת ואביזרים",
    description:
      "צנרות, תעלות, קופסאות חיבור ואביזרי התקנה לפריסת כבלים מסודרת ובטוחה.",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format",
    productCount: 2,
  },
];

export const products: Product[] = [
  {
    id: "1",
    slug: "cable-nym-3x2-5",
    name: "כבל NYM 3×2.5 מ\"מ",
    nameEn: "NYM Cable 3x2.5mm",
    sku: "CBL-NYM-325",
    shortDescription: "כבל תקני לתשתיות ביתיות ומסחריות, גליל 100 מטר.",
    description:
      "<p>כבל NYM 3×2.5 מ\"מ מתאים להתקנות ביתיות ומסחריות סטנדרטיות. עמידות גבוהה, גמישות נוחה להתקנה ותקן ישראלי.</p><ul><li>מתאים לשקעים ומעגלים כלליים</li><li>גליל 100 מטר</li><li>זמין במלאי</li></ul>",
    categorySlug: "cables",
    category: "כבלים ונחושת",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format",
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format",
    ],
    specs: [
      { label: "חתך", value: "3×2.5 מ\"מ" },
      { label: "אורך", value: "100 מ'" },
      { label: "מתח", value: "עד 750V" },
    ],
    featured: true,
    viewCount: 342,
    createdAt: "2026-01-15",
  },
  {
    id: "2",
    slug: "cable-nym-3x1-5",
    name: "כבל NYM 3×1.5 מ\"מ",
    sku: "CBL-NYM-315",
    shortDescription: "כבל לתאורה ומעגלים קלים, גליל 100 מטר.",
    description:
      "<p>כבל NYM 3×1.5 מ\"מ לתאורה ומעגלים עם עומס נמוך. פתרון נפוץ לשיפוצים ופרויקטים חדשים.</p>",
    categorySlug: "cables",
    category: "כבלים ונחושת",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format",
    ],
    specs: [
      { label: "חתך", value: "3×1.5 מ\"מ" },
      { label: "אורך", value: "100 מ'" },
    ],
    viewCount: 198,
    createdAt: "2026-01-10",
  },
  {
    id: "3",
    slug: "cable-fire-resistant",
    name: "כבל עמיד אש 3×2.5",
    sku: "CBL-FR-325",
    shortDescription: "כבל עמיד אש לדרישות בטיחות מיוחדות.",
    description:
      "<p>כבל עמיד אש לפרויקטים עם דרישות בטיחות מוגברות — מסדרונות, חניונים ומבני ציבור.</p>",
    categorySlug: "cables",
    category: "כבלים ונחושת",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format",
    ],
    specs: [{ label: "חתך", value: "3×2.5 מ\"מ" }],
    viewCount: 87,
    createdAt: "2026-02-01",
  },
  {
    id: "4",
    slug: "breaker-3x40",
    name: "מפסק ראשי תלת-פאזי 3×40A",
    sku: "BRK-3P-40",
    shortDescription: "מפסק איכותי ללוח חשמל ראשי, תקן ישראלי.",
    description:
      "<p>מפסק ראשי תלת-פאזי 40A ללוחות חשמל ראשיים. אמינות גבוהה, התקנה נוחה ותקן ישראלי.</p>",
    categorySlug: "breakers",
    category: "מפסקים ולוחות",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80&auto=format",
    ],
    specs: [
      { label: "זרם", value: "40A" },
      { label: "פאזות", value: "3" },
    ],
    featured: true,
    viewCount: 276,
    createdAt: "2026-01-20",
  },
  {
    id: "5",
    slug: "breaker-1p-16",
    name: "מפסק חד-פאזי 16A",
    sku: "BRK-1P-16",
    shortDescription: "מפסק חד-פאזי ללוחות משנה ומעגלים ביתיים.",
    description: "<p>מפסק חד-פאזי 16A — הפתרון הסטנדרטי לרוב המעגלים הביתיים.</p>",
    categorySlug: "breakers",
    category: "מפסקים ולוחות",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80&auto=format",
    ],
    specs: [{ label: "זרם", value: "16A" }],
    viewCount: 154,
    createdAt: "2026-01-18",
  },
  {
    id: "6",
    slug: "panel-12-way",
    name: "לוח חשמל 12 מקומות",
    sku: "PNL-12",
    shortDescription: "לוח חשמל 12 מקומות עם מסגרת ודלת.",
    description: "<p>לוח חשמל 12 מקומות — מתאים לדירות, משרדים קטנים ושיפוצים.</p>",
    categorySlug: "breakers",
    category: "מפסקים ולוחות",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80&auto=format",
    ],
    specs: [{ label: "מקומות", value: "12" }],
    viewCount: 112,
    createdAt: "2026-02-05",
  },
  {
    id: "7",
    slug: "socket-double",
    name: "שקע כפול 16A עם הארקה",
    sku: "SW-SKT-DBL",
    shortDescription: "סérie פרימיום, לבן, מתאים לשיפוץ ולבנייה חדשה.",
    description: "<p>שקע כפול 16A עם הארקה — עיצוב נקי, התקנה סטנדרטית, מתאים לכל חדר.</p>",
    categorySlug: "switches",
    category: "מפסקי תאורה ושקעים",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80&auto=format",
    ],
    specs: [{ label: "זרם", value: "16A" }],
    featured: true,
    viewCount: 189,
    createdAt: "2026-01-22",
  },
  {
    id: "8",
    slug: "switch-1-gang",
    name: "מפסק תאורה חד-גangs",
    sku: "SW-1G",
    shortDescription: "מפסק תאורה לבן, התקנה מהירה.",
    description: "<p>מפסק תאורה חד-גangs — פתרון בסיסי ואמין לכל חדר.</p>",
    categorySlug: "switches",
    category: "מפסקי תאורה ושקעים",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format",
    ],
    specs: [],
    viewCount: 67,
    createdAt: "2026-02-10",
  },
  {
    id: "9",
    slug: "dimmer-switch",
    name: "מפסק dimmer לתאורה",
    sku: "SW-DIM",
    shortDescription: "שליטה בעוצמת תאורה — מתאים ל-LED.",
    description: "<p>מפסק dimmer לשליטה בעוצמת התאורה. תואם מנורות LED נבחרות.</p>",
    categorySlug: "switches",
    category: "מפסקי תאורה ושקעים",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80&auto=format",
    ],
    specs: [],
    viewCount: 93,
    createdAt: "2026-02-12",
  },
  {
    id: "10",
    slug: "led-panel-60x60",
    name: "פאנל LED 60×60",
    sku: "LT-LED-6060",
    shortDescription: "תאורת משרדים וחנויות, 4000K, חסכוני בחשמל.",
    description:
      "<p>פאנל LED 60×60 — תאורה אחידה וחסכונית למשרדים, חנויות ומרחבים מסחריים.</p>",
    categorySlug: "lighting",
    category: "תאורה",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80&auto=format",
    ],
    specs: [
      { label: "גודל", value: "60×60 ס\"מ" },
      { label: "טמפרטורה", value: "4000K" },
    ],
    featured: true,
    viewCount: 301,
    createdAt: "2026-01-25",
  },
  {
    id: "11",
    slug: "spot-led-7w",
    name: "ספוט LED שקוע 7W",
    sku: "LT-SPOT-7",
    shortDescription: "ספוט שקוע לתקרה — 7W, 3000K.",
    description: "<p>ספוט LED שקוע 7W — אידיאלי לתאורת אווירה בבית ובמסחר.</p>",
    categorySlug: "lighting",
    category: "תאורה",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80&auto=format",
    ],
    specs: [{ label: "הספק", value: "7W" }],
    viewCount: 145,
    createdAt: "2026-02-08",
  },
  {
    id: "12",
    slug: "flood-light-50w",
    name: "פנס שטיפה LED 50W",
    sku: "LT-FLD-50",
    shortDescription: "תאורת חוץ וחניונים — עמידות גבוהה.",
    description: "<p>פנס שטיפה LED 50W לתאורת חוץ, חניונים וחצרות.</p>",
    categorySlug: "lighting",
    category: "תאורה",
    image:
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80&auto=format",
    ],
    specs: [{ label: "הספק", value: "50W" }],
    viewCount: 78,
    createdAt: "2026-02-15",
  },
  {
    id: "13",
    slug: "multimeter-digital",
    name: "מולטימטר דיגיטלי",
    sku: "TL-MMT",
    shortDescription: "מדידות מקצועיות לחשמלאים — AC/DC.",
    description: "<p>מולטימטר דיגיטלי למדידות מקצועיות — מתח, זרם והתנגדות.</p>",
    categorySlug: "tools",
    category: "כלי עבודה",
    image:
      "https://images.unsplash.com/photo-1581147036320-8657a8f5a5c5?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1581147036320-8657a8f5a5c5?w=800&q=80&auto=format",
    ],
    specs: [],
    viewCount: 56,
    createdAt: "2026-02-18",
  },
  {
    id: "14",
    slug: "wire-stripper",
    name: "מחשפ סומים מקצועי",
    sku: "TL-STRP",
    shortDescription: "כלי עבודה לחשפ סומים מהיר ובטוח.",
    description: "<p>מחשפ סומים מקצועי — חיתוך מדויק וחשיפה נקייה של סומים.</p>",
    categorySlug: "tools",
    category: "כלי עבודה",
    image:
      "https://images.unsplash.com/photo-1581147036320-8657a8f5a5c5?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1581147036320-8657a8f5a5c5?w=800&q=80&auto=format",
    ],
    specs: [],
    viewCount: 41,
    createdAt: "2026-02-20",
  },
  {
    id: "15",
    slug: "conduit-pvc-20",
    name: "צנרת PVC 20 מ\"מ",
    sku: "CND-PVC-20",
    shortDescription: "צנרת PVC לפריסת כבלים — 3 מטר.",
    description: "<p>צנרת PVC 20 מ\"מ — קלה להתקנה, מתאימה לפריסת כבלים בקירות ותקרות.</p>",
    categorySlug: "conduit",
    category: "צנרת ואביזרים",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format",
    ],
    specs: [{ label: "קוטר", value: "20 מ\"מ" }],
    viewCount: 88,
    createdAt: "2026-02-22",
  },
  {
    id: "16",
    slug: "junction-box",
    name: "קופסת חיבור 10×10",
    sku: "CND-JB-10",
    shortDescription: "קופסת חיבור לקיר — 10×10 ס\"מ.",
    description: "<p>קופסת חיבור 10×10 לחיבורי כבלים בטוחים ומסודרים.</p>",
    categorySlug: "conduit",
    category: "צנרת ואביזרים",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format",
    ],
    specs: [{ label: "גודל", value: "10×10 ס\"מ" }],
    viewCount: 62,
    createdAt: "2026-02-25",
  },
  {
    id: "17",
    slug: "cable-nym-5x6",
    name: "כבל NYM 5×6 מ\"מ",
    sku: "CBL-NYM-56",
    shortDescription: "כבל עבה לעומסים גבוהים ומזגנים.",
    description: "<p>כבל NYM 5×6 מ\"מ לעומסים גבוהים — מזגנים, דודים ומעגלים תעשייתיים.</p>",
    categorySlug: "cables",
    category: "כבלים ונחושת",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80&auto=format",
    ],
    specs: [{ label: "חתך", value: "5×6 מ\"מ" }],
    viewCount: 134,
    createdAt: "2026-03-01",
  },
  {
    id: "18",
    slug: "cable-data-cat6",
    name: "כבל רשת CAT6 UTP",
    sku: "CBL-CAT6",
    shortDescription: "כבל תקשורת CAT6 — גליל 305 מטר.",
    description: "<p>כבל רשת CAT6 UTP לתשתיות תקשורת ואינטרנט — גליל 305 מטר.</p>",
    categorySlug: "cables",
    category: "כבלים ונחושת",
    image:
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&q=80&auto=format",
    ],
    specs: [{ label: "סוג", value: "CAT6 UTP" }],
    viewCount: 167,
    createdAt: "2026-03-05",
  },
  {
    id: "19",
    slug: "rcd-40a",
    name: "מפסק פח\"ע 40A 30mA",
    sku: "BRK-RCD-40",
    shortDescription: "הגנה מפני הדף חשמלי — חובה בלוחות חדשים.",
    description: "<p>מפסך פח\"ע 40A 30mA — הגנה חיונית מפני הדף חשמלי בכל לוח חדש.</p>",
    categorySlug: "breakers",
    category: "מפסקים ולוחות",
    image:
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80&auto=format",
    images: [
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&q=80&auto=format",
    ],
    specs: [
      { label: "זרם", value: "40A" },
      { label: "רגישות", value: "30mA" },
    ],
    viewCount: 203,
    createdAt: "2026-03-08",
  },
];

export const featuredProducts = products.filter((p) => p.featured);

export const whyChooseUs = [
  {
    title: "מומחיות מקצועית",
    description:
      "צוות עם ניסיון של שנים בשדה החשמל, ייעוץ מדויק ופתרונות לכל פרויקט.",
    icon: "award" as const,
  },
  {
    title: "מלאי רחב וזמין",
    description:
      "מאות מוצרים במלאי, מהפריטים הנפוצים ועד ציוד מיוחד — ללא המתנה ארוכה.",
    icon: "package" as const,
  },
  {
    title: "שירות אישי ומהיר",
    description:
      "הצעות מחיר מהירות, משלוחים לאתר ותמיכה ב-WhatsApp לכל שאלה דחופה.",
    icon: "headphones" as const,
  },
];

// Sync category product counts from actual products
for (const category of categories) {
  category.productCount = products.filter((p) => p.categorySlug === category.slug).length;
}
