// No "use client" — this is a Server Component.
// Next.js <Script> with strategy="afterInteractive" works fine in Server Components
// and guarantees the script is injected only once into the HTML document,
// never re-executed on client-side navigation or re-renders.

import Script from "next/script";
import { PIXEL_ID } from "@/app/lib/pixel/pixel";

/**
 * MetaPixelScript  (Server Component)
 *
 * Injects the official fbq base snippet once in the document.
 * fbq('init') automatically fires one PageView — we do NOT fire
 * an additional PageView anywhere else.
 *
 * Rules (per Meta docs):
 *  - fbq('init', ID)  → runs once, auto-fires PageView
 *  - NO manual fbq('track','PageView') needed or wanted
 */
export default function MetaPixelScript() {
  if (!PIXEL_ID) return null;

  return (
    <>
      <Script
        id="meta-pixel-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
          `,
        }}
      />
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}