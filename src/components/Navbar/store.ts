"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import type { CurrencyCode } from "@/types/currency";

const CURRENCY_STORAGE_KEY = "visiventur.currency";

export type ThemeMode = "light" | "dark" | "premium";

export interface NavbarUser {
  id?: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  isPremium?: boolean;
  preferredCurrency?: CurrencyCode;
  unreadNotifications?: number;
}

interface NavbarStoreValue {
  currency: CurrencyCode;
  themeMode: ThemeMode;
  user: NavbarUser | null;
  hasHydrated: boolean;
  setCurrency: (currency: CurrencyCode) => Promise<void>;
  setThemeMode: (mode: ThemeMode) => void;
  setUser: (user: NavbarUser | null) => void;
}

const NavbarStoreContext = createContext<NavbarStoreValue | null>(null);

const isValidCurrency = (input: string | null | undefined): input is CurrencyCode => {
  if (!input) return false;
  return ["INR", "USD", "EUR", "GBP"].includes(input);
};

async function persistCurrencyPreference(
  currency: CurrencyCode,
  user: NavbarUser | null,
): Promise<void> {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(CURRENCY_STORAGE_KEY, currency);
  }

  if (user?.id) {
    try {
      const payload = JSON.stringify({ currency });

      if (typeof navigator !== "undefined" && "sendBeacon" in navigator) {
        const blob = new Blob([payload], { type: "application/json" });
        navigator.sendBeacon("/api/user/preferences", blob);
        return;
      }

      const response = await fetch("/api/user/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      });

      if (!response.ok) {
        // eslint-disable-next-line no-console
        console.warn("Failed to persist currency preference", response.statusText);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn("Failed to persist currency preference", error);
    }
  }
}

export interface NavbarProviderProps {
  children: ReactNode;
  initialCurrency?: CurrencyCode;
  initialThemeMode?: ThemeMode;
  sessionUser?: NavbarUser | null;
}

export function NavbarProvider({
  children,
  initialCurrency,
  initialThemeMode,
  sessionUser,
}: NavbarProviderProps) {
  const derivedCurrency =
    initialCurrency ?? sessionUser?.preferredCurrency ?? "USD";
  const derivedTheme: ThemeMode = initialThemeMode
    ? initialThemeMode
    : sessionUser?.isPremium
      ? "premium"
      : "light";

  const [currency, setCurrencyState] = useState<CurrencyCode>(derivedCurrency);
  const [themeMode, setThemeModeState] = useState<ThemeMode>(derivedTheme);
  const [userState, setUserState] = useState<NavbarUser | null>(
    sessionUser ?? null,
  );
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const stored = window.localStorage.getItem(CURRENCY_STORAGE_KEY);
    if (isValidCurrency(stored)) {
      setCurrencyState(stored);
    }
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;

    document.documentElement.dataset.theme = themeMode;
  }, [themeMode]);

  const setCurrency = useCallback(
    async (nextCurrency: CurrencyCode) => {
      setCurrencyState(nextCurrency);
      await persistCurrencyPreference(nextCurrency, userState);
    },
    [userState],
  );

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
  }, []);

  const setUser = useCallback(
    (nextUser: NavbarUser | null) => {
      setUserState(nextUser);
      if (nextUser?.isPremium) {
        setThemeModeState("premium");
      }
    },
    [],
  );

  const value = useMemo<NavbarStoreValue>(
    () => ({
      currency,
      themeMode,
      user: userState,
      hasHydrated,
      setCurrency,
      setThemeMode,
      setUser,
    }),
    [currency, themeMode, userState, hasHydrated, setCurrency, setThemeMode, setUser],
  );

  return (
    <NavbarStoreContext.Provider value={value}>
      {children}
    </NavbarStoreContext.Provider>
  );
}

export function useNavbarStore(): NavbarStoreValue {
  const context = useContext(NavbarStoreContext);
  if (!context) {
    throw new Error("useNavbarStore must be used within a NavbarProvider");
  }
  return context;
}
