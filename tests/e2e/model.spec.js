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

  test('hotspotState returns { rotationX, rotationY }', async ({ page }) => {
    // Wait for model to finish loading
    await page.locator('ims-model[active]').waitFor({ timeout: 10000 }).catch(() => {});
    let state = await page.evaluate(() => {
      /** @type {any} */
      let el = document.querySelector('ims-model');
      el.setRotation(0.5, 1.2);
      return el.hotspotState;
    });
    expect(state).toHaveProperty('rotationX');
    expect(state).toHaveProperty('rotationY');
    expect(typeof state.rotationX).toBe('number');
    expect(typeof state.rotationY).toBe('number');
  });
});
