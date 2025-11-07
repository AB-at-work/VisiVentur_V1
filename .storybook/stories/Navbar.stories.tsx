import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { Navbar } from '../../src/components/Navbar';

// Mock the store for Storybook
const mockStore = {
  currency: 'USD',
  setCurrency: fn(),
  themeMode: 'dark',
  setThemeMode: fn(),
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: fn(),
  isHelpModalOpen: false,
  setIsHelpModalOpen: fn(),
  isProfileMenuOpen: false,
  setIsProfileMenuOpen: fn(),
  isAuthenticated: false,
  setIsAuthenticated: fn(),
  userName: undefined,
  userAvatar: undefined,
  isPremium: undefined,
  setUserInfo: fn(),
};

// Mock the store hook
jest.mock('../../src/components/Navbar/store', () => ({
  useNavbarStore: (selector: any) => selector(mockStore),
  useInitializeTheme: fn(),
}));

const meta: Meta<typeof Navbar> = {
  title: 'Components/Navbar',
  component: Navbar,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component: 'Global navigation bar with responsive design, currency selector, help modal, and authentication states.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    themeMode: {
      control: 'select',
      options: ['light', 'dark', 'premium'],
      description: 'Theme mode for the navbar',
    },
    isAuthenticated: {
      control: 'boolean',
      description: 'Whether user is authenticated',
    },
    isMobileMenuOpen: {
      control: 'boolean',
      description: 'Whether mobile menu is open',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Guest view - default state
export const Guest: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Default navbar view for non-authenticated users with sign in/sign up buttons.',
      },
    },
  },
};

// Authenticated user view
export const Authenticated: Story = {
  args: {
    isAuthenticated: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'Navbar view for authenticated users with profile menu and avatar.',
      },
    },
  },
  render: () => {
    // Override the store for this story
    const authenticatedStore = { ...mockStore, isAuthenticated: true };
    (require('../../src/components/Navbar/store').useNavbarStore as jest.Mock).mockImplementation((selector: any) => selector(authenticatedStore));
    return <Navbar />;
  },
};

// Premium user view
export const Premium: Story = {
  args: {
    isAuthenticated: true,
    isPremium: true,
    themeMode: 'premium',
  },
  parameters: {
    docs: {
      description: {
        story: 'Navbar view for premium users with gold badge and premium theme.',
      },
    },
  },
  render: () => {
    const premiumStore = { 
      ...mockStore, 
      isAuthenticated: true, 
      isPremium: true,
      userName: 'Premium User',
      themeMode: 'premium'
    };
    (require('../../src/components/Navbar/store').useNavbarStore as jest.Mock).mockImplementation((selector: any) => selector(premiumStore));
    return <Navbar />;
  },
};

// Mobile view
export const Mobile: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'iphone12',
    },
    docs: {
      description: {
        story: 'Mobile view with hamburger menu and responsive layout.',
      },
    },
  },
};

// Light theme
export const LightTheme: Story = {
  args: {
    themeMode: 'light',
  },
  parameters: {
    docs: {
      description: {
        story: 'Navbar with light theme using light-brown background.',
      },
    },
  },
  render: () => {
    const lightStore = { ...mockStore, themeMode: 'light' };
    (require('../../src/components/Navbar/store').useNavbarStore as jest.Mock).mockImplementation((selector: any) => selector(lightStore));
    return <Navbar />;
  },
};

// Dark theme (default)
export const DarkTheme: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Navbar with dark theme (default state).',
      },
    },
  },
};

// Mobile menu open
export const MobileMenuOpen: Story = {
  args: {
    isMobileMenuOpen: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone12',
    },
    docs: {
      description: {
        story: 'Mobile view with drawer menu open showing navigation links and options.',
      },
    },
  },
  render: () => {
    const mobileStore = { ...mockStore, isMobileMenuOpen: true };
    (require('../../src/components/Navbar/store').useNavbarStore as jest.Mock).mockImplementation((selector: any) => selector(mobileStore));
    return <Navbar />;
  },
};

// Help modal open
export const HelpModalOpen: Story = {
  args: {
    isHelpModalOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story: 'View with help modal open showing FAQ and contact options.',
      },
    },
  },
  render: () => {
    const helpStore = { ...mockStore, isHelpModalOpen: true };
    (require('../../src/components/Navbar/store').useNavbarStore as jest.Mock).mockImplementation((selector: any) => selector(helpStore));
    return <Navbar />;
  },
};

// Scrolled state
export const Scrolled: Story = {
  parameters: {
    docs: {
      description: {
        story: 'Navbar with scroll effects applied (backdrop blur).',
      },
    },
  },
  decorators: [
    (Story) => (
      <div style={{ height: '200vh' }}>
        <div style={{ height: '100px' }}></div>
        <Story />
        <div style={{ height: '100vh' }}></div>
      </div>
    ),
  ],
  play: async ({ canvasElement }) => {
    // Simulate scroll
    window.scrollTo(0, 100);
  },
};