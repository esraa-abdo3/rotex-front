/**
 * Meta Pixel utility
 * All fbq calls go through this module so SSR never touches window.
 */

export const PIXEL_ID = "2496490754109919";

/** Standard events — must use fbq('track', ...) */
export const PixelEvent = {
  PAGE_VIEW:        "PageView",
  VIEW_CONTENT:     "ViewContent",
  ADD_TO_CART:      "AddToCart",
  INITIATE_CHECKOUT:"InitiateCheckout",
  PURCHASE:         "Purchase",
};

function isBrowser() {
  return typeof window !== "undefined";
}

function fbq(...args) {
  if (!isBrowser() || typeof window.fbq !== "function") return;
  window.fbq(...args);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Standard events — fbq('track', EventName, params?) */
export function trackEvent(eventName, params = {}) {
  fbq("track", eventName, params);
}

/** Custom events — fbq('trackCustom', EventName, params?) */
export function trackCustomEvent(eventName, params = {}) {
  fbq("trackCustom", eventName, params);
}

