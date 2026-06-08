"use client";

import { useEffect, useRef } from "react";
import { trackCustomEvent } from "@/app/lib/pixel/pixel";

/**
 * useSectionTracking
 *
 * Observes a DOM element via IntersectionObserver and fires a single
 * fbq('trackCustom', eventName, params) when the element becomes visible.
 *
 * @param {React.RefObject<HTMLElement>} ref         - ref attached to the section element
 * @param {string}                       eventName   - Custom event name (trackCustom)
 * @param {object}                       [params={}] - Extra parameters forwarded to fbq
 * @param {number}                       [threshold] - 0–1 visibility ratio to trigger (default 0.3)
 *
 * Usage:
 *   const ref = useRef(null);
 *   useSectionTracking(ref, "ViewSection3", { section: "product" });
 *   return <div ref={ref}>...</div>;
 */
export function useSectionTracking(ref, eventName, params = {}, threshold = 0.3) {
  const fired = useRef(false);

  useEffect(() => {
    const el = ref?.current;
    if (!el || fired.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !fired.current) {
          fired.current = true;
          trackCustomEvent(eventName, params);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  // params is an object literal — stringify to keep dep array stable
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, eventName, threshold]);
}