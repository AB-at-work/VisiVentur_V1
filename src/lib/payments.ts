import type { CurrencyCode } from "@/types/currency";

export type PaymentGateway = "Razorpay" | "Stripe";

export function getPreferredGateway(currency: CurrencyCode): PaymentGateway {
  return currency === "INR" ? "Razorpay" : "Stripe";
}
