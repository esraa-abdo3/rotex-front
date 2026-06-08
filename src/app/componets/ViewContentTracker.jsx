
"use client";

import { useEffect, useRef } from "react";


export default function ViewContentTracker({ targetId }) {
  const fired = useRef(false);

  useEffect(() => {
    if (!targetId) return;

    const section = document.getElementById(targetId);
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !fired.current) {
          fired.current = true;

       window.fbq("track", "ViewContent");

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