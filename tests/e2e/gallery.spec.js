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

  test('nav buttons are enabled when loop is true', async ({ page }) => {
    await page.waitForTimeout(2000);
    await page.evaluate(() => {
      /** @type {any} */
      let el = document.querySelector('ims-gallery');
      el.srcData.loop = true;
      el.goTo(1);
      el.goTo(0);
    });
    await page.waitForTimeout(500);
    let prevBtn = page.locator('ims-gallery ims-gallery-toolbar ims-button').first();
    let nextBtn = page.locator('ims-gallery ims-gallery-toolbar ims-button').nth(1);
    await expect(prevBtn).not.toHaveAttribute('disabled');
    await expect(nextBtn).not.toHaveAttribute('disabled');
  });

  test('prev disabled at start, next disabled at end when loop is false', async ({ page }) => {
    await page.waitForTimeout(2000);
    await page.evaluate(() => {
      /** @type {any} */
      let el = document.querySelector('ims-gallery');
      el.srcData.loop = false;
      el.goTo(0);
    });
    await page.waitForTimeout(200);
    let prevBtn = page.locator('ims-gallery ims-gallery-toolbar ims-button').first();
    let nextBtn = page.locator('ims-gallery ims-gallery-toolbar ims-button').nth(1);
    await expect(prevBtn).toHaveAttribute('disabled');
    await expect(nextBtn).not.toHaveAttribute('disabled');

    // Go to last image
    await page.evaluate(() => {
      /** @type {any} */
      let el = document.querySelector('ims-gallery');
      el.goTo(el.$.total - 1);
    });
    await page.waitForTimeout(200);
    await expect(prevBtn).not.toHaveAttribute('disabled');
    await expect(nextBtn).toHaveAttribute('disabled');
  });
});
