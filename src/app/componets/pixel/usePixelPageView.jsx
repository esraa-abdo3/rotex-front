"use client";
import { useEffect } from "react";

export function usePixelPageView() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.fbq) return;

    if (!window.__pixelPageViewFired) {
      window.fbq("track", "PageView");
      window.__pixelPageViewFired = true;
    }
  }, []);
}