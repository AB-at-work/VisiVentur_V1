type AnalyticsPayload = Record<string, unknown> | undefined;

declare global {
  interface Window {
    posthog?: {
      capture: (eventName: string, payload?: Record<string, unknown>) => void;
    };
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export function track(eventName: string, payload?: AnalyticsPayload): void {
  if (typeof window === "undefined") return;

  if (window.posthog?.capture) {
    window.posthog.capture(eventName, payload ?? {});
    return;
  }

  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, payload ?? {});
    return;
  }

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...(payload ?? {}) });
  }
}
