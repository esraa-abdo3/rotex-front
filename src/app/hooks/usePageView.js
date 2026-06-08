"use client";

import { useEffect } from "react";
import { trackPageView } from "@/app/lib/pixel/pixel";

/**
 * usePageView
 *
 * Fires fbq('track', 'PageView') exactly ONCE per full browser session —
 * only on the very first page load, never again on client-side navigation.
 *
 * Strategy: sessionStorage flag "pixel_pv_fired".
 * - On hard load / new tab: flag is absent → fire + set flag.
 * - On client-side navigation (Next.js soft nav): component re-mounts
 *   but flag is already set → skip.
 * - On tab close / new session: sessionStorage is cleared → fires again
 *   on the next hard load (correct behaviour).
 */
export function usePageView() {
  useEffect(() => {
    const FLAG = "pixel_pv_fired";

    if (sessionStorage.getItem(FLAG)) return;

    sessionStorage.setItem(FLAG, "1");
    trackPageView();
  }, []); // empty deps — runs once on mount, never again in this session
}