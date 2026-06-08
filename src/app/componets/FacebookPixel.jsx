"use client";

import { useEffect } from "react";

const PIXEL_ID = "2496490754109919";

export default function FacebookPixel() {
  useEffect(() => {
    // لو اتبعت قبل كده في نفس الجلسة متبعتوش تاني
    if (sessionStorage.getItem("pageview_sent")) {
      return;
    }

    sessionStorage.setItem("pageview_sent", "true");

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

    console.log("PAGE VIEW FIRED");
  }, []);

  return null;
}