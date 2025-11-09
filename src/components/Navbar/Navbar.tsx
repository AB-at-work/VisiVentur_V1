"use client";

import { useCallback, useId, useMemo, useState } from "react";
import type { Session } from "next-auth";

import { track } from "@/lib/analytics";
import type { CurrencyCode } from "@/types/currency";

import AuthButtons from "./AuthButtons";
import CurrencySelector from "./CurrencySelector";
import HelpModal from "./HelpModal";
import Logo from "./Logo";
import MobileDrawer from "./MobileDrawer";
import PrimaryLinks from "./PrimaryLinks";
import ProfileMenu from "./ProfileMenu";
import { NavbarProvider, type NavbarUser, type ThemeMode } from "./store";

export interface NavbarProps {
  session: Session | null;
  initialCurrency?: CurrencyCode;
  initialThemeMode?: ThemeMode;
}

const helpButtonId = "visiventur-help-button";

export default function Navbar({
  session,
  initialCurrency,
  initialThemeMode,
}: NavbarProps) {
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const helpDescriptionId = useId();

  const sessionUser = useMemo<NavbarUser | null>(() => {
    if (!session?.user) return null;
    return {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image ?? undefined,
      preferredCurrency: session.user.preferredCurrency,
      isPremium: session.user.isPremium,
      unreadNotifications: session.user.unreadNotifications,
    };
  }, [session]);

  const isAuthenticated = Boolean(sessionUser);

  const handleLogoClick = useCallback(() => {
    track("nav.logo_click");
    setIsDrawerOpen(false);
  }, []);

  const handleHelpOpen = useCallback(() => {
    setIsHelpOpen(true);
    track("nav.help_open");
  }, []);

  const handleHelpClose = useCallback(() => {
    setIsHelpOpen(false);
  }, []);

  const handleDrawerChange = useCallback((open: boolean) => {
    setIsDrawerOpen(open);
    if (open) {
      track("nav.drawer_open");
    }
  }, []);

  const handleDrawerNavigate = useCallback(() => {
    setIsDrawerOpen(false);
  }, []);

  return (
    <NavbarProvider
      sessionUser={sessionUser}
      initialCurrency={initialCurrency}
      initialThemeMode={
        initialThemeMode ?? (sessionUser?.isPremium ? "premium" : undefined)
      }
    >
      <header className="sticky top-0 z-50 border-b border-black/5 bg-light-brown/80 backdrop-blur-sm transition-colors duration-200 dark:border-neutral-800/60 dark:bg-black/80">
        <div className="mx-auto flex h-14 w-full items-center justify-between px-3 sm:h-16 sm:px-4 lg:h-18 lg:px-6 2xl:max-w-7xl">
          <div className="flex flex-1 items-center gap-3">
            <Logo onClick={handleLogoClick} />
            <div className="hidden lg:flex">
              <PrimaryLinks onNavigate={handleDrawerNavigate} />
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden items-center gap-3 sm:flex">
              <CurrencySelector />
              <button
                id={helpButtonId}
                type="button"
                aria-haspopup="dialog"
                aria-expanded={isHelpOpen}
                aria-controls="visiventur-help-dialog"
                aria-describedby={helpDescriptionId}
                className="inline-flex items-center gap-2 rounded-2xl border border-black/10 bg-white/80 px-3 py-2 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-royal-blue hover:text-royal-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-light-brown dark:border-white/10 dark:bg-neutral-900/80 dark:text-neutral-200"
                onClick={handleHelpOpen}
              >
                <span>Help</span>
              </button>
              <span id={helpDescriptionId} className="sr-only">
                Opens support options and concierge contact details.
              </span>
            </div>
            <div className="hidden items-center gap-3 sm:flex">
              {isAuthenticated && sessionUser ? (
                <ProfileMenu user={sessionUser} />
              ) : (
                <AuthButtons />
              )}
            </div>
            <div className="sm:hidden">
              <MobileDrawer open={isDrawerOpen} onOpenChange={handleDrawerChange}>
                <div className="space-y-6">
                  <div>
                    <PrimaryLinks
                      variant="vertical"
                      onNavigate={handleDrawerNavigate}
                    />
                  </div>
                  <div>
                    <CurrencySelector variant="drawer" />
                  </div>
                  <div className="flex flex-col gap-3">
                    <button
                      type="button"
                      className="w-full rounded-2xl border border-black/10 bg-white px-4 py-3 text-left text-sm font-semibold text-gray-700 shadow-sm transition hover:border-royal-blue hover:text-royal-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-light-brown dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-100"
                      onClick={() => {
                        handleDrawerNavigate();
                        handleHelpOpen();
                      }}
                    >
                      Help & concierge
                    </button>
                  </div>
                  <div>
                    {isAuthenticated && sessionUser ? (
                      <ProfileMenu
                        variant="mobile"
                        user={sessionUser}
                        onNavigate={handleDrawerNavigate}
                      />
                    ) : (
                      <AuthButtons variant="mobile" />
                    )}
                  </div>
                </div>
              </MobileDrawer>
            </div>
          </div>
        </div>
      </header>
      <HelpModal
        open={isHelpOpen}
        onClose={handleHelpClose}
        isAuthenticated={isAuthenticated}
      />
    </NavbarProvider>
  );
}
