"use client";

import { useEffect } from "react";

let pageViewFired = false;

export default function PixelPageView() {
  useEffect(() => {
    if (pageViewFired) return;

    const fire = () => {
      if (pageViewFired) return;
      if (!window.fbq) return;
      pageViewFired = true;
      window.fbq("track", "PageView");
    };

 
    if (window.fbq && window._pixelInitialized) {
      fire();
    } else {
     
      window.addEventListener("fbq:ready", fire, { once: true });
    }

    return () => {
      window.removeEventListener("fbq:ready", fire);
    };
  }, []);

  return null;
}