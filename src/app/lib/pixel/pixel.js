
export const PIXEL_ID = "2496490754109919";


export const PixelEvent = {
  VIEW_CONTENT:     "ViewContent",
  INITIATE_CHECKOUT: "InitiateCheckout",
  LEAD: "Lead",
};

function isBrowser() {
  return typeof window !== "undefined";
}

function fbq(...args) {
  if (!isBrowser() || typeof window.fbq !== "function") return;
  window.fbq(...args);
}

export function trackEvent(eventName, params = {}) {
  fbq("track", eventName, params);
}

export function trackCustomEvent(eventName, params = {}) {
  fbq("trackCustom", eventName, params);
}

