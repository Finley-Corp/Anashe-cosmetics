import { NextResponse } from "next/server";
import { getProductBySlug } from "@/lib/products-repository";
import { toProductJson } from "@/types/product";

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    const row = await getProductBySlug(decodeURIComponent(slug));
    if (!row) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(toProductJson(row));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load product" }, { status: 500 });
  }
}
