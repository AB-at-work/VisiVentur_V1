// Payment gateway utility for mapping currencies to payment providers

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';
export type PaymentGateway = 'Razorpay' | 'Stripe';

export interface CurrencyInfo {
  code: Currency;
  symbol: string;
  name: string;
  gateway: PaymentGateway;
}

export const CURRENCIES: Record<Currency, CurrencyInfo> = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    gateway: 'Razorpay',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    gateway: 'Stripe',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    gateway: 'Stripe',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    gateway: 'Stripe',
  },
};

export function getPreferredGateway(currency: Currency): PaymentGateway {
  return CURRENCIES[currency].gateway;
}

export function getCurrencySymbol(currency: Currency): string {
  return CURRENCIES[currency].symbol;
}

export function getCurrencyName(currency: Currency): string {
  return CURRENCIES[currency].name;
}

export function formatCurrency(amount: number, currency: Currency): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}