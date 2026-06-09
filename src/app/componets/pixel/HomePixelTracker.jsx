"use client";

import { useEffect, useRef } from "react";

/**
 * HomePixelTracker
 * 
 * Manually tracks the Meta Pixel 'PageView' event.
 * Limited strictly to where this component is mounted (the Home page).
 *
 * @param {string} mode     - 'onload' to track on mount, or 'hero-visible' for IntersectionObserver.
 * @param {string} targetId - Element ID to observe if using 'hero-visible'.
 */
export default function HomePixelTracker({ mode = "onload", targetId = "section-Hero" }) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;

    const firePageView = () => {
      if (typeof window.fbq === "function") {
        window.fbq("track", "PageView");
        fired.current = true;
        return true;
      }
      return false;
    };

    // Option 1: Track on initial load of the Home page
    if (mode === "onload") {
      if (typeof window.fbq === "function") {
        firePageView();
      } else {
        // Wait for fbq to load (up to 3 seconds)
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

    // Option 2: Track using IntersectionObserver when the Hero Section is visible
    if (mode === "hero-visible") {
      const element = document.getElementById(targetId);
      if (!element) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && !fired.current) {
            if (typeof window.fbq === "function") {
              firePageView();
              observer.disconnect();
            } else {
              const interval = setInterval(() => {
                if (firePageView()) {
                  clearInterval(interval);
                  observer.disconnect();
                }
              }, 100);
              const timeout = setTimeout(() => clearInterval(interval), 3000);
            }
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
