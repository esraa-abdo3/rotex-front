export const trackFB = (eventName, params = {}) => {
  if (typeof window === "undefined") return;
  if (!window.fbq) return;

  const eventId =
    crypto.randomUUID?.() ||
    `${eventName}-${Date.now()}-${Math.random()}`;

  window.fbq("track", eventName, params, {
    eventID: eventId,
  });

  return eventId;
};