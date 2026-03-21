import { test, expect } from '@playwright/test';

test.describe('ims-video', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wgt/video/test.html');
    await page.waitForSelector('ims-video');
  });

  test('renders custom element', async ({ page }) => {
    let el = page.locator('ims-video');
    await expect(el).toBeVisible();
  });

  test('toolbar is visible', async ({ page }) => {
    let toolbar = page.locator('ims-video').locator('ims-video-toolbar');
    await expect(toolbar).toBeVisible();
  });

  test('setVolume() API', async ({ page }) => {
    await page.evaluate(() => {
      /** @type {any} */
      let el = document.querySelector('ims-video');
      el.setVolume(50);
    });
  });
});
