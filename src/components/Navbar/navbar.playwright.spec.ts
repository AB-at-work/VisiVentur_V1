import { test, expect } from '@playwright/test';

test.describe('Navbar Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders navbar with all elements', async ({ page }) => {
    // Check logo
    await expect(page.getByLabel('VisiVentur — Home')).toBeVisible();
    
    // Check help button
    await expect(page.getByLabel('Help and support')).toBeVisible();
    
    // Check mobile menu button (visible on mobile viewport)
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.getByLabel('Toggle mobile menu')).toBeVisible();
  });

  test('mobile menu functionality', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open mobile menu
    await page.getByLabel('Toggle mobile menu').click();
    
    // Check drawer opens
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
    await expect(page.getByText('Navigation')).toBeVisible();
    await expect(page.getByText('Pricing')).toBeVisible();
    await expect(page.getByText('Destinations')).toBeVisible();
    await expect(page.getByText('Explore')).toBeVisible();
    
    // Check currency selector in mobile menu
    await expect(page.getByText('Currency')).toBeVisible();
    
    // Check auth buttons in mobile menu
    await expect(page.getByText('Sign In')).toBeVisible();
    await expect(page.getByText('Sign Up — It\'s free')).toBeVisible();
    
    // Test navigation link
    await page.getByText('Pricing').click();
    await expect(page).toHaveURL('/pricing');
    
    // Menu should close after navigation
    await expect(page.getByRole('dialog', { name: 'Menu' })).not.toBeVisible();
  });

  test('currency selector functionality', async ({ page }) => {
    // Find currency selector
    const currencyButton = page.getByLabel(/Currency:/);
    await expect(currencyButton).toBeVisible();
    
    // Open dropdown
    await currencyButton.click();
    
    // Check all currency options are visible
    await expect(page.getByRole('listbox')).toBeVisible();
    await expect(page.getByText('INR')).toBeVisible();
    await expect(page.getByText('USD')).toBeVisible();
    await expect(page.getByText('EUR')).toBeVisible();
    await expect(page.getByText('GBP')).toBeVisible();
    
    // Select INR
    await page.getByText('INR').click();
    
    // Check currency changed (symbol should be visible)
    await expect(currencyButton).toContainText('₹');
    
    // Dropdown should close
    await expect(page.getByRole('listbox')).not.toBeVisible();
  });

  test('help modal functionality', async ({ page }) => {
    // Open help modal
    await page.getByLabel('Help and support').click();
    
    // Check modal opens
    await expect(page.getByRole('dialog', { name: 'Help & Support' })).toBeVisible();
    await expect(page.getByText('Frequently Asked Questions')).toBeVisible();
    
    // Check FAQ items
    await expect(page.getByText('How do I change my currency?')).toBeVisible();
    await expect(page.getByText('What payment methods are supported?')).toBeVisible();
    
    // Check contact options
    await expect(page.getByText('Email Support')).toBeVisible();
    await expect(page.getByText('Twitter')).toBeVisible();
    await expect(page.getByText('Chat with AI')).toBeVisible();
    
    // Test close button
    await page.getByLabel('Close help modal').click();
    await expect(page.getByRole('dialog', { name: 'Help & Support' })).not.toBeVisible();
  });

  test('keyboard navigation', async ({ page }) => {
    // Test Tab navigation through navbar elements
    await page.keyboard.press('Tab');
    
    // Should focus on logo first
    await expect(page.getByLabel('VisiVentur — Home')).toBeFocused();
    
    // Continue tabbing through elements
    await page.keyboard.press('Tab');
    
    // Should reach help button (skip mobile menu on desktop)
    await expect(page.getByLabel('Help and support')).toBeFocused();
    
    // Test currency selector keyboard interaction
    const currencyButton = page.getByLabel(/Currency:/);
    await page.keyboard.press('Tab');
    await expect(currencyButton).toBeFocused();
    
    // Open with Enter
    await page.keyboard.press('Enter');
    await expect(page.getByRole('listbox')).toBeVisible();
    
    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(page.getByRole('listbox')).not.toBeVisible();
  });

  test('focus trap in mobile drawer', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Open mobile menu
    await page.getByLabel('Toggle mobile menu').click();
    await expect(page.getByRole('dialog', { name: 'Menu' })).toBeVisible();
    
    // Focus close button
    await page.getByLabel('Close mobile menu').focus();
    await expect(page.getByLabel('Close mobile menu')).toBeFocused();
    
    // Test focus trap with Tab key
    await page.keyboard.press('Tab');
    
    // Focus should stay within the drawer
    const focusedElement = await page.evaluate(() => document.activeElement?.tagName);
    expect(['BUTTON', 'A']).toContain(focusedElement);
    
    // Close with Escape
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog', { name: 'Menu' })).not.toBeVisible();
  });

  test('responsive behavior', async ({ page }) => {
    // Test desktop viewport
    await page.setViewportSize({ width: 1200, height: 800 });
    
    // Primary links should be visible
    await expect(page.getByText('Pricing')).toBeVisible();
    await expect(page.getByText('Destinations')).toBeVisible();
    await expect(page.getByText('Explore')).toBeVisible();
    
    // Mobile menu button should not be visible
    await expect(page.getByLabel('Toggle mobile menu')).not.toBeVisible();
    
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Primary links should not be visible
    await expect(page.getByText('Pricing')).not.toBeVisible();
    
    // Mobile menu button should be visible
    await expect(page.getByLabel('Toggle mobile menu')).toBeVisible();
  });

  test('accessibility attributes', async ({ page }) => {
    // Check ARIA attributes on currency selector
    const currencyButton = page.getByLabel(/Currency:/);
    await expect(currencyButton).toHaveAttribute('aria-haspopup', 'listbox');
    
    await currencyButton.click();
    await expect(page.getByRole('listbox')).toBeVisible();
    
    // Check options have correct attributes
    const options = await page.getByRole('option').all();
    expect(options.length).toBe(4);
    
    for (const option of options) {
      await expect(option).toHaveAttribute('role', 'option');
    }
    
    // Check mobile menu accessibility
    await page.setViewportSize({ width: 375, height: 667 });
    await page.getByLabel('Toggle mobile menu').click();
    
    const mobileMenu = page.getByRole('dialog', { name: 'Menu' });
    await expect(mobileMenu).toHaveAttribute('aria-modal', 'true');
  });
});