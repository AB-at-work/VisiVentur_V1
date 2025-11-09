import "./globals.css";

import type { Metadata } from "next";
import { cookies } from "next/headers";
import { Inter, Playfair_Display } from "next/font/google";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";

import Navbar from "@/components/Navbar";
import { authOptions } from "@/lib/auth/options";
import type { CurrencyCode } from "@/types/currency";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "VisiVentur",
  description: "Experience journeys tailored to your senses",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let session: Session | null = null;

  try {
    session = await getServerSession(authOptions);
  } catch (error) {
    const isDynamicUsageError =
      typeof error === "object" &&
      error !== null &&
      "digest" in error &&
      (error as { digest?: unknown }).digest === "DYNAMIC_SERVER_USAGE";

    if (!isDynamicUsageError) {
      const reason = error instanceof Error ? error : new Error(String(error));
      console.error("Failed to retrieve session for navbar", reason);
    }
  }

  const cookieStore = await cookies();
  const storedCurrency = cookieStore.get("visiventur_preferred_currency")?.value;
  const initialCurrency =
    storedCurrency && ["INR", "USD", "EUR", "GBP"].includes(storedCurrency)
      ? (storedCurrency as CurrencyCode)
      : undefined;

  const initialTheme = session?.user?.isPremium ? "premium" : "light";

  return (
    <html lang="en" data-theme={initialTheme}>
      <body
        className={`${inter.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        <Navbar
          session={session}
          initialCurrency={initialCurrency}
          initialThemeMode={initialTheme}
        />
        <main>{children}</main>
      </body>
    </html>
  );
}
