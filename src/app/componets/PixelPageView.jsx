"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function PixelPageView() {
  const pathname = usePathname();

  useEffect(() => {
    // 🚫 امنع التكرار داخل نفس السيشن
    if (sessionStorage.getItem("pv")) return;

    // 🚫 شغل فقط في الصفحة الرئيسية
    if (pathname !== "/") return;

    sessionStorage.setItem("pv", "1");

    if (window.fbq) {
      window.fbq("track", "PageView");
      console.log("PAGE VIEW FIRED");
    }
  }, [pathname]);

  return null;
}