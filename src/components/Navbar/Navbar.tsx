'use client';

import { useState, useEffect } from 'react';
import { useNavbarStore, useInitializeTheme } from './store';
import Logo from './Logo';
import PrimaryLinks from './PrimaryLinks';
import CurrencySelector from './CurrencySelector';
import HelpModal from './HelpModal';
import AuthButtons from './AuthButtons';
import ProfileMenu from './ProfileMenu';
import MobileDrawer from './MobileDrawer';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const { 
    isAuthenticated, 
    isMobileMenuOpen, 
    setIsMobileMenuOpen,
    themeMode 
  } = useNavbarStore();
  
  // Initialize theme on mount
  useInitializeTheme();
  
  const [isScrolled, setIsScrolled] = useState(false);

  // Handle scroll effect for backdrop blur
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Mobile menu button
  const MobileMenuButton = () => (
    <button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors md:hidden',
        'text-gray-600 dark:text-gray-400 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background'
      )}
      aria-label="Toggle mobile menu"
      aria-expanded={isMobileMenuOpen}
      aria-controls="mobile-menu"
    >
      <span className="sr-only">Toggle menu</span>
      
      {/* Hamburger icon */}
      <div className="flex w-5 flex-col items-center justify-center gap-1">
        <span 
          className={cn(
            'h-0.5 w-5 bg-current transition-all duration-300',
            isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''
          )} 
        />
        <span 
          className={cn(
            'h-0.5 w-5 bg-current transition-all duration-300',
            isMobileMenuOpen ? 'opacity-0' : ''
          )} 
        />
        <span 
          className={cn(
            'h-0.5 w-5 bg-current transition-all duration-300',
            isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
          )} 
        />
      </div>
    </button>
  );

  // Help button
  const HelpButton = () => (
    <button
      onClick={() => useNavbarStore.setState({ isHelpModalOpen: true })}
      className={cn(
        'relative flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
        'text-gray-600 dark:text-gray-400 hover:text-foreground hover:bg-gray-100 dark:hover:bg-gray-800',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background'
      )}
      aria-label="Help and support"
    >
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </button>
  );

  return (
    <>
      {/* Main Navbar */}
      <header
        className={cn(
          'sticky top-0 z-40 w-full transition-all duration-200',
          isScrolled ? 'backdrop-blur-sm' : ''
        )}
      >
        <div
          className={cn(
            'border-b transition-colors duration-200',
            themeMode === 'light' 
              ? 'bg-light-brown border-gray-200' 
              : themeMode === 'premium'
              ? 'bg-black border-kalahari-gold/20'
              : 'bg-black border-gray-800',
            isScrolled && 'bg-opacity-95 backdrop-blur-sm'
          )}
        >
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
            {/* Desktop: h-18 (72px), Mobile: h-14 (56px) */}
            <div className="flex h-14 items-center md:h-18">
              <div className="flex items-center">
                <MobileMenuButton />
                <div className="ml-4 md:ml-0">
                  <Logo />
                </div>
              </div>
            </div>

            {/* Center - Primary Links (Desktop/Tablet only) */}
            <div className="hidden lg:flex items-center flex-1 justify-center">
              <PrimaryLinks />
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Currency Selector (Desktop only) */}
              <div className="hidden sm:block">
                <CurrencySelector />
              </div>

              {/* Help Button */}
              <HelpButton />

              {/* Auth Section */}
              <div className="hidden md:block">
                {isAuthenticated ? (
                  <ProfileMenu />
                ) : (
                  <AuthButtons />
                )}
              </div>

              {/* Mobile Auth Indicator */}
              {isAuthenticated && (
                <div className="md:hidden">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-royal-blue text-white">
                    <span className="text-xs font-medium">
                      {useNavbarStore.getState().userName?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer />

      {/* Help Modal */}
      <HelpModal />

      {/* Spacer to prevent content from being hidden under sticky navbar */}
      <div className="h-14 md:h-18" />
    </>
  );
}