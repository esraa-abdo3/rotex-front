"use client";
import { useEffect } from "react";

export function usePixelPageView() {
  useEffect(() => {
    if (!window.fbq) return;

    const fired = sessionStorage.getItem("pixel_pv_fired");

    if (!fired) {
      fbq("track", "PageView");
      sessionStorage.setItem("pixel_pv_fired", "1");
    }
  }, []);
}