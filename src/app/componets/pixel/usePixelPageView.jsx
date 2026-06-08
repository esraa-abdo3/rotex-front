"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function usePixelPageView() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.fbq) return;

    const alreadyTracked = sessionStorage.getItem("landing_pv_fired");

    if (pathname === "/" && !alreadyTracked) {
      window.fbq("track", "PageView");
      sessionStorage.setItem("landing_pv_fired", "1");
    }
  }, [pathname]);
}