"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackFB } from "./utils/fbPixel";

export default function PixelPageView() {
  const pathname = usePathname();
  const firedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // ✅ فقط الهوم
    if (pathname !== "/") return;

    // ❌ يمنع التكرار حتى مع rerender
    if (firedRef.current) return;

    // ❌ يمنع تكرار نفس session
    const key = "fb_pageview_home";
    if (sessionStorage.getItem(key)) return;

    const eventId = trackFB("PageView");

    console.log("PAGE VIEW FIRED", eventId);

    firedRef.current = true;
    sessionStorage.setItem(key, eventId);
  }, [pathname]);

  return null;
}