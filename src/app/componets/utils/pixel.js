export const initPixel = (PIXEL_ID) => {
  if (typeof window === "undefined") return;
  if (!window.fbq) return;

  if (window._pixelInitialized) return;
  window._pixelInitialized = true;

  window.fbq("init", PIXEL_ID);


  window.dispatchEvent(new Event("fbq:ready"));
};
