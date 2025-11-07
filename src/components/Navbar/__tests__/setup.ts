import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

// Mock analytics
jest.mock('@/lib/analytics', () => ({
  track: jest.fn(),
  navbarEvents: {
    LOGO_CLICK: 'nav.logo_click',
    CURRENCY_CHANGE: 'nav.currency_change',
    HELP_OPEN: 'nav.help_open',
    SIGNUP_CLICK: 'nav.signup_click',
    SIGNIN_CLICK: 'nav.signin_click',
    PROFILE_OPEN: 'nav.profile_open',
    LOGOUT: 'nav.logout',
    MOBILE_MENU_TOGGLE: 'nav.mobile_menu_toggle',
    MOBILE_MENU_CLOSE: 'nav.mobile_menu_close',
  },
}));

// Mock Zustand persist
jest.mock('zustand/middleware', () => ({
  persist: (fn: any) => fn,
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));