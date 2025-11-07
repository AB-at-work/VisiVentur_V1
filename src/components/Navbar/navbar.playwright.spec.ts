import { expect, test } from "@playwright/test";

test.describe("VisiVentur global navbar", () => {
  test("opens the mobile drawer and returns focus to the trigger", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });

    await page.goto("/");

    const drawerTrigger = page.getByRole("button", {
      name: /toggle navigation menu/i,
    });

    await drawerTrigger.click();

    await expect(
      page.getByRole("heading", { name: /navigation/i }),
    ).toBeVisible();

    await page.keyboard.press("Escape");

    await expect(drawerTrigger).toBeFocused();
  });

  test("allows guests to reach the sign-in page", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    await page.getByRole("link", { name: /sign in/i }).click();

    await expect(page).toHaveURL(/auth\/sign-in/);
  });

  test("shows help modal content with keyboard focus", async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto("/");

    const helpButton = page.getByRole("button", { name: /^help$/i });
    await helpButton.press("Enter");

    const dialog = page.getByRole("dialog", { name: /how can we help/i });
    await expect(dialog).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(helpButton).toBeFocused();
  });
});
