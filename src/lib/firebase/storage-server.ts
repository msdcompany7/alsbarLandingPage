import { randomUUID } from "crypto";
import { getAdminStorage } from "@/lib/firebase/admin";

const PRODUCT_IMAGES_PREFIX = "products";

function getExtension(fileName: string, mimeType: string) {
  const fromName = fileName.split(".").pop()?.toLowerCase();
  if (fromName && ["jpg", "jpeg", "png", "webp", "gif", "heic"].includes(fromName)) {
    return fromName === "jpeg" ? "jpg" : fromName;
  }

  switch (mimeType) {
    case "image/jpeg":
      return "jpg";
    case "image/png":
      return "png";
    case "image/webp":
      return "webp";
    case "image/gif":
      return "gif";
    default:
      return "jpg";
  }
}

export function isFirebaseStorageConfigured() {
  return Boolean(
    process.env.FIREBASE_ADMIN_PROJECT_ID &&
      process.env.FIREBASE_ADMIN_CLIENT_EMAIL &&
      process.env.FIREBASE_ADMIN_PRIVATE_KEY &&
      process.env.FIREBASE_STORAGE_BUCKET,
  );
}

export async function uploadProductImage(file: File) {
  if (!isFirebaseStorageConfigured()) {
    throw new Error("Firebase Storage is not configured");
  }

  const bucket = getAdminStorage().bucket();
  const extension = getExtension(file.name, file.type || "image/jpeg");
  const objectPath = `${PRODUCT_IMAGES_PREFIX}/${randomUUID()}.${extension}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const fileRef = bucket.file(objectPath);
  await fileRef.save(buffer, {
    metadata: {
      contentType: file.type || "image/jpeg",
      cacheControl: "public,max-age=31536000",
    },
  });

  await fileRef.makePublic();

  return `https://storage.googleapis.com/${bucket.name}/${objectPath}`;
}
