// import { NextResponse } from "next/server";

// export function middleware(request) {
//   const { pathname } = request.nextUrl;


//   const token = request.cookies.get("token")?.value;

//   const isAdminRoute = pathname.startsWith("/admin");
//   const isLoginPage = pathname === "/Login";

  
//   if (isAdminRoute && !token) {
//     const loginUrl = new URL("/Login", request.url);
//     return NextResponse.redirect(loginUrl);
//   }

  
//   if (isLoginPage && token) {
//     const adminUrl = new URL("/admin", request.url);
//     return NextResponse.redirect(adminUrl);
//   }

//   return NextResponse.next();
// }

// export const config = {
 
//   matcher: ["/admin/:path*", "/Login"],
// };
import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("token")?.value;

  if (request.nextUrl.pathname.startsWith("/admin") && !token) {
    return NextResponse.redirect(new URL("/Login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};