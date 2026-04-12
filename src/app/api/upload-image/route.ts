import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { getImageKit } from "@/lib/imagekit-server";

export const dynamic = "force-dynamic";

/**
 * Server-side upload: binary goes to ImageKit; only the returned URL should be persisted in Neon.
 * Optional: set UPLOAD_SECRET and send header x-upload-secret: <value> (recommended in production).
 */
export async function POST(request: Request) {
  try {
    const secret = process.env.UPLOAD_SECRET;
    if (secret) {
      const sent = request.headers.get("x-upload-secret");
      if (sent !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    const form = await request.formData();
    const file = form.get("file");
    if (!(file instanceof Blob)) {
      return NextResponse.json({ error: "Expected file field" }, { status: 400 });
    }

    const fileNameField = form.get("fileName");
    const safeName =
      typeof fileNameField === "string" && fileNameField.length > 0
        ? fileNameField.replace(/[^a-zA-Z0-9._-]/g, "_")
        : `upload-${randomUUID()}.jpg`;

    const bytes = new Uint8Array(await file.arrayBuffer());
    const uploadable = new File([bytes], safeName, {
      type: file.type || "application/octet-stream",
    });
    const ik = getImageKit();
    const res = await ik.files.upload({
      file: uploadable,
      fileName: safeName,
      folder: "anashe/uploads",
    });

    if (!res.url) {
      return NextResponse.json({ error: "Upload failed" }, { status: 502 });
    }

    return NextResponse.json({ url: res.url, fileId: res.fileId });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
