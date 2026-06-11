"use client";

import { useEffect } from "react";
import { trackEvent, PixelEvent } from "@/app/lib/pixel/pixel";

/**
 * ViewContentTracker
 *
 * Fires fbq('track', 'ViewContent') ONCE per session when the target
 * section enters the viewport.
 * sessionStorage keeps the flag across refresh / back-navigation.
 *
 * @param {string} targetId   - id attribute of the element to observe
 * @param {string} sessionKey - unique key stored in sessionStorage (default: "px_vc_fired")
 */
export default function ViewContentTracker({ targetId, sessionKey = "px_vc_fired" }) {
  useEffect(() => {
    if (!targetId) return;
    if (sessionStorage.getItem(sessionKey)) return; // already fired this session

    const section = document.getElementById(targetId);
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          trackEvent(PixelEvent.VIEW_CONTENT);
          sessionStorage.setItem(sessionKey, "1");
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, [targetId, sessionKey]);

  return null;
}