import { createErrorPlaceholder } from './createErrorPlaceholder.js';

// TODO: startFrame support
export class ImageReader {

  /** @type {HTMLImageElement[]} */
  #cache = [];

  /**
   *
   * @param {HTMLImageElement[]} resultArr
   * @param {String[]} imgSrcArr
   * @param {(progress: number) => void} progressHandler
   */
  read(resultArr, imgSrcArr, progressHandler) {
    const frameRange = imgSrcArr.length;
    resultArr.length = frameRange;
    const progressStep = 100 / frameRange;
    let progressTotal = 0;
    let loadedCount = 0;

    imgSrcArr.forEach((url, idx) => {
      let img = resultArr[idx] || new Image();
      if (!resultArr[idx]) {
        this.#cache.push(img);
        resultArr[idx] = img;
      }
      img.onload = () => {
        loadedCount++;
        progressTotal = Math.min(100, progressTotal + progressStep);
        progressHandler?.(Math.round(progressTotal));
      };
      img.onerror = () => {
        console.error(`[IMS ImageReader] Failed to load image: ${url}`);
        resultArr[idx] = createErrorPlaceholder(idx);
        loadedCount++;
        progressTotal = Math.min(100, progressTotal + progressStep);
        progressHandler?.(Math.round(progressTotal));
      };
      if (img.src !== url) {
        img.src = url;
      }
    });
  }

  clear() {
    if (this.#cache.length) {
      this.#cache.forEach((img) => {
        img.onload = null;
        img.onerror = null;
        img.src = '';
      });
      this.#cache = [];
    }
  }
}
