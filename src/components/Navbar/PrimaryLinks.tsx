"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";

const NAV_LINKS = [
  { href: "/pricing", label: "Pricing" },
  { href: "/destinations", label: "Destinations" },
  { href: "/explore", label: "Explore" },
] as const;

type LayoutVariant = "horizontal" | "vertical";

export interface PrimaryLinksProps {
  onNavigate?: () => void;
  variant?: LayoutVariant;
}

export default function PrimaryLinks({
  onNavigate,
  variant = "horizontal",
}: PrimaryLinksProps) {
  const pathname = usePathname();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (typeof onNavigate === "function") {
      onNavigate();
    }

    const target = event.currentTarget as HTMLAnchorElement;
    if (target.dataset?.placeholder === "true") {
      event.preventDefault();
    }
  };

  return (
    <ul
      role="list"
      className={
        variant === "horizontal"
          ? "flex items-center gap-6"
          : "flex flex-col gap-4"
      }
    >
      {NAV_LINKS.map(({ href, label }, index) => {
        const isActive = pathname === href;
        const isPlaceholder = index === 1; // Destinations placeholder for dropdown

        return (
          <li key={href}>
            <Link
              href={href}
              data-placeholder={isPlaceholder}
              aria-disabled={isPlaceholder}
              aria-current={isActive ? "page" : undefined}
              tabIndex={isPlaceholder ? -1 : undefined}
              onClick={handleClick}
              className={`font-medium transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-light-brown ${
                isActive
                  ? "text-royal-blue dark:text-royal-blue"
                  : "text-gray-700 hover:text-royal-blue dark:text-neutral-300 dark:hover:text-royal-blue"
              } ${isPlaceholder ? "cursor-not-allowed opacity-70" : ""}`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
