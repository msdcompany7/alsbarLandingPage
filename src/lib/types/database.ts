export type ProductStatus = "draft" | "published" | "archived";
export type InquiryStatus = "new" | "read" | "handled";
export type InquirySource = "contact_form" | "quote_request" | "whatsapp_click";

export type ProductSpec = {
  label: string;
  value: string;
};

export type ProductImageRecord = {
  url: string;
  altTextHe: string;
  sortOrder: number;
  width?: number | null;
  height?: number | null;
};

export type FirestoreTimestampLike =
  | Date
  | { toDate: () => Date }
  | null
  | undefined;

export type FirestoreCategory = {
  id: string;
  slug: string;
  nameHe: string;
  nameEn: string | null;
  description: string | null;
  parentId: string | null;
  imageUrl: string | null;
  icon: string | null;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
};

export type FirestoreProduct = {
  id: string;
  slug: string;
  nameHe: string;
  nameEn: string | null;
  sku: string | null;
  shortDescription: string | null;
  description: string | null;
  categoryId: string;
  specs: ProductSpec[];
  isFeatured: boolean;
  status: ProductStatus;
  sortOrder: number;
  viewCount: number;
  metaTitle: string | null;
  metaDescription: string | null;
  images: ProductImageRecord[];
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
};

export type FirestoreInquiry = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  message: string | null;
  productId: string | null;
  source: InquirySource;
  status: InquiryStatus;
  createdAt: Date;
};

export type ProductWithCategory = FirestoreProduct & {
  category: FirestoreCategory;
};
