import { test, expect } from '@playwright/test';

test.describe('ims-gallery', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wgt/gallery/test.html');
    await page.waitForSelector('ims-gallery');
  });

  test('renders custom element', async ({ page }) => {
    let el = page.locator('ims-gallery');
    await expect(el).toBeVisible();
  });

  test('has canvas with dimensions', async ({ page }) => {
    let canvas = page.locator('ims-gallery').locator('canvas');
    await expect(canvas).toBeVisible();
    let box = await canvas.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });

  test('toolbar is visible', async ({ page }) => {
    let toolbar = page.locator('ims-gallery').locator('ims-gallery-toolbar');
    await expect(toolbar).toBeVisible();
  });

  test('next() / prev() API', async ({ page }) => {
    await page.evaluate(() => {
      /** @type {any} */
      let el = document.querySelector('ims-gallery');
      el.next();
      el.prev();
    });
  });

  test('goTo() API', async ({ page }) => {
    await page.evaluate(() => {
      /** @type {any} */
      let el = document.querySelector('ims-gallery');
      el.goTo(0);
    });
  });
});
