import Symbiote from '@symbiotejs/symbiote';
import { kebabToCamel, UID } from '@symbiotejs/symbiote/utils';
import { ResizeController } from './ResizeController.js';
import { FullscreenMgr } from './FullscreenMgr.js';
import { loadSourceData } from './loadSourceData.js';
import { getVariantFit } from './getVariantFit.js';
import { validateConfig } from './validateConfig.js';
import { ImsPreloader } from './ims-preloader.js';

/**
 * @typedef {Partial<import('../wgt/diff/ImsDiffData.js').ImsDiffData 
 * & import('../wgt/gallery/ImsGalleryData.js').ImsGalleryData 
 * & import('../wgt/pano/ImsPanoData.js').ImsPanoData 
 * & import('../wgt/spinner/ImsSpinnerData.js').ImsSpinnerData
 * & import('../wgt/video/ImsVideoData.js').ImsVideoData
 * & import('../wgt/model/ImsModelData.js').ImsModelData
 * & import('../wgt/audio/ImsAudioData.js').ImsAudioData>} ImsData
 */

/** @enum {string} */
export const ImsEvents = {
  LOAD: 'ims-load',
  READY: 'ims-ready',
  ERROR: 'ims-error',
  RESIZE: 'ims-resize',
  DESTROY: 'ims-destroy',
};

/**
 * @typedef {Object} ImsPlugin
 * @property {string} name
 * @property {(widget: ImsBaseClass) => void} [onInit]
 * @property {(widget: ImsBaseClass) => void} [onReady]
 * @property {(widget: ImsBaseClass) => void} [onResize]
 * @property {(widget: ImsBaseClass) => void} [onDestroy]
 * @property {(widget: ImsBaseClass, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => void} [onRender]
 */

export class ImsBaseClass extends Symbiote {

  /** @type {ImsPlugin[]} */
  static plugins = [];

  /**
   * Register a plugin for this widget class
   * @param {ImsPlugin} plugin
   */
  static use(plugin) {
    if (!this.plugins.includes(plugin)) {
      this.plugins = [...this.plugins, plugin];
    }
  }

  /** @returns {ImsPlugin[]} */
  get #plugins() {
    return /** @type {typeof ImsBaseClass} */ (this.constructor).plugins;
  }

  /**
   * @param {String} uid 
   * @param {String | Number} variant 
   */
  #makeUrl(uid, variant) {
    return this.srcData.urlTemplate.replaceAll('{UID}', uid)
    .replaceAll('{VARIANT}', variant.toString());
  }

  constructor() {
    super();
    this.add$({
      progress: 0,
      fullscreen: false,
      onFs: () => {
        this.$.fullscreen = !this.$.fullscreen;
      },
    });
  }

  override = {};

  /** @type {Object} */
  #srcData = {};
  set srcData(srcData) {
    this.#srcData = srcData;
    // Programmatic setter: if already initialized, reinit with new data
    if (this.#initialized && srcData) {
      this.fillSrcVariantList();
      this.init();
    }
  }

  /** @type {ImsData} */
  get srcData() {
    return this.#srcData;
  }

  /** @type {boolean} */
  #initialized = false;

  /** @type {ImsPreloader} */
  #preloader = null;

  // --- Events ---

  /**
   * @param {string} eventName
   * @param {any} [detail]
   */
  emit(eventName, detail) {
    this.dispatchEvent(new CustomEvent(eventName, {
      detail,
      bubbles: true,
      composed: true,
    }));
  }

  // --- Lifecycle hooks ---

  /** Called before data loading starts */
  beforeLoad() {}

  /** Called after srcData is loaded and init() completes */
  onReady() {}

  /**
   * Called on error during data loading
   * @param {Error} error
   */
  onError(error) {
    console.error(`[IMS] Error in <${this.localName}>:`, error);
  }

  onResize() {
    this.rect = this.canvas?.getBoundingClientRect() || this.getBoundingClientRect();
    this.fillSrcVariantList();
    this.#plugins.forEach((p) => p.onResize?.(this));
    this.emit(ImsEvents.RESIZE, { rect: this.rect });
  }

  dataClass = null;

  init() {}

  /** @type {CanvasRenderingContext2D} */
  #ctx2d;
  get ctx2d() {
    this.#ctx2d = this.#ctx2d || this.canvas.getContext('2d');
    return this.#ctx2d;
  }

  fillSrcVariantList() {
    if (this.srcData?.urlTemplate && this.srcData?.cdnIdList?.length) {
      if (!this.srcData.srcList) {
        this.srcData.srcList = [];
      }
      let variant = this.srcData.maxVariantName || 'max';
      if (this.srcData.imsType !== 'pano' && this.srcData.variants?.length) {
        if (this.srcData.imsType === 'spinner') {
          variant = getVariantFit(this.srcData.variants, this, 1).toString();
        } else {
          variant = getVariantFit(this.srcData.variants, this).toString();
        }
      }
      this.srcData.cdnIdList.forEach((uid, idx) => {
        if (!this.srcData.srcList[idx]) {
          this.srcData.srcList[idx] = this.#makeUrl(uid, variant);
        }
      });
    }
  }

  // --- Lazy loading ---

  /** @type {IntersectionObserver | null} */
  #lazyObserver = null;

  #setupLazy() {
    this.#lazyObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        this.#lazyObserver.disconnect();
        this.#lazyObserver = null;
        this.#loadData();
      }
    }, { rootMargin: '200px' });
    this.#lazyObserver.observe(this);
  }

  #showPreloader() {
    if (this.#preloader) {
      this.#preloader.removeAttribute('hidden');
    }
  }

  #hidePreloader() {
    if (this.#preloader) {
      this.#preloader.setAttribute('hidden', '');
      let onEnd = () => {
        this.#preloader?.remove();
        this.#preloader = null;
      };
      this.#preloader.addEventListener('transitionend', onEnd, { once: true });
      // Fallback if transition doesn't fire:
      setTimeout(onEnd, 400);
    }
  }

  async #loadData() {
    let dataUrl = this.$['srcDataUrl'];
    if (!dataUrl) {
      return;
    }
    this.#showPreloader();
    this.beforeLoad();
    this.emit(ImsEvents.LOAD, { progress: 0 });
    try {
      let srcData = await loadSourceData(dataUrl);
      Object.assign(srcData, this.override);
      if (this.dataClass) {
        validateConfig(srcData, new this.dataClass(), this.localName);
      }
      this.#srcData = srcData;
      this.fillSrcVariantList();
      this.init();
      this.#initialized = true;
      this.#plugins.forEach((p) => p.onInit?.(this));
      this.onReady();
      this.#plugins.forEach((p) => p.onReady?.(this));
      this.emit(ImsEvents.READY, { srcData });
    } catch (error) {
      this.#hidePreloader();
      this.onError(error);
      this.emit(ImsEvents.ERROR, { error });
    }
  }

  initCallback() {
    /** @type {HTMLCanvasElement} */
    this.canvas = this.ref.canvas || null;
    this.rect = (this.canvas || this).getBoundingClientRect();
    let dataRef = new this.dataClass();
    [...this.attributes].forEach((attr) => {
      let prop = kebabToCamel(attr.name);
      if (dataRef.hasOwnProperty(prop)) {
        let propVal;
        let attrVal = this.getAttribute(attr.name);
        try {
          propVal = JSON.parse(attrVal);
        } catch(err) {
          propVal = attrVal;
        }
        this.override[prop] = propVal;
      }
    });

    // Inject preloader unless disabled
    if (!this.hasAttribute('no-preloader')) {
      this.#preloader = /** @type {ImsPreloader} */ (document.createElement('ims-preloader'));
      this.#preloader.setAttribute('hidden', '');
      this.shadowRoot.appendChild(this.#preloader);
      this.sub('progress', (val) => {
        if (val > 0) {
          this.#hidePreloader();
        }
      });
    }

    let isLazy = this.hasAttribute('lazy');
    this.sub('srcDataUrl', (dataUrl) => {
      if (!dataUrl) {
        return;
      }
      if (isLazy && !this.#initialized) {
        this.#setupLazy();
      } else {
        this.#loadData();
      }
    });

    FullscreenMgr.init();
    this.sub('fullscreen', (val) => {
      if (val) {
        FullscreenMgr.enable(this);
        this.setAttribute('fullscreen', '');
      } else {
        FullscreenMgr.disable();
        this.removeAttribute('fullscreen');
      }
    }, false);

    ResizeController.add(this, () => {
      this.onResize();
    });
  }

  destroyCallback() {
    ResizeController.remove(this);
    this.#lazyObserver?.disconnect();
    this.#plugins.forEach((p) => p.onDestroy?.(this));
    this.emit(ImsEvents.DESTROY);
  }

}

ImsBaseClass.bindAttributes({
  'src-data': 'srcDataUrl',
});

export { UID }
export default ImsBaseClass;