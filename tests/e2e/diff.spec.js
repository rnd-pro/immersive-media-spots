import { test, expect } from '@playwright/test';

test.describe('ims-diff', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wgt/diff/test.html');
    await page.waitForSelector('ims-diff');
  });

  test('renders custom element', async ({ page }) => {
    let el = page.locator('ims-diff');
    await expect(el).toBeVisible();
  });

  test('has canvas with dimensions', async ({ page }) => {
    let canvas = page.locator('ims-diff').locator('canvas');
    await expect(canvas).toBeVisible();
    let box = await canvas.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });

  test('slider element is present', async ({ page }) => {
    let slider = page.locator('ims-diff').locator('div[slider]');
    await expect(slider).toBeAttached();
  });

  test('toolbar is visible', async ({ page }) => {
    let toolbar = page.locator('ims-diff').locator('ims-diff-toolbar');
    await expect(toolbar).toBeVisible();
  });

  test('setShare() API', async ({ page }) => {
    await page.evaluate(() => {
      /** @type {any} */
      let el = document.querySelector('ims-diff');
      el.setShare(75);
    });
  });

  test('toggleMode() API', async ({ page }) => {
    let mode = await page.evaluate(() => {
      /** @type {any} */
      let el = document.querySelector('ims-diff');
      el.toggleMode();
      return el.$['mode'];
    });
    expect(mode).toBe('onion');
  });
});
