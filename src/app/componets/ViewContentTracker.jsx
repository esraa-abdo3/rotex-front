"use client";

import { useRef, useEffect } from "react";
import { trackEvent, PixelEvent } from "@/app/lib/pixel/pixel";

/**
 * ViewContentTracker
 *
 * Fires fbq('track', 'ViewContent') once when the target section enters
 * the viewport. Uses IntersectionObserver — no scroll listeners.
 *
 * @param {string} targetId - id attribute of the element to observe
 */
export default function ViewContentTracker({ targetId }) {
  const fired = useRef(false);

  useEffect(() => {
    if (!targetId || fired.current) return;

    const section = document.getElementById(targetId);
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !fired.current) {
          fired.current = true;
          trackEvent(PixelEvent.VIEW_CONTENT);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [targetId]);

  return null;
}