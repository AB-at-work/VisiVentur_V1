import Link from 'next/link';
import { track, navbarEvents } from '@/lib/analytics';

export default function Logo() {
  const handleClick = () => {
    track(navbarEvents.LOGO_CLICK);
  };

  return (
    <Link
      href="/"
      onClick={handleClick}
      className="group flex items-center space-x-2 transition-transform duration-200 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-lg"
      aria-label="VisiVentur — Home"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        className="text-royal-blue dark:text-deep-navy"
        aria-hidden="true"
      >
        <path
          d="M16 2L2 10V22L16 30L30 22V10L16 2Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 10L8 14V18L16 22L24 18V14L16 10Z"
          fill="currentColor"
          opacity="0.2"
        />
        <path
          d="M16 10V22M8 14L24 18M24 14L8 18"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span className="text-xl font-bold tracking-tight text-foreground font-serif">
        VisiVentur
      </span>
    </Link>
  );
}