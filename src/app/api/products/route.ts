import { NextResponse } from "next/server";
import { listProducts } from "@/lib/products-repository";
import { toProductJson } from "@/types/product";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") ?? undefined;
    const rows = await listProducts(q ?? undefined);
    return NextResponse.json(rows.map(toProductJson));
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to load products" }, { status: 500 });
  }
}
