// import { cookies } from "next/headers";
// import { NextResponse } from "next/server";

// export async function POST() {
//   const cookieStore = await cookies();

//   cookieStore.delete("token");

//   return NextResponse.json({
//     status: "Success",
//     message: "Logged out",
//   });
// }
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // ✅ لازم تحدد نفس الـ path اللي اتحطت بيه الكوكي
  cookieStore.set("token", "", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 0, // فوري المسح
    path: "/",
  });

  return NextResponse.json({
    status: "Success",
    message: "تم تسجيل الخروج بنجاح",
  });
}
