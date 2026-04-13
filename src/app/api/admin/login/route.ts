import { NextResponse } from "next/server";
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionToken,
  getSessionMaxAge,
} from "@/lib/admin-auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const password = typeof body?.password === "string" ? body.password : "";
  const expectedPassword = process.env.ADMIN_PASSWORD;

  if (!expectedPassword) {
    return NextResponse.json(
      { error: "Admin credentials are not configured." },
      { status: 500 },
    );
  }

  if (password !== expectedPassword) {
    return NextResponse.json({ error: "Invalid password." }, { status: 401 });
  }

  const token = createAdminSessionToken();
  const res = NextResponse.json({ ok: true });
  res.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: getSessionMaxAge(),
  });

  return res;
}
