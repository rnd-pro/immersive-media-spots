import { test, expect } from '@playwright/test';

test.describe('ims-spinner', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wgt/spinner/test.html');
    await page.waitForSelector('ims-spinner');
  });

  test('renders custom element', async ({ page }) => {
    let el = page.locator('ims-spinner');
    await expect(el).toBeVisible();
  });

  test('has canvas with dimensions', async ({ page }) => {
    let canvas = page.locator('ims-spinner').locator('canvas');
    await expect(canvas).toBeVisible();
    let box = await canvas.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
  });

  test('toolbar is visible', async ({ page }) => {
    let toolbar = page.locator('ims-spinner').locator('ims-spinner-toolbar');
    await expect(toolbar).toBeVisible();
  });

  test('play() and pause() API', async ({ page }) => {
    let hasActive = await page.evaluate(() => {
      /** @type {any} */
      let el = document.querySelector('ims-spinner');
      el.play();
      let active = el.hasAttribute('active');
      el.pause();
      return active;
    });
    expect(hasActive).toBe(true);
  });

  test('goToFrame() API', async ({ page }) => {
    let frame = await page.evaluate(() => {
      /** @type {any} */
      let el = document.querySelector('ims-spinner');
      el.goToFrame(5);
      return el.currentFrame;
    });
    expect(frame).toBe(5);
  });
});
