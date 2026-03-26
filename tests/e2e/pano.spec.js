import { test, expect } from '@playwright/test';

test.describe('ims-pano', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wgt/pano/test.html');
    await page.waitForSelector('ims-pano');
  });

  test('renders custom element', async ({ page }) => {
    let el = page.locator('ims-pano');
    await expect(el).toBeVisible();
  });

  test('has canvas (WebGL)', async ({ page }) => {
    let canvas = page.locator('ims-pano').locator('canvas');
    await expect(canvas).toBeVisible();
  });

  test('toolbar is visible', async ({ page }) => {
    let toolbar = page.locator('ims-pano').locator('ims-pano-toolbar');
    await expect(toolbar).toBeVisible();
  });

  test('hotspotState returns { yaw, pitch }', async ({ page }) => {
    await page.waitForTimeout(2000);
    let state = await page.evaluate(() => {
      /** @type {any} */
      let el = document.querySelector('ims-pano');
      el.lookAt(90, 15);
      return el.hotspotState;
    });
    expect(state).toHaveProperty('yaw', 90);
    expect(state).toHaveProperty('pitch', 15);
  });
});
