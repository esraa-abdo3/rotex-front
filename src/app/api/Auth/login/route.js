import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req) {
  const body = await req.json();

  const res = await fetch("https://rootex-backend.vercel.app/api/v1/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  // ✅ الباك اند بيبعت الـ token في الـ JSON — نحطه إحنا في الكوكي
  const token = data?.data?.token;

  if (!token) {
    return NextResponse.json(
      { status: "Fail", data: "لم يتم استلام التوكن" },
      { status: 500 }
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60, // 7 أيام بالثواني
    path: "/",
  });

  return NextResponse.json(data);
}
