'use client';

import { useState, useRef, useEffect } from 'react';
import { useNavbarStore } from './store';
import { CURRENCIES, type Currency } from '@/lib/payments';
import { cn } from '@/lib/utils';

export default function CurrencySelector() {
  const { currency, setCurrency } = useNavbarStore();
  const [isOpen, setIsOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);

  const selectedCurrency = CURRENCIES[currency];

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        !buttonRef.current?.contains(event.target as Node) &&
        !listboxRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleSelect = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        type="button"
        className={cn(
          'flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background',
          'border-gray-300 dark:border-gray-700 bg-background hover:border-gray-400 dark:hover:border-gray-600'
        )}
        aria-label={`Currency: ${selectedCurrency.name} (${selectedCurrency.symbol})`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        id="currency-selector"
      >
        <span className="text-base" aria-hidden="true">
          {selectedCurrency.symbol}
        </span>
        <span className="hidden sm:inline">{selectedCurrency.code}</span>
        <svg
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            isOpen ? 'rotate-180' : ''
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <ul
          ref={listboxRef}
          role="listbox"
          aria-labelledby="currency-selector"
          className={cn(
            'absolute right-0 z-50 mt-1 w-40 rounded-lg border bg-background shadow-lg',
            'border-gray-200 dark:border-gray-700',
            'focus:outline-none'
          )}
        >
          {(Object.values(CURRENCIES) as Array<{ code: Currency; symbol: string; name: string }>).map(
            (curr) => (
              <li key={curr.code}>
                <button
                  type="button"
                  onClick={() => handleSelect(curr.code)}
                  className={cn(
                    'w-full px-3 py-2 text-left text-sm transition-colors duration-150',
                    'focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800',
                    curr.code === currency
                      ? 'bg-royal-blue/10 text-royal-blue dark:bg-deep-navy/10 dark:text-deep-navy'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800'
                  )}
                  role="option"
                  aria-selected={curr.code === currency}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-base" aria-hidden="true">
                        {curr.symbol}
                      </span>
                      <span>{curr.code}</span>
                    </div>
                    {curr.code === currency && (
                      <svg
                        className="h-4 w-4 text-royal-blue dark:text-deep-navy"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>
                </button>
              </li>
            )
          )}
        </ul>
      )}
    </div>
  );
}