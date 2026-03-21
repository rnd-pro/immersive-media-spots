import { test, expect } from '@playwright/test';

test.describe('ims-viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wgt/viewer/test.html');
    await page.waitForSelector('ims-viewer');
  });

  test('renders custom elements', async ({ page }) => {
    let el = page.locator('ims-viewer').first();
    await expect(el).toBeVisible();
  });

  test('has multiple viewers', async ({ page }) => {
    let count = await page.locator('ims-viewer').count();
    expect(count).toBeGreaterThan(0);
  });
});
