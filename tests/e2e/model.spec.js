import { test, expect } from '@playwright/test';

test.describe('ims-model', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wgt/model/test.html');
    await page.waitForSelector('ims-model');
  });

  test('renders custom element', async ({ page }) => {
    let el = page.locator('ims-model');
    await expect(el).toBeVisible();
  });

  test('has canvas (WebGL)', async ({ page }) => {
    let canvas = page.locator('ims-model').locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('toolbar is visible', async ({ page }) => {
    let toolbar = page.locator('ims-model').locator('ims-model-toolbar');
    await expect(toolbar).toBeVisible();
  });
});
