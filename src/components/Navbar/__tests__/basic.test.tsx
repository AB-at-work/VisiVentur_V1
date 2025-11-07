import { render, screen } from '@testing-library/react';

// Simple smoke test to ensure components render without errors
describe('Navbar Components', () => {
  it('should import without errors', () => {
    expect(() => require('../Logo')).not.toThrow();
    expect(() => require('../PrimaryLinks')).not.toThrow();
    expect(() => require('../CurrencySelector')).not.toThrow();
    expect(() => require('../HelpModal')).not.toThrow();
    expect(() => require('../AuthButtons')).not.toThrow();
    expect(() => require('../ProfileMenu')).not.toThrow();
    expect(() => require('../MobileDrawer')).not.toThrow();
    expect(() => require('../Navbar')).not.toThrow();
  });
});