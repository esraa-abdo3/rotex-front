"use client";

/**
 * PixelPageViewOnce
 *
 * يشتغل مرة واحدة طول الـ session كلها — مش per-render ومش per-navigation.
 * بيستخدم sessionStorage كـ flag عشان حتى لو الـ component اتعمله re-render
 * أو الـ user اتنقل لصفحة تانية ورجع، الـ event مش هيتكرر.
 *
 * ضيفه في root layout جوا <body> مباشرةً.
 */

import { useEffect } from "react";

export default function PixelPageViewOnce() {
  useEffect(() => {
    // لو الـ flag موجود معناها سجلنا قبل كده — مش نسجل تاني
    if (sessionStorage.getItem("px_lp_fired")) return;

    // لو fbq مش جاهز بعد (نادر مع afterInteractive) ننتظر شوية
    const fire = () => {
      if (typeof window.fbq !== "function") return;
      window.fbq("trackCustom", "LandingPageView");
      sessionStorage.setItem("px_lp_fired", "1");
    };

    if (typeof window.fbq === "function") {
      fire();
    } else {
      // ننتظر الـ fbq script يحمل (max 3 ثواني)
      const interval = setInterval(() => {
        if (typeof window.fbq === "function") {
          clearInterval(interval);
          fire();
        }
      }, 100);
      const timeout = setTimeout(() => clearInterval(interval), 3000);
      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, []); 

  return null;
}
