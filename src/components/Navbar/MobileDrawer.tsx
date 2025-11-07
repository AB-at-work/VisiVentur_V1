"use client";

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  type MouseEvent,
  type ReactNode,
} from "react";

interface MobileDrawerProps {
  open: boolean;
  onOpenChange: (nextOpen: boolean) => void;
  children: ReactNode;
}

const focusableSelectors = [
  "a[href]",
  "button:not([disabled])",
  "textarea",
  "input",
  "select",
  "[tabindex]:not([tabindex='-1'])",
] as const;

function getFocusable(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll<HTMLElement>(focusableSelectors.join(",")),
  ).filter((element) => !element.hasAttribute("disabled"));
}

export default function MobileDrawer({
  open,
  onOpenChange,
  children,
}: MobileDrawerProps) {
  const drawerId = useId();
  const drawerRef = useRef<HTMLDivElement | null>(null);
  const restoreFocusRef = useRef<Element | null>(null);

  useEffect(() => {
    if (open) {
      restoreFocusRef.current = document.activeElement;
      const focusables = getFocusable(drawerRef.current);
      focusables[0]?.focus({ preventScroll: true });
    } else if (restoreFocusRef.current instanceof HTMLElement) {
      restoreFocusRef.current.focus({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onOpenChange(false);
        return;
      }

      if (event.key !== "Tab") return;

      const focusables = getFocusable(drawerRef.current);
      if (!focusables.length) {
        event.preventDefault();
        return;
      }

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (event.shiftKey) {
        if (active === first) {
          event.preventDefault();
          last.focus();
        }
      } else if (active === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  const overlay = useMemo(() => {
    if (!open) return null;

    const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
      if (event.target === event.currentTarget) {
        onOpenChange(false);
      }
    };

    return (
      <div
        className="fixed inset-0 z-40 flex justify-end bg-black/30 backdrop-blur-sm"
        role="presentation"
        onClick={handleBackdropClick}
      >
        <div
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          id={`${drawerId}-dialog`}
          aria-labelledby={`${drawerId}-title`}
          className="flex h-full w-80 max-w-[85vw] flex-col gap-6 overflow-y-auto bg-light-brown/95 p-6 shadow-subtle transition duration-200 ease-in-out dark:bg-neutral-900"
        >
          <div className="flex items-center justify-between">
            <h2
              id={`${drawerId}-title`}
              className="text-base font-semibold text-deep-navy dark:text-neutral-100"
            >
              Navigation
            </h2>
            <button
              type="button"
              className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-light-brown dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-200"
              onClick={() => onOpenChange(false)}
            >
              Close
            </button>
          </div>
          <div className="space-y-6">{children}</div>
        </div>
      </div>
    );
  }, [children, drawerId, onOpenChange, open]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={`${drawerId}-dialog`}
        aria-label="Toggle navigation menu"
        className="inline-flex items-center justify-center rounded-full border border-black/10 bg-white/90 p-2 text-gray-700 shadow-sm transition hover:border-royal-blue hover:text-royal-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-light-brown dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-200"
        onClick={() => onOpenChange(!open)}
      >
        <span aria-hidden="true" className="space-y-1.5">
          <span className="block h-0.5 w-6 rounded-full bg-current" />
          <span className="block h-0.5 w-6 rounded-full bg-current" />
          <span className="block h-0.5 w-6 rounded-full bg-current" />
        </span>
      </button>
      {overlay}
    </>
  );
}
