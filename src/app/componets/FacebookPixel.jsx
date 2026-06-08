"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const PIXEL_ID = "2496490754109919";

export default function FacebookPixel() {
  const pathname = usePathname();

  useEffect(() => {
    console.log("PAGE VIEW FIRED");
    // اشتغل فقط في الصفحة الرئيسية
    if (pathname !== "/") return;

    // امنع تكرار PageView في نفس الجلسة
    if (sessionStorage.getItem("pv")) return;
    sessionStorage.setItem("pv", "1");

    !(function (f, b, e, v, n, t, s) {
      if (f.fbq) return;

      n = f.fbq = function () {
        n.callMethod
          ? n.callMethod.apply(n, arguments)
          : n.queue.push(arguments);
      };

      if (!f._fbq) f._fbq = n;

      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];

      t = b.createElement(e);
      t.async = true;
      t.src = v;

      s = b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t, s);
    })(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");

    window.fbq("init", PIXEL_ID);
    window.fbq("track", "PageView");
  }, [pathname]);

  return (
    <noscript>
      <img
        height="1"
        width="1"
        style={{ display: "none" }}
        src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        alt=""
      />
    </noscript>
  );
}