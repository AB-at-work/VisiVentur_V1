// Analytics utility for tracking user interactions
// This is a lightweight wrapper that can be extended with PostHog, GA, etc.

interface AnalyticsEvent {
  event: string;
  payload?: Record<string, unknown>;
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    posthog?: {
      capture: (event: string, properties?: Record<string, unknown>) => void;
    };
  }
}

export function track(event: string, payload?: Record<string, unknown>): void {
  try {
    // Track to Google Analytics if available
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', event, payload);
    }

    // Track to PostHog if available
    if (typeof window !== 'undefined' && window.posthog) {
      window.posthog.capture(event, payload);
    }

    // Fallback to console for development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics Event:', { event, payload });
    }
  } catch (error) {
    // Fail silently to avoid breaking the app
    if (process.env.NODE_ENV === 'development') {
      console.warn('Analytics tracking failed:', error);
    }
  }
}

// Predefined navbar events
export const navbarEvents = {
  LOGO_CLICK: 'nav.logo_click',
  CURRENCY_CHANGE: 'nav.currency_change',
  HELP_OPEN: 'nav.help_open',
  SIGNUP_CLICK: 'nav.signup_click',
  SIGNIN_CLICK: 'nav.signin_click',
  PROFILE_OPEN: 'nav.profile_open',
  LOGOUT: 'nav.logout',
  MOBILE_MENU_TOGGLE: 'nav.mobile_menu_toggle',
  MOBILE_MENU_CLOSE: 'nav.mobile_menu_close',
} as const;