"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/app/lib/pixel/pixel";

/**
 * usePageView
 *
 * Fires fbq('track', 'PageView') once per unique pathname.
 *
 * Guards:
 *  - useRef tracks the last pathname that received a PageView,
 *    so React re-renders of the same page never fire a second event.
 *  - usePathname() from next/navigation triggers the effect only when
 *    the route genuinely changes (soft navigations included).
 *  - No window access during SSR — useEffect runs client-only.
 */
export function usePageView() {
  const pathname = usePathname();
  const lastTrackedPath = useRef(null);

  useEffect(() => {
    // Skip if we already fired for this path in this session
    if (lastTrackedPath.current === pathname) return;

    lastTrackedPath.current = pathname;
    trackPageView();
  }, [pathname]);
}