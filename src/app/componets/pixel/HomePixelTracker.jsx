"use client";

import { useEffect } from "react";

const SESSION_KEY = "px_pageview_fired";

/**
 * HomePixelTracker
 *
 * Fires fbq('track', 'PageView') once per browser SESSION only.
 * Uses sessionStorage as the guard so that:
 *  - refresh         → NO second PageView
 *  - back-navigation → NO second PageView
 *  - new tab / new browser → fresh session, fires once
 *
 * @param {string} mode     - 'onload' | 'hero-visible'
 * @param {string} targetId - Element ID to observe (hero-visible mode)
 */
export default function HomePixelTracker({ mode = "onload", targetId = "section-Hero" }) {
  useEffect(() => {
    // Already fired this session — bail out immediately
    if (sessionStorage.getItem(SESSION_KEY)) return;

    const firePageView = () => {
      if (typeof window.fbq !== "function") return false;
      window.fbq("track", "PageView");
      sessionStorage.setItem(SESSION_KEY, "1");
      return true;
    };

    // Mode 1: fire on mount
    if (mode === "onload") {
      if (!firePageView()) {
        // fbq not ready yet — poll for up to 3 s
        const interval = setInterval(() => {
          if (firePageView()) clearInterval(interval);
        }, 100);
        const timeout = setTimeout(() => clearInterval(interval), 3000);
        return () => {
          clearInterval(interval);
          clearTimeout(timeout);
        };
      }
      return;
    }

    // Mode 2: fire when hero section enters viewport
    if (mode === "hero-visible") {
      const element = document.getElementById(targetId);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (!entries[0].isIntersecting) return;
          if (!firePageView()) {
            const interval = setInterval(() => {
              if (firePageView()) {
                clearInterval(interval);
                observer.disconnect();
              }
            }, 100);
            setTimeout(() => clearInterval(interval), 3000);
          } else {
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(element);
      return () => observer.disconnect();
    }
  }, [mode, targetId]);

  return null;
}
