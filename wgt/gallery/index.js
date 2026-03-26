import { ImsBaseClass } from '../../lib/ImsBaseClass.js';
import { template } from './template.js';
import { styles } from './styles.js';
import { ImsGalleryData } from './ImsGalleryData.js';
import { createErrorPlaceholder } from '../../lib/createErrorPlaceholder.js';

export class ImsGallery extends ImsBaseClass {

  dataClass = ImsGalleryData;

  init$ = {
    current: 0,
    currentDisplay: 1,
    total: 0,
    caption: '',
    autoplay: false,
    prevDisabled: false,
    nextDisabled: false,

    onNext: () => {
      this.next();
    },

    onPrev: () => {
      this.prev();
    },

    toggleAutoplay: () => {
      this.toggleAutoplay();
    },
  };

  /** @type {HTMLImageElement[]} */
  #images = [];
  /** @type {number} */
  #fadeProgress = 1;
  /** @type {number} */
  #prevIdx = -1;
  /** @type {number} */
  #autoplayTimer = 0;
  /** @type {number} */
  #touchStartX = 0;
  /** @type {number} */
  #lastIdx = -1;

  // --- Drawing ---

  /** @type {number} */
  #animId = 0;

  #draw = () => {
    if (!this.#images.length) return;
    let img = this.#images[this.$.current];
    if (!img || !img.complete) return;

    if (this.canvas.width !== img.width) this.canvas.width = img.width;
    if (this.canvas.height !== img.height) this.canvas.height = img.height;

    if (this.#fadeProgress < 1 && this.#prevIdx >= 0) {
      let prevImg = this.#images[this.#prevIdx];
      this.ctx2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (prevImg && prevImg.complete) {
        this.ctx2d.globalAlpha = 1 - this.#fadeProgress;
        this.ctx2d.drawImage(prevImg, 0, 0, img.width, img.height);
      }
      this.ctx2d.globalAlpha = this.#fadeProgress;
      this.ctx2d.drawImage(img, 0, 0, img.width, img.height);
      this.ctx2d.globalAlpha = 1;
    } else {
      this.ctx2d.drawImage(img, 0, 0, img.width, img.height);
    }
  }

  #crossfade(fromIdx, toIdx) {
    if (this.#animId) {
      cancelAnimationFrame(this.#animId);
      this.#animId = 0;
    }
    this.#prevIdx = fromIdx;
    this.#fadeProgress = 0;
    let duration = this.srcData.transitionDuration || 300;
    let start = performance.now();

    let step = (timestamp) => {
      this.#fadeProgress = Math.min(1, (timestamp - start) / duration);
      this.#draw();
      if (this.#fadeProgress < 1) {
        this.#animId = requestAnimationFrame(step);
      } else {
        this.#prevIdx = -1;
        this.#animId = 0;
      }
    };
    this.#animId = requestAnimationFrame(step);
  }

  // --- Image loading ---

  #loadImages() {
    let total = this.srcData.srcList.length;
    let loaded = 0;
    let hasNew = false;
    this.srcData.srcList.forEach((imgUrl, idx) => {
      let img = this.#images[idx] || new Image();
      if (!this.#images[idx]) {
        hasNew = true;
        this.#images.push(img);
        img.onload = () => {
          loaded++;
          this.$.progress = (loaded / total) * 100;
          if (loaded === total) {
            window.requestAnimationFrame(() => {
              this.#draw();
            });
          }
        };
        img.onerror = () => {
          loaded++;
          this.$.progress = (loaded / total) * 100;
          this.#images[idx] = createErrorPlaceholder(idx);
          this.#draw();
        };
      }
      if (img.src?.startsWith('data:')) {
        loaded++;
      } else if (img.src !== imgUrl) {
        img.src = imgUrl;
      } else {
        loaded++;
      }
    });
    if (hasNew) {
      this.$.progress = 0;
    }
    if (loaded === total) {
      this.#draw();
    }
  }

  // --- Swipe ---

  #touchStartHandler = (e) => {
    this.#touchStartX = e.touches[0].clientX;
  }

  #touchEndHandler = (e) => {
    let dx = e.changedTouches[0].clientX - this.#touchStartX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) {
        this.next();
      } else {
        this.prev();
      }
    }
  }

  // --- Autoplay ---

  /** Start autoplay slideshow */
  startAutoplay() {
    this.$.autoplay = true;
    let interval = this.srcData.autoplayInterval || 3000;
    this.#autoplayTimer = window.setInterval(() => {
      if (!this.srcData.loop && this.$.current >= this.#images.length - 1) {
        this.stopAutoplay();
        return;
      }
      this.next();
    }, interval);
  }

  /** Stop autoplay slideshow */
  stopAutoplay() {
    this.$.autoplay = false;
    clearInterval(this.#autoplayTimer);
  }

  /** Toggle autoplay on/off */
  toggleAutoplay() {
    if (this.$.autoplay) {
      this.stopAutoplay();
    } else {
      this.startAutoplay();
    }
  }

  // --- Lifecycle ---

  init() {
    this.$.total = this.srcData.srcList.length;
    this.#loadImages();
    this.#updateState();

    this.canvas.addEventListener('touchstart', this.#touchStartHandler, { passive: true });
    this.canvas.addEventListener('touchend', this.#touchEndHandler);
  }

  #updateState() {
    if (!this.srcData?.imsType) return;
    let captions = this.srcData.captions;
    let caption = (captions && captions[this.$.current]) || '';
    this.$.caption = caption;
    this.title = caption;
    this.$.currentDisplay = this.$.current + 1;
    if (!this.srcData.loop) {
      this.$.prevDisabled = this.$.current === 0;
      this.$.nextDisabled = this.$.current >= this.#images.length - 1;
    } else {
      this.$.prevDisabled = false;
      this.$.nextDisabled = false;
    }
  }

  onResize() {
    super.onResize();
    this.#loadImages();
  }

  renderCallback() {
    this.sub('current', (val) => {
      this.#updateState();
      if (this.#lastIdx >= 0 && this.#lastIdx !== val) {
        this.#crossfade(this.#lastIdx, val);
      } else {
        this.#draw();
      }
      this.#lastIdx = val;
    });
  }

  // --- Public API ---

  get hotspotState() {
    return { image: this.$.current };
  }

  /**
   * Go to a specific image
   * @param {number} index - image index (0-based)
   */
  goTo(index) {
    let max = this.#images.length - 1;
    this.$.current = Math.max(0, Math.min(index, max));
  }

  /** Go to next image */
  next() {
    if (this.$.current < this.#images.length - 1) {
      this.$.current++;
    } else if (this.srcData.loop) {
      this.$.current = 0;
    }
  }

  /** Go to previous image */
  prev() {
    if (this.$.current > 0) {
      this.$.current--;
    } else if (this.srcData.loop) {
      this.$.current = this.#images.length - 1;
    }
  }

  destroyCallback() {
    this.stopAutoplay();
    this.canvas.removeEventListener('touchstart', this.#touchStartHandler);
    this.canvas.removeEventListener('touchend', this.#touchEndHandler);
  }

}

ImsGallery.template = template;
ImsGallery.shadowStyles = styles;

ImsGallery.reg('ims-gallery');

export default ImsGallery;