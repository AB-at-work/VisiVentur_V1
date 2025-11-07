'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface PrimaryLinkProps {
  href: string;
  children: React.ReactNode;
}

function PrimaryLink({ href, children }: PrimaryLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        'text-sm font-medium transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-md px-3 py-2',
        isActive
          ? 'text-royal-blue dark:text-deep-navy'
          : 'text-gray-600 dark:text-gray-400 hover:text-foreground'
      )}
    >
      {children}
    </Link>
  );
}

export default function PrimaryLinks() {
  return (
    <nav className="hidden md:flex items-center space-x-1" aria-label="Primary navigation">
      <PrimaryLink href="/pricing">Pricing</PrimaryLink>
      <PrimaryLink href="/destinations">Destinations</PrimaryLink>
      <PrimaryLink href="/explore">Explore</PrimaryLink>
    </nav>
  );
}