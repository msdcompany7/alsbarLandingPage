"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { GripVertical, Star, Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export type ProductImageInput = {
  url: string;
  altTextHe?: string;
};

type ImageUploaderProps = {
  images: ProductImageInput[];
  onChange: (images: ProductImageInput[]) => void;
  productName: string;
};

export function ImageUploader({ images, onChange, productName }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState("");

  async function compressFile(file: File) {
    return imageCompression(file, {
      maxSizeMB: 0.4,
      maxWidthOrHeight: 2000,
      useWebWorker: true,
    });
  }

  async function uploadFile(file: File) {
    const signResponse = await fetch("/api/admin/cloudinary-sign");
    if (!signResponse.ok) {
      throw new Error("Cloudinary is not configured — use image URL instead.");
    }

    const sign = (await signResponse.json()) as {
      cloudName: string;
      apiKey: string;
      timestamp: number;
      signature: string;
      folder: string;
    };

    const compressed = await compressFile(file);
    const formData = new FormData();
    formData.append("file", compressed);
    formData.append("api_key", sign.apiKey);
    formData.append("timestamp", String(sign.timestamp));
    formData.append("signature", sign.signature);
    formData.append("folder", sign.folder);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`,
      { method: "POST", body: formData },
    );

    if (!uploadResponse.ok) {
      throw new Error("Image upload failed");
    }

    const payload = (await uploadResponse.json()) as { secure_url: string };
    return payload.secure_url;
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList?.length) return;

    setUploading(true);
    setError(null);

    try {
      const next = [...images];

      for (const file of Array.from(fileList).slice(0, 8 - images.length)) {
        const url = await uploadFile(file);
        next.push({ url, altTextHe: productName });
      }

      onChange(next.slice(0, 8));
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "העלאת התמונה נכשלה",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function addManualUrl() {
    if (!manualUrl.trim()) return;
    onChange([...images, { url: manualUrl.trim(), altTextHe: productName }].slice(0, 8));
    setManualUrl("");
  }

  function removeImage(index: number) {
    onChange(images.filter((_, i) => i !== index));
  }

  function movePrimary(index: number) {
    if (index === 0) return;
    const next = [...images];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  }

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "rounded-xl border-2 border-dashed border-border bg-surface-alt p-6 text-center transition-colors",
          uploading && "opacity-70",
        )}
      >
        <Upload className="mx-auto h-8 w-8 text-text-secondary" />
        <p className="mt-3 text-sm font-medium text-text-primary">
          גררו תמונות או לחצו לבחירה (עד 8)
        </p>
        <p className="mt-1 text-xs text-text-secondary">
          JPEG, PNG, WebP · דחיסה אוטומטית לפני העלאה
        </p>
        <button
          type="button"
          className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light"
          onClick={() => inputRef.current?.click()}
          disabled={uploading || images.length >= 8}
        >
          {uploading ? "מעלה..." : "בחירת תמונות"}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic"
          multiple
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      <div className="flex gap-2">
        <input
          type="url"
          dir="ltr"
          value={manualUrl}
          onChange={(e) => setManualUrl(e.target.value)}
          placeholder="https://... (הדבקת כתובת תמונה)"
          className="flex-1 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm"
        />
        <button
          type="button"
          onClick={addManualUrl}
          className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium hover:bg-surface-alt"
          disabled={images.length >= 8}
        >
          הוסף
        </button>
      </div>

      {error && (
        <p className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}

      {images.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {images.map((image, index) => (
            <div
              key={`${image.url}-${index}`}
              className="flex items-center gap-3 rounded-lg border border-border bg-surface p-3"
            >
              <GripVertical className="h-4 w-4 shrink-0 text-text-secondary" />
              <div className="relative h-16 w-16 overflow-hidden rounded-md bg-surface-alt">
                <Image src={image.url} alt="" fill className="object-cover" sizes="64px" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs text-text-secondary" dir="ltr">
                  {image.url}
                </p>
                {index === 0 && (
                  <span className="mt-1 inline-flex items-center gap-1 text-xs font-semibold text-accent">
                    <Star className="h-3 w-3 fill-current" />
                    ראשית
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                {index !== 0 && (
                  <button
                    type="button"
                    onClick={() => movePrimary(index)}
                    className="rounded p-1 text-xs text-primary hover:bg-surface-alt"
                  >
                    ראשית
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="rounded p-1 text-danger hover:bg-danger/5"
                  aria-label="הסר תמונה"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
