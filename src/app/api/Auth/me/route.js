
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) return NextResponse.json({ user: null });

    const res = await fetch("https://api.beautyhub.es/api/v1/auth/me", {
      method: "GET",
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    });

    if (!res.ok) return NextResponse.json({ user: null });

    const data = await res.json();
    return NextResponse.json({ user: data?.user || null });
  } catch {
    return NextResponse.json({ user: null });
  }
}
