"use client";

import Script from "next/script";

const PIXEL_ID = "2496490754109919";

export default function PixelInit() {
  return (
    <>
      {/* Step 1: Define window.fbq inline — must run before fbevents.js */}
      <Script
        id="meta-pixel-inline"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s){
              if(f.fbq)return;
              n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;
              n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];
            }(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${PIXEL_ID}');
            window._pixelInitialized = true;
            window.dispatchEvent(new Event('fbq:ready'));
          `,
        }}
      />

   
      <Script
        id="meta-pixel-sdk"
        strategy="afterInteractive"
        src="https://connect.facebook.net/en_US/fbevents.js"
      />
    </>
  );
}
