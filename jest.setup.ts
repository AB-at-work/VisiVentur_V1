import "@testing-library/jest-dom";
import "whatwg-fetch";

const noop = () => undefined;

class ResizeObserverMock implements ResizeObserver {
  callback: ResizeObserverCallback;
  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }
  observe(): void {
    noop();
  }
  unobserve(): void {
    noop();
  }
  disconnect(): void {
    noop();
  }
}

if (typeof window !== "undefined") {
  if (!("ResizeObserver" in window)) {
    // @ts-expect-error - assign mock for tests
    window.ResizeObserver = ResizeObserverMock;
  }

  if (!window.matchMedia) {
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      configurable: true,
      value: (query: string): MediaQueryList => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: noop,
        removeListener: noop,
        addEventListener: noop,
        removeEventListener: noop,
        dispatchEvent: () => false,
      }),
    });
  }
}

jest.mock("next/navigation", () => ({
  usePathname: jest.fn(() => "/"),
  useRouter: () => ({
    prefetch: noop,
    push: noop,
    replace: noop,
    refresh: noop,
  }),
}));
