import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getCloudinaryUploadParams, isCloudinaryConfigured } from "@/lib/cloudinary";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isCloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Cloudinary is not configured" },
      { status: 503 },
    );
  }

  return NextResponse.json(getCloudinaryUploadParams());
}
