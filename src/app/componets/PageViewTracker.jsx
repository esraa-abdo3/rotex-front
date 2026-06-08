"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "../lib/trackEvent";

export default function PageViewTracker() {
  const pathname = usePathname();
  const fired = useRef(new Set());

  useEffect(() => {
    if (pathname !== "/") return;

  trackEvent("PageView", {}, "pageview-home")
  }, [pathname]);

  return null;
}