"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function usePixelPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.fbq) return;

    if (pathname === "/") {
      window.fbq("track", "PageView");
    }
  }, [pathname]);
}