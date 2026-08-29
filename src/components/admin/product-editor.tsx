"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { ProductStatus } from "@/lib/types/database";
import {
  deleteProduct,
  saveProduct,
  type ProductFormInput,
  type ProductImageInput,
} from "@/lib/admin/actions";
import { slugify } from "@/lib/slugify";
import { ImageUploader } from "@/components/admin/image-uploader";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
import { AdminAlert } from "@/components/admin/ui/admin-alert";
import { AdminFormSection } from "@/components/admin/ui/admin-form-section";
import { AdminSelect } from "@/components/admin/ui/admin-select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type CategoryOption = {
  id: string;
  nameHe: string;
};

type ProductEditorProps = {
  categories: CategoryOption[];
  initial?: Partial<ProductFormInput> & { id: string; images?: ProductImageInput[] };
};

export function ProductEditor({ categories, initial }: ProductEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));

  const [form, setForm] = useState<ProductFormInput>({
    id: initial?.id,
    nameHe: initial?.nameHe ?? "",
    slug: initial?.slug ?? "",
    categoryId: initial?.categoryId ?? categories[0]?.id ?? "",
    shortDescription: initial?.shortDescription ?? "",
    description: initial?.description ?? "",
    sku: initial?.sku ?? "",
    status: initial?.status ?? "draft",
    isFeatured: initial?.isFeatured ?? false,
    images: initial?.images ?? [],
  });

  useEffect(() => {
    if (slugTouched) return;
    if (!form.nameHe.trim()) return;
    setForm((prev) => ({ ...prev, slug: slugify(form.nameHe) }));
  }, [form.nameHe, slugTouched]);

  function updateField<K extends keyof ProductFormInput>(
    key: K,
    value: ProductFormInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const missingForPublish =
    form.status === "published"
      ? [
          !form.nameHe.trim() && "שם מוצר",
          !form.categoryId && "קטגוריה",
          form.images.length === 0 && "לפחות תמונה אחת",
        ].filter(Boolean)
      : [];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (missingForPublish.length > 0) {
      setError(`לפרסום חסר: ${missingForPublish.join(", ")}`);
      return;
    }

    startTransition(async () => {
      try {
        const result = await saveProduct(form);
        router.push(`/admin/products/${result.id}`);
        router.refresh();
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "שמירת המוצר נכשלה. בדקו את השדות ונסו שוב.",
        );
      }
    });
  }

  function handleDelete() {
    if (!initial?.id) return;
    if (!confirm("האם למחוק את המוצר?")) return;

    startTransition(async () => {
      await deleteProduct(initial.id);
      router.push("/admin/products");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="nameHe">שם המוצר *</Label>
              <Input
                id="nameHe"
                value={form.nameHe}
                onChange={(e) => updateField("nameHe", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="slug">כתובת (slug) *</Label>
              <Input
                id="slug"
                dir="ltr"
                value={form.slug}
                onChange={(e) => {
                  setSlugTouched(true);
                  updateField("slug", e.target.value);
                }}
                className="text-start"
                required
              />
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="categoryId">קטגוריה *</Label>
              <AdminSelect
                id="categoryId"
                value={form.categoryId}
                onChange={(e) => updateField("categoryId", e.target.value)}
                required
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.nameHe}
                  </option>
                ))}
              </AdminSelect>
            </div>
            <div>
              <Label htmlFor="sku">מק&quot;ט</Label>
              <Input
                id="sku"
                dir="ltr"
                value={form.sku ?? ""}
                onChange={(e) => updateField("sku", e.target.value)}
                className="text-start"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="shortDescription">תיאור קצר (עד 160 תווים)</Label>
            <Textarea
              id="shortDescription"
              value={form.shortDescription}
              onChange={(e) => updateField("shortDescription", e.target.value)}
              className="min-h-[80px]"
              maxLength={160}
            />
            <p className="mt-1 text-xs text-text-secondary">
              {form.shortDescription.length}/160
            </p>
          </div>

          <div>
            <Label>תיאור מלא</Label>
            <RichTextEditor
              value={form.description}
              onChange={(html) => updateField("description", html)}
            />
          </div>
        </div>

        <aside className="space-y-5">
          <div>
            <Label>תמונות מוצר</Label>
            <ImageUploader
              images={form.images}
              onChange={(images) => updateField("images", images)}
              productName={form.nameHe}
            />
          </div>

          <AdminFormSection title="פרסום ותצוגה" description="סטטוס ומיקום בדף הבית">
            <div>
              <Label htmlFor="status">סטטוס</Label>
              <AdminSelect
                id="status"
                value={form.status}
                onChange={(e) =>
                  updateField("status", e.target.value as ProductStatus)
                }
                className="mt-1.5"
              >
                <option value="draft">טיוטה</option>
                <option value="published">פורסם</option>
                <option value="archived">בארכיון</option>
              </AdminSelect>
            </div>

            <label className="mt-4 flex items-center gap-2.5 text-sm font-medium text-text-primary">
              <input
                type="checkbox"
                checked={form.isFeatured}
                onChange={(e) => updateField("isFeatured", e.target.checked)}
                className="h-4 w-4 rounded border-border accent-accent"
              />
              מוצר מומלץ בדף הבית
            </label>

            {missingForPublish.length > 0 && (
              <p className="mt-3 text-xs text-text-secondary">
                לפרסום נדרש: {missingForPublish.join(" · ")}
              </p>
            )}
          </AdminFormSection>
        </aside>
      </div>

      {error && <AdminAlert variant="error">{error}</AdminAlert>}

      <div className="flex flex-wrap gap-3 border-t border-border/70 pt-6">
        <Button type="submit" variant="navy" disabled={isPending} className="rounded-xl">
          {isPending ? "שומר..." : "שמירה"}
        </Button>
        {initial?.id && (
          <Button type="button" variant="outline" onClick={handleDelete} disabled={isPending} className="rounded-xl">
            מחיקה
          </Button>
        )}
      </div>
    </form>
  );
}
