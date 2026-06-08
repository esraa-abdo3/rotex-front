"use client";

import Script from "next/script";
import { initPixel } from "./utils/pixel";

const PIXEL_ID = "2496490754109919";

export default function PixelInit() {
  return (
    <Script
      id="meta-pixel-sdk"
      strategy="afterInteractive"
      src="https://connect.facebook.net/en_US/fbevents.js"
      onLoad={() => initPixel(PIXEL_ID)}
    />
  );
}
