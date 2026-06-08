"use client";

import { useEffect, useRef } from "react";
import { trackCustomEvent } from "@/app/lib/pixel/pixel";

/**
 * SectionPixelTracker
 *
 * Invisible component that resolves a section by DOM id, then uses
 * IntersectionObserver to fire fbq('trackCustom', eventName, params)
 * exactly once when the section reaches ≥30 % visibility.
 *
 * @param {string} targetId   - id attribute of the section element
 * @param {string} eventName  - Custom event name for fbq('trackCustom', ...)
 * @param {object} [params]   - Optional extra parameters sent to the event
 */
export default function SectionPixelTracker({ targetId, eventName, params = {} }) {
  const fired = useRef(false);

  useEffect(() => {
    if (!targetId || fired.current) return;

    const el = document.getElementById(targetId);
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !fired.current) {
          fired.current = true;
          trackCustomEvent(eventName, params);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  // `params` is reconstructed on every render; freeze it with JSON.stringify
  // to keep the dep stable and prevent the effect from re-running.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetId, eventName]);

  return null;
}