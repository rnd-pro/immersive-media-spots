import { test, expect } from '@playwright/test';

test.describe('ims-map', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wgt/map/test.html');
    await page.waitForSelector('ims-map');
  });

  test('renders custom element', async ({ page }) => {
    let el = page.locator('ims-map');
    await expect(el).toBeVisible();
  });

  test('has map container', async ({ page }) => {
    let container = page.locator('ims-map [ref="mapContainer"]');
    await expect(container).toBeVisible();
  });

  test('toolbar is visible', async ({ page }) => {
    let toolbar = page.locator('ims-map ims-map-toolbar');
    await expect(toolbar).toBeVisible();
  });
});
