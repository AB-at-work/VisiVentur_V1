'use client';

import { useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useNavbarStore } from './store';
import CurrencySelector from './CurrencySelector';
import { cn } from '@/lib/utils';

export default function MobileDrawer() {
  const { isMobileMenuOpen, setIsMobileMenuOpen, isAuthenticated } = useNavbarStore();
  const pathname = usePathname();
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const firstFocusRef = useRef<HTMLAnchorElement>(null);

  // Focus management
  useEffect(() => {
    if (isMobileMenuOpen) {
      // Focus the close button when drawer opens
      closeButtonRef.current?.focus();
      
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
      
      // Trap focus within drawer
      const handleTabKey = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        
        const focusableElements = drawerRef.current?.querySelectorAll(
          'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ) as NodeListOf<HTMLElement>;
        
        if (!focusableElements.length) return;
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
          }
        } else {
          if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
          }
        }
      };
      
      document.addEventListener('keydown', handleTabKey);
      
      return () => {
        document.removeEventListener('keydown', handleTabKey);
        document.body.style.overflow = '';
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [isMobileMenuOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen, setIsMobileMenuOpen]);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { href: '/pricing', label: 'Pricing' },
    { href: '/destinations', label: 'Destinations' },
    { href: '/explore', label: 'Explore' },
  ];

  if (!isMobileMenuOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
        onClick={() => setIsMobileMenuOpen(false)}
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div
        ref={drawerRef}
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-80 max-w-[80vw] transform bg-background shadow-xl transition-transform duration-300 ease-in-out md:hidden',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mobile-menu-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-4 py-4">
          <h2 id="mobile-menu-title" className="text-lg font-semibold text-foreground">
            Menu
          </h2>
          <button
            ref={closeButtonRef}
            onClick={() => setIsMobileMenuOpen(false)}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2"
            aria-label="Close mobile menu"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Content */}
        <div className="flex flex-col h-full">
          <nav className="flex-1 px-4 py-6">
            {/* Primary Links */}
            <div className="mb-6">
              <h3 className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Navigation
              </h3>
              <div className="space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    ref={link.href === pathname ? firstFocusRef : undefined}
                    onClick={handleLinkClick}
                    className={cn(
                      'block rounded-lg px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2',
                      pathname === link.href
                        ? 'bg-royal-blue/10 text-royal-blue dark:bg-deep-navy/10 dark:text-deep-navy'
                        : 'text-gray-600 dark:text-gray-400 hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-800'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            
            {/* Currency Selector */}
            <div className="mb-6">
              <h3 className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Currency
              </h3>
              <CurrencySelector />
            </div>
            
            {/* Help */}
            <div className="mb-6">
              <h3 className="mb-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Support
              </h3>
              <button
                onClick={() => {
                  // This would open the help modal
                  setIsMobileMenuOpen(false);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Help & Support
              </button>
            </div>
          </nav>
          
          {/* Auth Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-4">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  href="/profile"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Profile
                </Link>
                <Link
                  href="/dashboard"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:text-foreground hover:bg-gray-50 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/auth/sign-in"
                  onClick={handleLinkClick}
                  className="block w-full rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-center text-sm font-medium text-gray-600 dark:text-gray-400 transition-colors hover:border-gray-400 dark:hover:border-gray-600 hover:text-foreground focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/sign-up"
                  onClick={handleLinkClick}
                  className="block w-full rounded-lg bg-royal-blue px-4 py-2 text-center text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2"
                >
                  Sign Up — It&apos;s free
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}