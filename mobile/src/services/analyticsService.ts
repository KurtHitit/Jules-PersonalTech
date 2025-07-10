// mobile/src/services/analyticsService.ts

export const trackEvent = (eventName: string, properties?: { [key: string]: any }) => {
  console.log(`[Analytics] Event: ${eventName}`, properties || '');
  // In a real application, this would send data to Mixpanel, Fathom, Google Analytics, etc.
  // Example: mixpanel.track(eventName, properties);
};
