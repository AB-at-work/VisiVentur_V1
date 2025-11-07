"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
} from "react";
import { signOut } from "next-auth/react";

import { track } from "@/lib/analytics";

import type { NavbarUser } from "./store";

export interface ProfileMenuProps {
  user: NavbarUser;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

type MenuOption = {
  id: string;
  label: string;
  href: string;
};

const MENU_OPTIONS: MenuOption[] = [
  { id: "profile", label: "Profile", href: "/profile" },
  { id: "dashboard", label: "Dashboard", href: "/dashboard" },
  {
    id: "subscription",
    label: "Manage Subscription",
    href: "/account/subscription",
  },
];

function getInitials(user: NavbarUser): string {
  if (user.name) {
    return user.name
      .split(" ")
      .map((segment) => segment[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  if (user.email) {
    return user.email.slice(0, 2).toUpperCase();
  }

  return "VV";
}

export default function ProfileMenu({
  user,
  variant = "desktop",
  onNavigate,
}: ProfileMenuProps) {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const menuRefs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current?.contains(event.target as Node) ||
        menuRefs.current.some((item) => item?.contains(event.target as Node))
      ) {
        return;
      }
      setOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const timer = window.setTimeout(() => {
      menuRefs.current[0]?.focus({ preventScroll: true });
    }, 0);

    return () => window.clearTimeout(timer);
  }, [open]);

  const handleToggle = useCallback(() => {
    setOpen((current) => {
      const next = !current;
      if (next) {
        track("nav.profile_open");
      }
      return next;
    });
  }, []);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>) => {
      if (event.key === "ArrowDown") {
        event.preventDefault();
        setOpen(true);
        menuRefs.current[0]?.focus({ preventScroll: true });
      }
    },
    [],
  );

  const handleMenuKeyDown = useCallback((event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      triggerRef.current?.focus({ preventScroll: true });
    }

    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") {
      return;
    }

    event.preventDefault();
    const currentIndex = menuRefs.current.findIndex(
      (element) => element === event.currentTarget,
    );
    if (currentIndex === -1) return;

    const direction = event.key === "ArrowDown" ? 1 : -1;
    const nextIndex =
      (currentIndex + direction + menuRefs.current.length) % menuRefs.current.length;
    menuRefs.current[nextIndex]?.focus({ preventScroll: true });
  }, []);

  const avatarContent = useMemo(() => {
    const initials = getInitials(user);
    return (
      <span
        aria-hidden="true"
        className="flex h-10 w-10 items-center justify-center rounded-full bg-royal-blue/20 text-sm font-semibold text-royal-blue"
      >
        {initials}
      </span>
    );
  }, [user]);

  const containerClasses =
    variant === "desktop"
      ? "relative"
      : "flex w-full flex-col gap-2 rounded-2xl border border-black/10 bg-white/90 p-4 shadow-sm dark:border-white/10 dark:bg-neutral-900";

  const triggerClasses =
    variant === "desktop"
      ? "flex items-center gap-3 rounded-2xl border border-transparent px-2 py-1 text-left transition hover:border-royal-blue/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-light-brown"
      : "flex items-center gap-3 text-left";

  const badge = user.unreadNotifications && user.unreadNotifications > 0;

  const premiumOutline = user.isPremium ? "border border-kalahari-gold" : "";

  const handleLogout = useCallback(async () => {
    setOpen(false);
    track("nav.logout");
    await signOut({ callbackUrl: "/" });
  }, []);

  const listClasses =
    variant === "desktop"
      ? "absolute right-0 z-50 mt-3 w-60 overflow-hidden rounded-2xl border border-black/10 bg-white/95 p-2 shadow-lg shadow-slate-900/10 backdrop-blur-sm focus:outline-none dark:border-white/10 dark:bg-neutral-900/95"
      : "mt-4 flex w-full flex-col gap-2";

  const linkClasses =
    variant === "desktop"
      ? "block rounded-xl px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-royal-blue/10 hover:text-royal-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue"
      : "block rounded-xl border border-black/10 px-3 py-2 text-sm font-medium text-gray-700 transition hover:border-royal-blue hover:text-royal-blue focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue dark:border-white/10 dark:text-neutral-200";

  if (open || variant === "mobile") {
    menuRefs.current = [];
  }

  return (
    <div className={containerClasses}>
      <button
        ref={triggerRef}
        type="button"
        className={`${triggerClasses} ${premiumOutline}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls="visiventur-profile-menu"
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
      >
        <span className="relative inline-flex items-center justify-center">
          {avatarContent}
          {badge ? (
            <span className="absolute -right-0.5 -top-0.5 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-kalahari-gold text-[10px] font-bold text-black shadow-sm">
              {Math.min(user.unreadNotifications ?? 0, 9)}
            </span>
          ) : null}
        </span>
        <span className="hidden flex-col text-left text-sm sm:flex">
          <span className="font-semibold text-deep-navy dark:text-neutral-100">
            {user.name ?? "Traveller"}
          </span>
          <span className="text-xs text-gray-500 dark:text-neutral-400">
            {user.email ?? "View profile"}
          </span>
        </span>
      </button>

      {open || variant === "mobile" ? (
        <nav
          id="visiventur-profile-menu"
          role="menu"
          aria-label="Profile navigation"
          className={listClasses}
        >
          {MENU_OPTIONS.map((option, index) => (
            <a
              key={option.id}
              ref={(element) => {
                menuRefs.current[index] = element;
              }}
              href={option.href}
              role="menuitem"
              className={linkClasses}
              onClick={() => {
                setOpen(false);
                if (typeof onNavigate === "function") {
                  onNavigate();
                }
              }}
              onKeyDown={handleMenuKeyDown}
            >
              {option.label}
            </a>
          ))}
          <button
            ref={(element) => {
              menuRefs.current[MENU_OPTIONS.length] = element;
            }}
            type="button"
            role="menuitem"
            className={
              variant === "desktop"
                ? "mt-1 w-full rounded-xl bg-royal-blue px-3 py-2 text-sm font-semibold text-white transition hover:bg-royal-blue/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue"
                : "w-full rounded-xl bg-black px-3 py-2 text-sm font-semibold text-white transition hover:bg-black/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue"
            }
            onClick={handleLogout}
            onKeyDown={handleMenuKeyDown}
          >
            Log out
          </button>
        </nav>
      ) : null}
    </div>
  );
}
