'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useNavbarStore } from './store';
import { track, navbarEvents } from '@/lib/analytics';
import { cn } from '@/lib/utils';

export default function ProfileMenu() {
  const { userName, userAvatar, isPremium, setIsProfileMenuOpen, setIsAuthenticated, setUserInfo } = useNavbarStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        !buttonRef.current?.contains(event.target as Node) &&
        !dropdownRef.current?.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setIsProfileMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setIsProfileMenuOpen]);

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsDropdownOpen(false);
      setIsProfileMenuOpen(false);
      buttonRef.current?.focus();
    }
  };

  const handleMenuToggle = () => {
    const newState = !isDropdownOpen;
    setIsDropdownOpen(newState);
    setIsProfileMenuOpen(newState);
  };

  const handleLogout = () => {
    track(navbarEvents.LOGOUT);
    setIsDropdownOpen(false);
    setIsProfileMenuOpen(false);
    setIsAuthenticated(false);
    setUserInfo({ name: undefined, avatar: undefined, isPremium: undefined });
    
    // In a real app, you would also call NextAuth signOut here
    window.location.href = '/auth/sign-in';
  };

  const menuItems = [
    {
      label: 'Profile',
      href: '/profile',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      label: 'Dashboard',
      href: '/dashboard',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      label: 'Manage Subscription',
      href: '/subscription',
      icon: (
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleMenuToggle}
        onKeyDown={handleKeyDown}
        type="button"
        className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-royal-blue focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        aria-label="User menu"
        aria-haspopup="true"
        aria-expanded={isDropdownOpen}
      >
        <div className="relative">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-royal-blue text-white">
            {userAvatar ? (
              <img
                src={userAvatar}
                alt={userName || 'User avatar'}
                className="h-8 w-8 rounded-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium">
                {userName?.charAt(0)?.toUpperCase() || 'U'}
              </span>
            )}
          </div>
          
          {/* Premium badge */}
          {isPremium && (
            <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-kalahari-gold">
              <svg className="h-3 w-3 text-black" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
          )}
          
          {/* Unread indicator */}
          <div className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-red-500 border-2 border-background" aria-hidden="true" />
        </div>
        
        <span className="hidden sm:block text-sm font-medium text-foreground">
          {userName || 'User'}
        </span>
        
        <svg
          className={cn(
            'hidden sm:block h-4 w-4 transition-transform duration-200 text-gray-500',
            isDropdownOpen ? 'rotate-180' : ''
          )}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className={cn(
            'absolute right-0 z-50 mt-2 w-56 rounded-lg border bg-background shadow-lg',
            'border-gray-200 dark:border-gray-700'
          )}
          role="menu"
        >
          <div className="py-1">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-800"
                role="menuitem"
                onClick={() => {
                  setIsDropdownOpen(false);
                  setIsProfileMenuOpen(false);
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            
            <div className="border-t border-gray-200 dark:border-gray-700 my-1" />
            
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:bg-red-50 dark:focus:bg-red-900/20"
              role="menuitem"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}