import type { CurrencyCode } from "@/types/currency";

declare module "next-auth" {
  interface Session {
    user?: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      isPremium?: boolean;
      preferredCurrency?: CurrencyCode;
      unreadNotifications?: number;
    } | null;
  }

  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    isPremium?: boolean;
    preferredCurrency?: CurrencyCode;
    unreadNotifications?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    sub?: string;
    name?: string | null;
    email?: string | null;
    picture?: string | null;
    isPremium?: boolean;
    preferredCurrency?: CurrencyCode;
    unreadNotifications?: number;
  }
}
