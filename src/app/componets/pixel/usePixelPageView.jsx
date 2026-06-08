"use client";
import { useEffect } from "react";

export function usePixelPageView() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.fbq) return;

    const fired = sessionStorage.getItem("pixel_pv_fired");

      if (fired) {
          console.log("exist")
          
        
    }

    window.fbq("track", "PageView");
    sessionStorage.setItem("pixel_pv_fired", "1");
  }, []);
}