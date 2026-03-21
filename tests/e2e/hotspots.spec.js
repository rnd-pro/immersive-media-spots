import { test, expect } from '@playwright/test';

test.describe('ims-hotspots', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/wgt/hotspots/test.html');
    await page.waitForSelector('ims-hotspots');
  });

  test('renders hotspot spots', async ({ page }) => {
    await page.waitForTimeout(2000);
    let count = await page.evaluate(() => {
      return /** @type {any} */ (document.querySelector('ims-hotspots')).shadowRoot.querySelectorAll('.spot').length;
    });
    expect(count).toBe(3);
  });

  test('spots have correct labels', async ({ page }) => {
    await page.waitForTimeout(2000);
    let labels = await page.evaluate(() => {
      let spots = /** @type {any} */ (document.querySelector('ims-hotspots')).shadowRoot.querySelectorAll('.spot');
      return [...spots].map((el) => el.textContent);
    });
    expect(labels).toContain('View detail →');
    expect(labels).toContain('Buy now');
    expect(labels).toContain('More info');
  });

  test('spots have positioned styles', async ({ page }) => {
    await page.waitForTimeout(2000);
    let styles = await page.evaluate(() => {
      /** @type {any} */
      let spot = /** @type {any} */ (document.querySelector('ims-hotspots')).shadowRoot.querySelector('.spot');
      return { left: spot.style.left, top: spot.style.top };
    });
    expect(styles.left).toBeTruthy();
    expect(styles.top).toBeTruthy();
  });

  test('spot click triggers action on host via ^onHotspotClick', async ({ page }) => {
    await page.waitForTimeout(2000);
    let paused = await page.evaluate(() => {
      /** @type {any} */
      let spinner = document.querySelector('ims-spinner');
      spinner.play();
      let wasActive = spinner.hasAttribute('active');
      let spot = /** @type {any} */ (document.querySelector('ims-hotspots')).shadowRoot.querySelector('.spot[data-id="info"]');
      if (spot) /** @type {HTMLElement} */ (spot).click();
      let isActive = spinner.hasAttribute('active');
      return { wasActive, isActive };
    });
    expect(paused.wasActive).toBe(true);
    expect(paused.isActive).toBe(false);
  });
});
