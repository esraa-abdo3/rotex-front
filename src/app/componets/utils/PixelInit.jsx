"use client";

import Script from "next/script";
import { initPixel } from "../../lib/metaPixel";

const PIXEL_ID = "2496490754109919";

export default function PixelInit() {
  return (
    <Script
      id="meta-pixel"
      strategy="afterInteractive"
      onLoad={() => initPixel(PIXEL_ID)}
      src="https://connect.facebook.net/en_US/fbevents.js"
    />
  );
}