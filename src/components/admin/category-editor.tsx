"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteCategory, saveCategory, type CategoryFormInput } from "@/lib/admin/actions";
import { slugify } from "@/lib/slugify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ParentOption = {
  id: string;
  nameHe: string;
};

type CategoryEditorProps = {
  parentOptions: ParentOption[];
  initial?: Partial<CategoryFormInput> & { id?: string };
};

export function CategoryEditor({ parentOptions, initial }: CategoryEditorProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slugTouched, setSlugTouched] = useState(Boolean(initial?.slug));

  const [form, setForm] = useState<CategoryFormInput>({
    id: initial?.id,
    slug: initial?.slug ?? "",
    nameHe: initial?.nameHe ?? "",
    nameEn: initial?.nameEn ?? "",
    description: initial?.description ?? "",
    parentId: initial?.parentId ?? null,
    imageUrl: initial?.imageUrl ?? "",
    icon: initial?.icon ?? "",
    sortOrder: initial?.sortOrder ?? 0,
  });

  useEffect(() => {
    if (slugTouched) return;
    if (!form.nameHe.trim()) return;
    setForm((prev) => ({ ...prev, slug: slugify(form.nameHe) }));
  }, [form.nameHe, slugTouched]);

  function updateField<K extends keyof CategoryFormInput>(
    key: K,
    value: CategoryFormInput[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        const result = await saveCategory(form);
        router.push(`/admin/categories/${result.id}`);
        router.refresh();
      } catch (submitError) {
        setError(
          submitError instanceof Error
            ? submitError.message
            : "שמירת הקטגוריה נכשלה",
        );
      }
    });
  }

  function handleDelete() {
    const categoryId = initial?.id;
    if (!categoryId) return;
    if (!confirm("האם למחוק את הקטגוריה?")) return;

    startTransition(async () => {
      try {
        await deleteCategory(categoryId);
        router.push("/admin/categories");
        router.refresh();
      } catch (deleteError) {
        setError(
          deleteError instanceof Error ? deleteError.message : "מחיקת הקטגוריה נכשלה",
        );
      }
    });
  }

  const availableParents = parentOptions.filter((option) => option.id !== initial?.id);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        <div>
          <Label htmlFor="nameHe">שם בעברית *</Label>
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
          <Label htmlFor="nameEn">שם באנגלית</Label>
          <Input
            id="nameEn"
            dir="ltr"
            value={form.nameEn ?? ""}
            onChange={(e) => updateField("nameEn", e.target.value)}
            className="text-start"
          />
        </div>
        <div>
          <Label htmlFor="parentId">קטגוריית הורה</Label>
          <select
            id="parentId"
            value={form.parentId ?? ""}
            onChange={(e) =>
              updateField("parentId", e.target.value ? e.target.value : null)
            }
            className="w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm"
          >
            <option value="">ללא (קטגוריה ראשית)</option>
            {availableParents.map((option) => (
              <option key={option.id} value={option.id}>
                {option.nameHe}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <Label htmlFor="description">תיאור</Label>
        <Textarea
          id="description"
          value={form.description ?? ""}
          onChange={(e) => updateField("description", e.target.value)}
        />
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div>
          <Label htmlFor="imageUrl">כתובת תמונה</Label>
          <Input
            id="imageUrl"
            dir="ltr"
            value={form.imageUrl ?? ""}
            onChange={(e) => updateField("imageUrl", e.target.value)}
            className="text-start"
            placeholder="https://..."
          />
        </div>
        <div>
          <Label htmlFor="icon">אייקון (Lucide)</Label>
          <Input
            id="icon"
            dir="ltr"
            value={form.icon ?? ""}
            onChange={(e) => updateField("icon", e.target.value)}
            className="text-start"
            placeholder="zap"
          />
        </div>
        <div>
          <Label htmlFor="sortOrder">סדר תצוגה</Label>
          <Input
            id="sortOrder"
            type="number"
            min={0}
            value={form.sortOrder}
            onChange={(e) => updateField("sortOrder", Number(e.target.value) || 0)}
          />
        </div>
      </div>

      {error && (
        <p className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      <div className="flex flex-wrap gap-3">
        <Button type="submit" variant="navy" disabled={isPending}>
          {isPending ? "שומר..." : "שמירה"}
        </Button>
        {initial?.id && (
          <Button type="button" variant="outline" onClick={handleDelete} disabled={isPending}>
            מחיקה
          </Button>
        )}
      </div>
    </form>
  );
}
