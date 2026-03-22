import { test, expect } from '@playwright/test';

test.describe('ims-viewer', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wgt/viewer/test.html');
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

  test('child widget has src-data attribute', async ({ page }) => {
    let child = page.locator('ims-viewer').first().locator('ims-diff');
    await expect(child).toBeVisible({ timeout: 10000 });
    let srcData = await child.getAttribute('src-data');
    expect(srcData).toBeTruthy();
    expect(srcData).toContain('blob:');
  });

  test('back button appears after hotspot navigation and returns to previous', async ({ page }) => {
    let viewer = page.locator('ims-viewer').last();
    await expect(viewer.locator('ims-spinner')).toBeVisible({ timeout: 10000 });

    let originalSrc = await page.evaluate(() => {
      /** @type {any} */
      let v = document.querySelectorAll('ims-viewer')[6];
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
});
