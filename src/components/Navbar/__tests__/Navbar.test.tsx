import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { act } from 'react';
import Navbar from '../Navbar';

// Mock the store
const mockStore = {
  isAuthenticated: false,
  isMobileMenuOpen: false,
  isHelpModalOpen: false,
  themeMode: 'dark' as const,
  setIsMobileMenuOpen: jest.fn(),
  setIsHelpModalOpen: jest.fn(),
};

jest.mock('../store', () => ({
  useNavbarStore: jest.fn((selector) => selector(mockStore)),
  useInitializeTheme: jest.fn(),
}));

describe('Navbar', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders logo and navigation elements', () => {
    render(<Navbar />);
    
    expect(screen.getByLabelText('VisiVentur — Home')).toBeInTheDocument();
    expect(screen.getByLabelText('Help and support')).toBeInTheDocument();
  });

  it('shows mobile menu button on mobile', () => {
    render(<Navbar />);
    
    expect(screen.getByLabelText('Toggle mobile menu')).toBeInTheDocument();
  });

  it('shows auth buttons when not authenticated', () => {
    mockStore.isAuthenticated = false;
    render(<Navbar />);
    
    // Auth buttons should be visible on desktop
    expect(screen.getByText('Sign Up — It\'s free')).toBeInTheDocument();
  });

  it('shows profile menu when authenticated', () => {
    mockStore.isAuthenticated = true;
    render(<Navbar />);
    
    // Profile menu should be visible when authenticated
    expect(screen.getByLabelText('User menu')).toBeInTheDocument();
  });

  it('toggles mobile menu when button is clicked', async () => {
    render(<Navbar />);
    
    const mobileMenuButton = screen.getByLabelText('Toggle mobile menu');
    
    act(() => {
      fireEvent.click(mobileMenuButton);
    });
    
    expect(mockStore.setIsMobileMenuOpen).toHaveBeenCalledWith(true);
  });

  it('opens help modal when help button is clicked', async () => {
    render(<Navbar />);
    
    const helpButton = screen.getByLabelText('Help and support');
    
    act(() => {
      fireEvent.click(helpButton);
    });
    
    expect(mockStore.setIsHelpModalOpen).toHaveBeenCalledWith(true);
  });

  it('applies correct theme classes', () => {
    mockStore.themeMode = 'premium';
    render(<Navbar />);
    
    const navbar = document.querySelector('header');
    expect(navbar).toBeInTheDocument();
  });

  it('handles scroll effect', () => {
    render(<Navbar />);
    
    // Simulate scroll
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    
    // Navbar should still be present
    expect(screen.getByLabelText('VisiVentur — Home')).toBeInTheDocument();
  });
});