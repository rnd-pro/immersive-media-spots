import { test, expect } from '@playwright/test';

test.describe('ims-story', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wgt/story/test.html');
    await page.waitForSelector('ims-story');
  });

  test('renders custom element', async ({ page }) => {
    let el = page.locator('ims-story');
    await expect(el).toBeVisible();
  });
});
