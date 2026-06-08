"use client";

import { usePageView } from "@/app/hooks/usePageView";

/**
 * PixelPageTracker
 *
 * Invisible client component that solely exists to call usePageView().
 * Mounted once inside the root layout so it persists across all routes.
 */
export default function PixelPageTracker() {
  usePageView();
  return null;
}