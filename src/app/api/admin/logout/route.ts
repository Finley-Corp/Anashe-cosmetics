import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE } from "@/lib/admin-auth";

export async function GET(req: Request) {
  const url = new URL("/admin/login", req.url);
  const res = NextResponse.redirect(url);
  res.cookies.set({
    name: ADMIN_SESSION_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
  });
  return res;
}
