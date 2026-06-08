
let firedEvents = new Set();

export const trackEvent = (eventName, params = {}, onceKey) => {
  if (typeof window === "undefined") return;
  if (!window.fbq) return;

  const key = onceKey || eventName + JSON.stringify(params);

  if (firedEvents.has(key)) return;
  firedEvents.add(key);

  window.fbq("track", eventName, params);
};