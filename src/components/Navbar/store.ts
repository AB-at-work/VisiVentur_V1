import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Currency } from '@/lib/payments';

export type ThemeMode = 'light' | 'dark' | 'premium';

export interface NavbarState {
  // Currency state
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  
  // Theme state
  themeMode: ThemeMode;
  setThemeMode: (theme: ThemeMode) => void;
  
  // UI state
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  
  // Help modal state
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;
  
  // Profile menu state
  isProfileMenuOpen: boolean;
  setIsProfileMenuOpen: (open: boolean) => void;
  
  // Auth state (minimal, hydrated from NextAuth)
  isAuthenticated: boolean;
  setIsAuthenticated: (authenticated: boolean) => void;
  
  // User info (minimal)
  userName?: string;
  userAvatar?: string;
  isPremium?: boolean;
  setUserInfo: (info: { name?: string; avatar?: string; isPremium?: boolean }) => void;
}

export const useNavbarStore = create<NavbarState>()(
  persist(
    (set, get) => ({
      // Default currency
      currency: 'USD',
      setCurrency: (currency) => {
        set({ currency });
        // Track currency change
        import('@/lib/analytics').then(({ track, navbarEvents }) => {
          track(navbarEvents.CURRENCY_CHANGE, { currency });
        });
      },
      
      // Default theme
      themeMode: 'dark',
      setThemeMode: (themeMode) => {
        set({ themeMode });
        // Update data-theme attribute on document
        if (typeof document !== 'undefined') {
          document.documentElement.setAttribute('data-theme', themeMode);
        }
      },
      
      // Mobile menu state
      isMobileMenuOpen: false,
      setIsMobileMenuOpen: (isMobileMenuOpen) => {
        const wasOpen = get().isMobileMenuOpen;
        set({ isMobileMenuOpen });
        
        // Track mobile menu interactions
        import('@/lib/analytics').then(({ track, navbarEvents }) => {
          if (!wasOpen && isMobileMenuOpen) {
            track(navbarEvents.MOBILE_MENU_TOGGLE);
          } else if (wasOpen && !isMobileMenuOpen) {
            track(navbarEvents.MOBILE_MENU_CLOSE);
          }
        });
      },
      
      // Help modal state
      isHelpModalOpen: false,
      setIsHelpModalOpen: (isHelpModalOpen) => {
        set({ isHelpModalOpen });
        
        // Track help modal open
        if (isHelpModalOpen) {
          import('@/lib/analytics').then(({ track, navbarEvents }) => {
            track(navbarEvents.HELP_OPEN);
          });
        }
      },
      
      // Profile menu state
      isProfileMenuOpen: false,
      setIsProfileMenuOpen: (isProfileMenuOpen) => {
        set({ isProfileMenuOpen });
        
        // Track profile menu open
        if (isProfileMenuOpen) {
          import('@/lib/analytics').then(({ track, navbarEvents }) => {
            track(navbarEvents.PROFILE_OPEN);
          });
        }
      },
      
      // Auth state
      isAuthenticated: false,
      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      
      // User info
      userName: undefined,
      userAvatar: undefined,
      isPremium: undefined,
      setUserInfo: (info) => set((state) => ({
        ...state,
        ...info,
      })),
    }),
    {
      name: 'navbar-storage',
      // Only persist certain fields
      partialize: (state) => ({
        currency: state.currency,
        themeMode: state.themeMode,
      }),
    }
  )
);

// Hook to initialize theme on client side
export function useInitializeTheme() {
  const { themeMode } = useNavbarStore();
  
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', themeMode);
  }
}