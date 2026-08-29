import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/firebase/auth-server";
import { isFirebaseStorageConfigured, uploadProductImage } from "@/lib/firebase/storage-server";

const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
]);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function validateProductImageFile(file: File): string | null {
  const mimeType = file.type.trim().toLowerCase();

  if (!ALLOWED_IMAGE_MIME_TYPES.has(mimeType)) {
    return "Unsupported image type";
  }

  if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) {
    return "Image must be 5 MB or smaller";
  }

  return null;
}

export async function POST(request: Request) {
  try {
    await requireAdmin();

    if (!isFirebaseStorageConfigured()) {
      return NextResponse.json(
        { error: "Firebase Storage is not configured — use image URL instead." },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Missing file" }, { status: 400 });
    }

    const validationError = validateProductImageFile(file);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const url = await uploadProductImage(file);
    return NextResponse.json({ url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}