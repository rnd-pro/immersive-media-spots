import { test, expect } from '@playwright/test';

test.describe('ims-viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wgt/viewer/test.html');
    await page.waitForSelector('ims-viewer');
  });

  test('renders viewer element', async ({ page }) => {
    let count = await page.locator('ims-viewer').count();
    expect(count).toBe(1);
  });

  test('dynamically creates child widget', async ({ page }) => {
    let viewer = page.locator('ims-viewer').first();
    let child = viewer.locator('ims-spinner');
    await expect(child).toBeVisible({ timeout: 10000 });
  });

  test('child widget has src-data attribute', async ({ page }) => {
    let child = page.locator('ims-viewer').first().locator('ims-spinner');
    await expect(child).toBeVisible({ timeout: 10000 });
    let srcData = await child.getAttribute('src-data');
    expect(srcData).toBeTruthy();
    expect(srcData).toContain('blob:');
  });

  test('back button appears after hotspot navigation and returns to previous', async ({ page }) => {
    let viewer = page.locator('ims-viewer').first();
    await expect(viewer.locator('ims-spinner')).toBeVisible({ timeout: 10000 });

    let originalSrc = await page.evaluate(() => {
      /** @type {any} */
      let v = document.querySelector('ims-viewer');
      let origSrc = v.$.srcData;
      v.$.onHotspotNavigate({ targetSrcData: '../gallery/test-data.json' });
      return origSrc;
    });
    expect(originalSrc).toBeTruthy();

    let toolbar = viewer.locator('ims-viewer-toolbar');
    let backBtn = toolbar.locator('ims-button');
    await expect(backBtn).toBeVisible({ timeout: 5000 });

    await backBtn.click();
    await expect(toolbar).toHaveAttribute('hidden', '', { timeout: 5000 });
  });

  test('fullscreen applies to viewer, not inner widget', async ({ page }) => {
    let viewer = page.locator('ims-viewer').first();
    await expect(viewer.locator('ims-spinner')).toBeVisible({ timeout: 10000 });

    await page.evaluate(() => {
      /** @type {any} */
      let spinner = document.querySelector('ims-viewer ims-spinner');
      spinner.$.onFs();
    });

    await expect(viewer).toHaveAttribute('fullscreen', '');
    let spinner = viewer.locator('ims-spinner');
    await expect(spinner).not.toHaveAttribute('fullscreen');

    await page.evaluate(() => {
      /** @type {any} */
      let spinner = document.querySelector('ims-viewer ims-spinner');
      spinner.$.onFs();
    });
    await expect(viewer).not.toHaveAttribute('fullscreen');
  });
});

test.describe('ims-viewer feed', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wgt/viewer/test-feed.html');
    await page.waitForSelector('ims-viewer');
  });

  test('renders multiple viewer elements', async ({ page }) => {
    let count = await page.locator('ims-viewer').count();
    expect(count).toBeGreaterThanOrEqual(6);
  });

  test('dynamically creates child widget for diff', async ({ page }) => {
    let viewer = page.locator('ims-viewer').first();
    await expect(viewer).toBeVisible();
    let child = viewer.locator('ims-diff');
    await expect(child).toBeVisible({ timeout: 10000 });
  });

  test('dynamically creates child widget for spinner', async ({ page }) => {
    let viewer = page.locator('ims-viewer').nth(1);
    let child = viewer.locator('ims-spinner');
    await expect(child).toBeVisible({ timeout: 10000 });
  });

  test('dynamically creates child widget for gallery', async ({ page }) => {
    let viewer = page.locator('ims-viewer').nth(2);
    let child = viewer.locator('ims-gallery');
    await expect(child).toBeVisible({ timeout: 10000 });
  });

  test('forwards attributes via cast-next', async ({ page }) => {
    let spinner = page.locator('ims-viewer').nth(1).locator('ims-spinner');
    await expect(spinner).toBeVisible({ timeout: 10000 });
    let autoplay = await spinner.getAttribute('autoplay');
    expect(autoplay).toBe('true');
  });
});
