import { test, expect } from '@playwright/test';

test.describe('ims-hotspots', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wgt/hotspots/test.html');
    await page.waitForSelector('ims-hotspots');
  });

  test('renders hotspot spots', async ({ page }) => {
    await page.waitForTimeout(2000);
    let spots = page.locator('ims-hotspots .spot');
    let count = await spots.count();
    expect(count).toBe(3);
  });

  test('spots have correct labels', async ({ page }) => {
    await page.waitForTimeout(2000);
    let labels = await page.locator('ims-hotspots .spot').allTextContents();
    expect(labels).toContain('View detail →');
    expect(labels).toContain('Buy now');
    expect(labels).toContain('More info');
  });

  test('spots have positioned styles', async ({ page }) => {
    await page.waitForTimeout(2000);
    let spot = page.locator('ims-hotspots .spot').first();
    let left = await spot.evaluate((el) => el.style.left);
    let top = await spot.evaluate((el) => el.style.top);
    expect(left).toBeTruthy();
    expect(top).toBeTruthy();
  });

  test('dispatches ims-hotspot-click on click', async ({ page }) => {
    await page.waitForTimeout(2000);
    let received = await page.evaluate(() => {
      return new Promise((resolve) => {
        document.addEventListener('ims-hotspot-click', (e) => {
          resolve(/** @type {CustomEvent} */ (e).detail);
        });
        /** @type {HTMLElement} */
        let spot = document.querySelector('ims-hotspots .spot[data-id="info"]');
        if (spot) spot.click();
      });
    });
    expect(received).toBeTruthy();
    expect(received.id).toBe('info');
  });
});
