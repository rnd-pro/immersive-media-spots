import dataCtx from './globalDataCtx.js';

export class ResizeController {

  static #map = new Map();
  static #timeout;

  static #onResize() {
    if (this.#timeout) {
      window.clearTimeout(this.#timeout);
    }
    this.#timeout = window.setTimeout(() => {
      [...this.#map.values()].forEach((cb) => {
        cb?.();
      });
    }, 400);
  }

  /** @type {ResizeObserver} */
  static #observer = new ResizeObserver(this.#onResize.bind(this));

  static add(target, callback) {
    if (!this.#map.has(target)) {
      this.#observer.observe(target);
      this.#map.set(target, callback);
    }
  }

  static remove(target) {
    this.#observer.unobserve(target);
    this.#map.delete(target);
  }

  static initFsResize() {
    dataCtx.sub('fullscreen', (val) => {
      this.#onResize();
    });
    window.addEventListener('orientationchange', this.#onResize.bind(this));
    window.addEventListener('resize', this.#onResize.bind(this));
  }

}

ResizeController.initFsResize();