import Link from "next/link";
import type { MouseEventHandler } from "react";

export interface LogoProps {
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

export default function Logo({ onClick }: LogoProps) {
  return (
    <Link
      href="/"
      aria-label="VisiVentur — Home"
      onClick={onClick}
      className="group flex items-center gap-2 rounded-2xl px-2 py-1 font-serif text-xl font-semibold text-deep-navy transition-transform duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-light-brown hover:scale-[1.04] dark:text-neutral-50"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 210 32"
        className="h-7 w-auto fill-current drop-shadow-sm"
      >
        <text
          x="0"
          y="23"
          className="font-serif"
          fontSize="22"
          fontWeight="600"
          letterSpacing="0.08em"
        >
          VisiVentur
        </text>
      </svg>
      <span className="sr-only">VisiVentur</span>
    </Link>
  );
}
