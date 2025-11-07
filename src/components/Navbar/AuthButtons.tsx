"use client";

import Link from "next/link";
import { useId } from "react";

import { track } from "@/lib/analytics";

export interface AuthButtonsProps {
  variant?: "desktop" | "mobile";
}

export default function AuthButtons({ variant = "desktop" }: AuthButtonsProps) {
  const descriptionPrefix = useId();

  const baseLinkClasses =
    "inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-semibold transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-light-brown";

  const signInClasses =
    variant === "desktop"
      ? `${baseLinkClasses} text-gray-700 hover:text-royal-blue dark:text-neutral-200 dark:hover:text-royal-blue`
      : `${baseLinkClasses} w-full border border-black/10 bg-white/80 text-gray-800 shadow-sm hover:border-royal-blue hover:text-royal-blue dark:border-white/10 dark:bg-neutral-900 dark:text-neutral-100`;

  const signUpClasses =
    variant === "desktop"
      ? `${baseLinkClasses} bg-royal-blue text-white shadow-sm hover:bg-royal-blue/90`
      : `${baseLinkClasses} w-full bg-royal-blue text-white shadow-sm hover:bg-royal-blue/90`;

  const signUpDescId = `${descriptionPrefix}-signup-desc`;
  const signInDescId = `${descriptionPrefix}-signin-desc`;
  const signInControlsId = `${descriptionPrefix}-signin-panel`;
  const signUpControlsId = `${descriptionPrefix}-signup-panel`;

  return (
    <div
      className={
        variant === "desktop"
          ? "flex items-center gap-3"
          : "flex flex-col gap-3 pt-4"
      }
    >
      <span id={signInDescId} className="sr-only">
        Opens the VisiVentur sign-in page.
      </span>
      <span id={signInControlsId} className="sr-only" aria-hidden="true">
        Sign-in form entry point
      </span>
      <Link
        href="/auth/sign-in"
        className={signInClasses}
        aria-describedby={signInDescId}
        aria-controls={signInControlsId}
        onClick={() => track("nav.signin_click")}
      >
        Sign In
      </Link>

      <span id={signUpDescId} className="sr-only">
        Join VisiVentur for free to unlock premium itineraries.
      </span>
      <span id={signUpControlsId} className="sr-only" aria-hidden="true">
        Sign-up form entry point
      </span>
      <Link
        href="/auth/sign-up"
        className={signUpClasses}
        aria-describedby={signUpDescId}
        aria-controls={signUpControlsId}
        onClick={() => track("nav.signup_click")}
      >
        Sign Up — It’s free
      </Link>
    </div>
  );
}
