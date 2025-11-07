import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CurrencySelector from '../CurrencySelector';

// Mock the store
const mockStore = {
  currency: 'USD' as const,
  setCurrency: jest.fn(),
};

jest.mock('../store', () => ({
  useNavbarStore: jest.fn((selector) => selector(mockStore)),
}));

describe('CurrencySelector', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders current currency selection', () => {
    render(<CurrencySelector />);
    
    expect(screen.getByLabelText(/Currency:/)).toBeInTheDocument();
    expect(screen.getByText('USD')).toBeInTheDocument();
  });

  it('opens dropdown when clicked', async () => {
    const user = userEvent.setup();
    render(<CurrencySelector />);
    
    const button = screen.getByLabelText(/Currency:/);
    await user.click(button);
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByText('INR')).toBeInTheDocument();
    expect(screen.getByText('EUR')).toBeInTheDocument();
    expect(screen.getByText('GBP')).toBeInTheDocument();
  });

  it('selects new currency when option is clicked', async () => {
    const user = userEvent.setup();
    render(<CurrencySelector />);
    
    const button = screen.getByLabelText(/Currency:/);
    await user.click(button);
    
    const inrOption = screen.getByText('INR');
    await user.click(inrOption);
    
    expect(mockStore.setCurrency).toHaveBeenCalledWith('INR');
  });

  it('highlights selected currency in dropdown', async () => {
    const user = userEvent.setup();
    render(<CurrencySelector />);
    
    const button = screen.getByLabelText(/Currency:/);
    await user.click(button);
    
    const usdOption = screen.getByText('USD');
    expect(usdOption.closest('[aria-selected="true"]')).toBeInTheDocument();
  });

  it('closes dropdown when clicking outside', async () => {
    const user = userEvent.setup();
    render(<CurrencySelector />);
    
    const button = screen.getByLabelText(/Currency:/);
    await user.click(button);
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    // Click outside
    await user.click(document.body);
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('closes dropdown with Escape key', async () => {
    const user = userEvent.setup();
    render(<CurrencySelector />);
    
    const button = screen.getByLabelText(/Currency:/);
    await user.click(button);
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    
    await user.keyboard('{Escape}');
    
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
  });

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup();
    render(<CurrencySelector />);
    
    const button = screen.getByLabelText(/Currency:/);
    button.focus();
    await user.keyboard('{Enter}');
    
    expect(screen.getByRole('listbox')).toBeInTheDocument();
  });
});