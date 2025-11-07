"use client";

import { useEffect, useRef, type MouseEvent } from "react";

export interface HelpModalProps {
  open: boolean;
  onClose: () => void;
  isAuthenticated?: boolean;
}

const SUPPORT_EMAIL = "support@visiventur.com";
const SUPPORT_PHONE = "+1 (800) 555-2048";

const focusableSelectors = [
  "a[href]",
  "button:not([disabled])",
  "textarea",
  "input[type='text']",
  "input[type='email']",
  "input[type='tel']",
  "input[type='url']",
  "select",
  "[tabindex]:not([tabindex='-1'])",
] as const;

function getFocusableElements(root: HTMLElement | null): HTMLElement[] {
  if (!root) return [];
  return Array.from(
    root.querySelectorAll<HTMLElement>(focusableSelectors.join(",")),
  ).filter((element) => !element.hasAttribute("disabled"));
}

export default function HelpModal({
  open,
  onClose,
  isAuthenticated = false,
}: HelpModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<Element | null>(null);

  useEffect(() => {
    if (open) {
      triggerRef.current = document.activeElement;
      const [firstFocusable] = getFocusableElements(dialogRef.current);
      firstFocusable?.focus({ preventScroll: true });
    } else if (triggerRef.current instanceof HTMLElement) {
      triggerRef.current.focus({ preventScroll: true });
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = getFocusableElements(dialogRef.current);
      if (!focusable.length) {
        event.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
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
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const body = document.body;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  const handleBackdropClick = (event: MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      id="visiventur-help-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="help-dialog-title"
      className="fixed inset-0 z-[60] flex items-end justify-center bg-black/40 p-4 text-left sm:items-center"
      onClick={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className="w-full max-w-lg rounded-3xl bg-white/95 p-6 shadow-subtle backdrop-blur-sm focus:outline-none dark:bg-neutral-900/95"
      >
        <header className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="help-dialog-title"
              className="text-xl font-semibold text-deep-navy dark:text-neutral-50"
            >
              How can we help?
            </h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-neutral-300">
              Our concierge team typically replies within 10 minutes.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-black/10 bg-white px-3 py-1 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-light-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-light-brown dark:border-white/10 dark:bg-neutral-800 dark:text-neutral-200"
          >
            Close
          </button>
        </header>

        <div className="mt-6 space-y-5 text-sm text-gray-700 dark:text-neutral-200">
          <section className="rounded-2xl border border-black/5 bg-light-brown/40 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-800/60">
            <h3 className="text-base font-semibold text-deep-navy dark:text-neutral-50">
              Quick answers
            </h3>
            <p className="mt-1 text-sm text-gray-600 dark:text-neutral-300">
              Visit our FAQ to learn about bookings, flexible plans, and
              premium benefits.
            </p>
            <a
              href="/help/faq"
              className="mt-3 inline-flex items-center gap-2 rounded-full bg-royal-blue px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-royal-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-light-brown"
            >
              View FAQs
            </a>
          </section>

          <section className="rounded-2xl border border-black/5 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-800/60">
            <h3 className="text-base font-semibold text-deep-navy dark:text-neutral-50">
              Contact us
            </h3>
            <div className="mt-3 flex flex-col gap-3">
              <a
                href={`mailto:${SUPPORT_EMAIL}`}
                className="inline-flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 shadow-sm transition hover:border-royal-blue hover:text-royal-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-light-brown dark:border-white/10 dark:bg-neutral-900/80 dark:text-neutral-200"
              >
                <span>Email concierge</span>
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  {SUPPORT_EMAIL}
                </span>
              </a>
              <a
                href={`tel:${SUPPORT_PHONE.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center justify-between gap-3 rounded-2xl border border-black/10 bg-white px-4 py-3 text-left text-sm font-medium text-gray-700 shadow-sm transition hover:border-royal-blue hover:text-royal-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-light-brown dark:border-white/10 dark:bg-neutral-900/80 dark:text-neutral-200"
              >
                <span>Call us directly</span>
                <span className="text-xs uppercase tracking-wide text-gray-500">
                  {SUPPORT_PHONE}
                </span>
              </a>
            </div>
          </section>

          {isAuthenticated ? (
            <section className="rounded-2xl border border-kalahari-gold/60 bg-black/90 p-4 shadow-subtle text-kalahari-gold">
              <h3 className="text-base font-semibold">Chat with our AI muse</h3>
              <p className="mt-1 text-sm text-kalahari-gold/90">
                Premium members get instant travel curation from VisiVentur
                Intelligence.
              </p>
              <button
                type="button"
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-kalahari-gold px-4 py-2 text-sm font-semibold uppercase tracking-wide transition hover:bg-kalahari-gold/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-kalahari-gold focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                onClick={onClose}
              >
                Open chat assistant
              </button>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}
