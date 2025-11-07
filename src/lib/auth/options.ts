import { PrismaAdapter } from "@auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import Google from "next-auth/providers/google";

import type { CurrencyCode } from "@/types/currency";
import { prisma } from "@/lib/prisma";

const FALLBACK_CLIENT_ID = process.env.GOOGLE_CLIENT_ID ?? "";
const FALLBACK_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET ?? "";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    Google({
      clientId: FALLBACK_CLIENT_ID,
      clientSecret: FALLBACK_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.sub;
        session.user.isPremium = Boolean(token.isPremium);
        session.user.preferredCurrency = (token.preferredCurrency as CurrencyCode | undefined) ?? "USD";
        session.user.unreadNotifications = typeof token.unreadNotifications === "number" ? token.unreadNotifications : 0;
      }
      return session;
    },
    jwt: async ({ token, user }) => {
      if (user) {
        token.isPremium = user.isPremium ?? false;
        token.preferredCurrency = user.preferredCurrency ?? "USD";
        token.unreadNotifications = user.unreadNotifications ?? 0;
      }
      return token;
    },
  },
};
