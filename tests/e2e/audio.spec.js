import { test, expect } from '@playwright/test';

test.describe('ims-audio', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wgt/audio/test.html');
    await page.waitForSelector('ims-audio');
  });

  test('renders custom element', async ({ page }) => {
    let el = page.locator('ims-audio');
    await expect(el).toBeVisible();
  });

  test('toolbar is visible', async ({ page }) => {
    let toolbar = page.locator('ims-audio').locator('ims-audio-toolbar');
    await expect(toolbar).toBeVisible();
  });

  test('setVolume() API', async ({ page }) => {
    await page.evaluate(() => {
      /** @type {any} */
      let el = document.querySelector('ims-audio');
      el.setVolume(50);
    });
  });
});
