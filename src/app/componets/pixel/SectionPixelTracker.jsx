"use client";

import { useEffect } from "react";
import { trackCustomEvent } from "@/app/lib/pixel/pixel";

/**
 * SectionPixelTracker
 *
 * Invisible component that resolves a section by DOM id, then uses
 * IntersectionObserver to fire fbq('trackCustom', eventName, params)
 * ONCE PER SESSION when the section reaches ≥30 % visibility.
 * sessionStorage keeps the flag across refresh / back-navigation.
 *
 * @param {string} targetId   - id attribute of the section element
 * @param {string} eventName  - Custom event name for fbq('trackCustom', ...)
 * @param {object} [params]   - Optional extra parameters sent to the event
 */
export default function SectionPixelTracker({ targetId, eventName, params = {} }) {
  useEffect(() => {
    if (!targetId || !eventName) return;

    const sessionKey = `px_section_${eventName}`;
    if (sessionStorage.getItem(sessionKey)) return; // already fired this session

    const el = document.getElementById(targetId);
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          trackCustomEvent(eventName, params);
          sessionStorage.setItem(sessionKey, "1");
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  // params is an object literal — stringify to keep dep array stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId, eventName]);

  return null;
}