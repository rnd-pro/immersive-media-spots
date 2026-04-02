import { test, expect } from '@playwright/test';

test.describe('fullscreen triggers onResize and variant reload', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('/wgt/spinner/test.html');
    await page.waitForSelector('ims-spinner');
  });

  test('onResize fires on multiple resize events', async ({ page }) => {
    let spinner = page.locator('ims-spinner');
    await expect(spinner).toBeVisible();
    await expect(spinner).toHaveAttribute('active', '', { timeout: 15000 });

    let result = await page.evaluate(() => {
      return new Promise((resolve) => {
        /** @type {any} */
        let el = document.querySelector('ims-spinner');
        let resizeCount = 0;
        let variants = [];
        let origOnResize = el.onResize.bind(el);
        el.onResize = () => {
          resizeCount++;
          origOnResize();
          variants.push(el.srcData.srcList[0]?.split('/').pop());
        };

        // Resize #1: make it much bigger
        el.style.maxWidth = '1920px';
        el.style.width = '1920px';

        setTimeout(() => {
          // Resize #2: make it smaller
          el.style.maxWidth = '400px';
          el.style.width = '400px';

          setTimeout(() => {
            // Resize #3: make it big again
            el.style.maxWidth = '1920px';
            el.style.width = '1920px';

            setTimeout(() => {
              resolve({ resizeCount, variants });
            }, 1000);
          }, 1000);
        }, 1000);
      });
    });

    expect(result.resizeCount).toBeGreaterThanOrEqual(3);
    expect(result.variants.length).toBeGreaterThanOrEqual(3);
  });

  test('image reload is triggered on every resize, not just the first', async ({ page }) => {
    let spinner = page.locator('ims-spinner');
    await expect(spinner).toBeVisible();
    await expect(spinner).toHaveAttribute('active', '', { timeout: 15000 });

    let result = await page.evaluate(() => {
      /** @type {any} */
      let el = document.querySelector('ims-spinner');

      // Track fillSrcVariantList calls and resulting first URL
      let fillCalls = [];
      let origFill = el.fillSrcVariantList.bind(el);
      el.fillSrcVariantList = () => {
        origFill();
        fillCalls.push(el.srcData.srcList[0]);
      };

      let mockBCR = (w, h) => ({
        x: 0, y: 0, width: w, height: h,
        top: 0, left: 0, right: w, bottom: h,
        toJSON: () => {},
      });

      // Resize 1: fullscreen-like
      el.getBoundingClientRect = () => mockBCR(1920, 1080);
      if (el.canvas) el.canvas.getBoundingClientRect = () => mockBCR(1920, 1080);
      el.onResize();
      let afterResize1 = el.srcData.srcList[0];

      // Resize 2: back to small
      el.getBoundingClientRect = () => mockBCR(400, 300);
      if (el.canvas) el.canvas.getBoundingClientRect = () => mockBCR(400, 300);
      el.onResize();
      let afterResize2 = el.srcData.srcList[0];

      // Resize 3: fullscreen again
      el.getBoundingClientRect = () => mockBCR(1920, 1080);
      if (el.canvas) el.canvas.getBoundingClientRect = () => mockBCR(1920, 1080);
      el.onResize();
      let afterResize3 = el.srcData.srcList[0];

      return {
        fillCallCount: fillCalls.length,
        afterResize1,
        afterResize2,
        afterResize3,
        resize1to2Changed: afterResize1 !== afterResize2,
        resize2to3Changed: afterResize2 !== afterResize3,
      };
    });

    // fillSrcVariantList should be called on each resize
    // (once from super.onResize(), possibly again from #loadContents)
    expect(result.fillCallCount).toBeGreaterThanOrEqual(3);
    // URLs should change with each size change
    expect(result.resize1to2Changed).toBe(true);
    expect(result.resize2to3Changed).toBe(true);
  });

  test('fillSrcVariantList recalculates URLs on resize', async ({ page }) => {
    let spinner = page.locator('ims-spinner');
    await expect(spinner).toBeVisible();
    await expect(spinner).toHaveAttribute('active', '', { timeout: 15000 });

    let result = await page.evaluate(() => {
      /** @type {any} */
      let el = document.querySelector('ims-spinner');
      let srcData = el.srcData;

      // Record original URLs
      let originalUrls = [...srcData.srcList];
      let originalVariant = originalUrls[0]?.split('/').pop();

      // Simulate going to a much larger size (like fullscreen)
      let origGetBCR = el.getBoundingClientRect.bind(el);
      let mockBCR = (w, h) => ({
        x: 0, y: 0,
        width: w, height: h,
        top: 0, left: 0, right: w, bottom: h,
        toJSON: () => {},
      });

      el.getBoundingClientRect = () => mockBCR(1920, 1080);
      if (el.canvas) {
        el.canvas.getBoundingClientRect = () => mockBCR(1920, 1080);
      }

      // --- Resize #1: to fullscreen-like dimensions ---
      el.onResize();
      let afterResize1 = [...srcData.srcList];
      let variant1 = afterResize1[0]?.split('/').pop();

      // --- Resize #2: back to original size ---
      el.getBoundingClientRect = () => mockBCR(860, 570);
      if (el.canvas) {
        el.canvas.getBoundingClientRect = () => mockBCR(860, 570);
      }
      el.onResize();
      let afterResize2 = [...srcData.srcList];
      let variant2 = afterResize2[0]?.split('/').pop();

      // --- Resize #3: fullscreen again ---
      el.getBoundingClientRect = () => mockBCR(1920, 1080);
      if (el.canvas) {
        el.canvas.getBoundingClientRect = () => mockBCR(1920, 1080);
      }
      el.onResize();
      let afterResize3 = [...srcData.srcList];
      let variant3 = afterResize3[0]?.split('/').pop();

      // Restore
      el.getBoundingClientRect = origGetBCR;

      return {
        originalVariant,
        variant1,
        variant2,
        variant3,
        resize1Changed: originalUrls[0] !== afterResize1[0],
        resize2Changed: afterResize1[0] !== afterResize2[0],
        resize3Changed: afterResize2[0] !== afterResize3[0],
      };
    });

    // Resize #1: original (~860px) → fullscreen (1920px) → bigger variant
    expect(result.resize1Changed).toBe(true);
    expect(Number(result.variant1)).toBeGreaterThan(Number(result.originalVariant));

    // Resize #2: fullscreen (1920px) → back to original (860px) → smaller variant
    expect(result.resize2Changed).toBe(true);
    expect(Number(result.variant2)).toBeLessThan(Number(result.variant1));

    // Resize #3: original (860px) → fullscreen (1920px) again → bigger variant again
    expect(result.resize3Changed).toBe(true);
    expect(Number(result.variant3)).toBeGreaterThan(Number(result.variant2));
  });

  test('onResize fires on both fullscreen enter and exit', async ({ page }) => {
    let spinner = page.locator('ims-spinner');
    await expect(spinner).toBeVisible();
    await expect(spinner).toHaveAttribute('active', '', { timeout: 15000 });

    let result = await page.evaluate(() => {
      return new Promise((resolve) => {
        /** @type {any} */
        let el = document.querySelector('ims-spinner');
        let resizeCalls = [];
        let origOnResize = el.onResize.bind(el);
        el.onResize = () => {
          let variant = el.srcData.srcList?.[0]?.split('/').pop() || 'none';
          let entry = {
            variant,
            time: Date.now(),
            variantAfter: '',
          };
          resizeCalls.push(entry);
          origOnResize();
          entry.variantAfter = el.srcData.srcList?.[0]?.split('/').pop() || 'none';
        };

        // Toggle fullscreen ON
        el.$.onFs();

        setTimeout(() => {
          // Toggle fullscreen OFF
          el.$.onFs();

          setTimeout(() => {
            resolve({
              callCount: resizeCalls.length,
              calls: resizeCalls,
            });
          }, 2000);
        }, 2000);
      });
    });

    // Should have at least 2 resize calls: one for entering, one for exiting
    expect(result.callCount).toBeGreaterThanOrEqual(2);
  });
});
