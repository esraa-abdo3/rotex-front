
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();


  cookieStore.set("token", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return NextResponse.json({
    status: "Success",
    message: "تم تسجيل الخروج بنجاح",
  });
}
