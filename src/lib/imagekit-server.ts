import ImageKit from "@imagekit/nodejs";

let client: ImageKit | null = null;

export function getImageKit(): ImageKit {
  if (!process.env.IMAGEKIT_PRIVATE_KEY) {
    throw new Error("IMAGEKIT_PRIVATE_KEY is not set");
  }
  if (!client) {
    client = new ImageKit({
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    });
  }
  return client;
}

async function uploadFileBytes(
  ik: ImageKit,
  bytes: Uint8Array,
  safeName: string,
  folder: string,
  contentType: string | null
): Promise<string> {
  const uploadable = new File([Buffer.from(bytes)], safeName, {
    type: contentType || "image/jpeg",
  });
  const res = await ik.files.upload({
    file: uploadable,
    fileName: safeName,
    folder,
  });
  const url = res.url;
  if (!url) {
    throw new Error("ImageKit upload returned no URL");
  }
  return url;
}

/** Upload a remote public image URL into ImageKit; returns the permanent ImageKit file URL (store this in the DB). */
export async function uploadRemoteToImageKit(
  remoteUrl: string,
  fileName: string,
  folder = "anashe/products"
): Promise<string> {
  const ik = getImageKit();
  const safeName = fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  try {
    const res = await ik.files.upload({
      file: remoteUrl,
      fileName: safeName,
      folder,
    });
    const url = res.url;
    if (url) return url;
  } catch {
    /* ImageKit sometimes cannot fetch Unsplash from their servers — pull bytes here and upload. */
  }

  const fetched = await fetch(remoteUrl, { redirect: "follow" });
  if (!fetched.ok) {
    throw new Error(`Failed to download ${remoteUrl}: HTTP ${fetched.status}`);
  }
  const buf = new Uint8Array(await fetched.arrayBuffer());
  return uploadFileBytes(
    ik,
    buf,
    safeName,
    folder,
    fetched.headers.get("content-type")
  );
}
