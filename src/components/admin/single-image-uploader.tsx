"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import imageCompression from "browser-image-compression";
import { Trash2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type SingleImageUploaderProps = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
};

async function compressFile(file: File) {
  return imageCompression(file, {
    maxSizeMB: 0.4,
    maxWidthOrHeight: 2000,
    useWebWorker: true,
  });
}

async function uploadFile(file: File) {
  const compressed = await compressFile(file);
  const formData = new FormData();
  formData.append("file", compressed);

  const uploadResponse = await fetch("/api/admin/storage-upload", {
    method: "POST",
    body: formData,
  });

  if (!uploadResponse.ok) {
    const payload = (await uploadResponse.json().catch(() => null)) as
      | { error?: string }
      | null;
    throw new Error(payload?.error ?? "העלאת התמונה נכשלה");
  }

  const payload = (await uploadResponse.json()) as { url: string };
  return payload.url;
}

export function SingleImageUploader({
  value,
  onChange,
  label = "תמונת קטגוריה",
}: SingleImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState("");

  async function handleFiles(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "העלאת התמונה נכשלה",
      );
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function applyManualUrl() {
    if (!manualUrl.trim()) return;
    onChange(manualUrl.trim());
    setManualUrl("");
    setError(null);
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-semibold text-text-primary">{label}</p>

      {value ? (
        <div className="flex items-center gap-4 rounded-xl border border-border/80 bg-surface p-4 shadow-[var(--shadow-soft)]">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-surface-alt">
            <Image src={value} alt="" fill className="object-cover" sizes="96px" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs text-text-secondary" dir="ltr">
              {value}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onChange("")}
            className="rounded-lg p-2 text-danger hover:bg-danger/5"
            aria-label="הסר תמונה"
          >
            <Trash2 className="h-5 w-5" />
          </button>
        </div>
      ) : (
        <div
          className={cn(
            "rounded-2xl border-2 border-dashed border-border/80 bg-surface-alt/60 p-8 text-center transition-colors hover:border-accent/30",
            uploading && "opacity-70",
          )}
        >
          <Upload className="mx-auto h-8 w-8 text-text-secondary" />
          <p className="mt-3 text-sm font-medium text-text-primary">
            גררו תמונה או לחצו לבחירה
          </p>
          <p className="mt-1 text-xs text-text-secondary">
            JPEG, PNG, WebP · דחיסה אוטומטית לפני העלאה
          </p>
          <button
            type="button"
            className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-light hover:shadow-md"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? "מעלה..." : "בחירת תמונה"}
          </button>
        </div>
      )}

      {!value && (
        <div className="flex gap-2">
          <input
            type="url"
            dir="ltr"
            value={manualUrl}
            onChange={(e) => setManualUrl(e.target.value)}
            placeholder="https://... (או הדבקת כתובת)"
            className="flex-1 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20"
          />
          <button
            type="button"
            onClick={applyManualUrl}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-surface-alt"
          >
            הוסף
          </button>
        </div>
      )}

      {value && (
        <button
          type="button"
          className="text-sm font-medium text-primary hover:text-accent"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          {uploading ? "מעלה..." : "החלפת תמונה"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/heic"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && (
        <p className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
