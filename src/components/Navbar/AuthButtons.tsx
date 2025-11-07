'use client';

import Link from 'next/link';
import { track, navbarEvents } from '@/lib/analytics';

export default function AuthButtons() {
  const handleSignUpClick = () => {
    track(navbarEvents.SIGNUP_CLICK);
  };

  const handleSignInClick = () => {
    track(navbarEvents.SIGNIN_CLICK);
  };

  return (
    <div className="flex items-center gap-3">
      <Link
        href="/auth/sign-in"
        onClick={handleSignInClick}
        className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Sign In
      </Link>
      <Link
        href="/auth/sign-up"
        onClick={handleSignUpClick}
        className="rounded-lg bg-royal-blue px-4 py-2 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Sign Up — It&apos;s free
      </Link>
    </div>
  );
}