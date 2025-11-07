"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";

import { track } from "@/lib/analytics";
import { getPreferredGateway } from "@/lib/payments";
import type { CurrencyCode } from "@/types/currency";

import { useNavbarStore } from "./store";

const CURRENCIES: Array<{
  code: CurrencyCode;
  name: string;
  symbol: string;
}> = [
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
];

type Variant = "default" | "drawer";

export interface CurrencySelectorProps {
  variant?: Variant;
}

type OptionRefList = Array<HTMLButtonElement | null>;

export default function CurrencySelector({ variant = "default" }: CurrencySelectorProps) {
  const { currency, setCurrency, hasHydrated } = useNavbarStore();

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    Math.max(
      CURRENCIES.findIndex((option) => option.code === currency),
      0,
    ),
  );

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const optionRefs = useRef<OptionRefList>([]);
  const listboxId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const nextIndex = CURRENCIES.findIndex((option) => option.code === currency);
    const safeIndex = Math.max(nextIndex, 0);
    setActiveIndex(safeIndex);

    const focusTimer = window.setTimeout(() => {
      optionRefs.current[safeIndex]?.focus();
    }, 0);

    return () => window.clearTimeout(focusTimer);
  }, [currency, isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleClickAway = (event: MouseEvent) => {
      const target = event.target as Node;

      if (
        buttonRef.current?.contains(target) ||
        optionRefs.current.some((option) => option?.contains(target))
      ) {
        return;
      }

      setIsOpen(false);
    };

    window.addEventListener("mousedown", handleClickAway);
    return () => window.removeEventListener("mousedown", handleClickAway);
  }, [isOpen]);

  const label = useMemo(() => {
    const option = CURRENCIES.find((item) => item.code === currency);
    return option ? `${option.symbol} ${option.code}` : currency;
  }, [currency]);

  const openListbox = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeListbox = useCallback(() => {
    setIsOpen(false);
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  const moveActiveIndex = useCallback((direction: 1 | -1) => {
    setActiveIndex((current) => {
      const next = (current + direction + CURRENCIES.length) % CURRENCIES.length;
      optionRefs.current[next]?.focus();
      return next;
    });
  }, []);

  const commitSelection = useCallback(
    async (nextCurrency: CurrencyCode) => {
      closeListbox();
      if (nextCurrency === currency) return;

      await setCurrency(nextCurrency);
      const gateway = getPreferredGateway(nextCurrency);
      track("nav.currency_change", {
        currency: nextCurrency,
        gateway,
      });
    },
    [closeListbox, currency, setCurrency],
  );

  const handleButtonKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        if (!isOpen) {
          openListbox();
        }
        const direction = event.key === "ArrowDown" ? 1 : -1;
        moveActiveIndex(direction);
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        setIsOpen((prev) => !prev);
      }
    },
    [isOpen, moveActiveIndex, openListbox],
  );

  const handleOptionKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, optionCode: CurrencyCode) => {
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        event.preventDefault();
        const direction = event.key === "ArrowDown" ? 1 : -1;
        moveActiveIndex(direction);
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        void commitSelection(optionCode);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        closeListbox();
      }
    },
    [closeListbox, commitSelection, moveActiveIndex],
  );

  const handleOptionClick = useCallback(
    (selected: CurrencyCode) => {
      void commitSelection(selected);
    },
    [commitSelection],
  );

  const triggerClasses =
    variant === "default"
      ? "inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white/70 px-3 py-2 text-sm font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-colors duration-200 ease-in-out hover:border-royal-blue hover:text-royal-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-light-brown dark:border-white/10 dark:bg-neutral-900/80 dark:text-neutral-200"
      : "flex w-full items-center justify-between gap-3 rounded-xl border border-black/10 bg-white/90 px-4 py-3 text-base font-medium text-gray-700 shadow-sm transition-colors duration-200 ease-in-out hover:border-royal-blue hover:text-royal-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-light-brown dark:border-white/10 dark:bg-neutral-900/80 dark:text-neutral-100";

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        className={triggerClasses}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={`${listboxId}-listbox`}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleButtonKeyDown}
        disabled={!hasHydrated}
      >
        <span aria-hidden="true" className="text-lg font-semibold">
          {label.slice(0, 1)}
        </span>
        <span className="text-sm font-semibold tracking-wide">
          {label}
        </span>
        <span
          aria-hidden="true"
          className="ml-1 inline-flex h-5 w-5 items-center justify-center rounded-full bg-royal-blue/10 text-xs font-semibold text-royal-blue"
        >
          ↓
        </span>
      </button>
      {isOpen && (
        <div
          role="listbox"
          id={`${listboxId}-listbox`}
          aria-activedescendant={`${listboxId}-option-${activeIndex}`}
          className="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-lg shadow-slate-900/10 backdrop-blur-sm focus:outline-none dark:border-white/10 dark:bg-neutral-900/95"
        >
          {CURRENCIES.map((option, index) => {
            const isSelected = option.code === currency;
            return (
              <button
                key={option.code}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                type="button"
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                className={`flex w-full items-center justify-between gap-3 px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue ${
                  isSelected
                    ? "bg-royal-blue/10 text-royal-blue dark:text-royal-blue"
                    : "text-gray-700 hover:bg-royal-blue/10 hover:text-royal-blue dark:text-neutral-200"
                }`}
                onClick={() => handleOptionClick(option.code)}
                onKeyDown={(event) => handleOptionKeyDown(event, option.code)}
              >
                <span className="flex items-center gap-2">
                  <span aria-hidden="true" className="text-lg">
                    {option.symbol}
                  </span>
                  <span>{option.code}</span>
                </span>
                <span className="text-xs uppercase tracking-wider text-gray-500">
                  {option.name}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
