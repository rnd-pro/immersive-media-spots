import { ImsBaseClass } from '../../lib/ImsBaseClass.js';
import { DIFF_STYLES } from './styles.js';
import { DIFF_TPL } from './template.js';
import { ImsDiffData } from './ImsDiffData.js';

class ImsDiff extends ImsBaseClass {

  dataClass = ImsDiffData;

  /** @type {HTMLImageElement[]} */
  #images = [];

  init$ = {
    mode: 'slider',
    hasPairs: false,
    animating: false,
    isVertical: false,
    toggleMode: () => {
      this.toggleMode();
    },
    toggleOrientation: () => {
      this.toggleOrientation();
    },
    toggleAnimate: () => {
      this.toggleAnimate();
    },
    prevPair: () => {
      if (this.#currentIdx > 0) {
        this.goTo(this.#currentIdx - 1);
      }
    },
    nextPair: () => {
      let max = Math.max(0, this.#images.length - 2);
      if (this.#currentIdx < max) {
        this.goTo(this.#currentIdx + 1);
      }
    },
  };

  /** @type {number} */
  #currentIdx = 0;
  /** @type {number} */
  #share = 0.5;
  /** @type {number} */
  #animRafId = 0;

  #loadImages() {
    let total = this.srcData.srcList.length;
    let loaded = 0;
    this.$.progress = 0;
    this.srcData.srcList.forEach((imgUrl, idx) => {
      let img = this.#images[idx] || new Image();
      if (!this.#images[idx]) {
        img.onload = () => {
          loaded++;
          this.$.progress = (loaded / total) * 100;
          if (loaded === total) {
            window.setTimeout(() => {
              this.#start();
            });
          }
        };
        this.#images.push(img);
      }
      img.src = imgUrl;
    });
  }

  onResize() {
    super.onResize();
    this.#loadImages();
    this.#redraw();
  }

  init() {
    this.$.mode = this.srcData.mode || 'slider';
    this.$.isVertical = this.srcData.orientation === 'vertical';
    this.#share = (this.srcData.startPosition || 50) / 100;
    this.$.hasPairs = this.srcData.srcList.length > 2;
    if (this.$.isVertical) {
      this.setAttribute('vertical', '');
    }
    this.#loadImages();
  }

  #redraw() {
    this.#updateSlider();
    if (this.$.mode === 'onion') {
      this.#drawOnion(this.#currentIdx, this.#share);
    } else {
      this.#drawSlider(this.#currentIdx, this.#share);
    }
  }

  #updateSlider() {
    if (!this.ref.slider) return;
    if (this.$.mode === 'onion') {
      this.ref.slider.style.display = 'none';
    } else {
      this.ref.slider.style.display = '';
      if (this.$.isVertical) {
        this.ref.slider.style.left = '';
        this.ref.slider.style.top = `${this.#share * 100}%`;
      } else {
        this.ref.slider.style.top = '';
        this.ref.slider.style.left = `${this.#share * 100}%`;
      }
    }
  }

  // --- Interaction handlers ---

  #mMoveHandler = (e) => {
    e.preventDefault();
    if (e.type === 'touchmove') {
      e = e.touches[0];
    }
    if (this.$.mode === 'onion') {
      let rect = this.canvas.getBoundingClientRect();
      this.#share = this.$.isVertical
        ? Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height))
        : Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      this.#drawOnion(this.#currentIdx, this.#share);
    } else {
      let rect = this.cnvRect;
      if (this.$.isVertical) {
        let top = e.clientY - rect.top;
        this.ref.slider.style.top = `${top + this.canvas.offsetTop}px`;
        this.#share = top / rect.height;
      } else {
        let left = e.clientX - rect.left;
        this.ref.slider.style.left = `${left + this.canvas.offsetLeft}px`;
        this.#share = left / rect.width;
      }
      this.#drawSlider(this.#currentIdx, this.#share);
    }
  }

  #mUpHandler = () => {
    this.canvas.removeEventListener('mousemove', this.#mMoveHandler);
    this.canvas.removeEventListener('touchmove', this.#mMoveHandler);
  }

  #mDownHandler = () => {
    this.cnvRect = this.canvas.getBoundingClientRect();
    this.canvas.addEventListener('mousemove', this.#mMoveHandler);
    this.canvas.addEventListener('mouseup', this.#mUpHandler);
    this.canvas.addEventListener('touchmove', this.#mMoveHandler);
    this.canvas.addEventListener('touchend', this.#mUpHandler);
  }

  #mOutHandler = () => {
    this.canvas.removeEventListener('mousemove', this.#mMoveHandler);
    this.canvas.removeEventListener('touchmove', this.#mMoveHandler);
  }

  #start() {
    this.#redraw();
    this.canvas.addEventListener('mousedown', this.#mDownHandler);
    this.canvas.addEventListener('mouseout', this.#mOutHandler);
    this.canvas.addEventListener('touchstart', this.#mDownHandler);
    this.canvas.addEventListener('touchend', this.#mUpHandler);
  }

  // --- Draw methods ---

  /**
   * @param {number} idx
   * @param {number} k - share coefficient 0..1
   */
  #drawSlider(idx, k) {
    let img1 = this.#images[idx];
    let img2 = this.#images[idx + 1];
    if (!img1 || !img2) return;

    let w = img1.width;
    let h = img1.height;
    this.canvas.width = w;
    this.canvas.height = h;

    this.ctx2d.drawImage(img1, 0, 0, w, h);

    if (this.$.isVertical) {
      let splitY = Math.round(h * k);
      this.ctx2d.clearRect(0, splitY, w, h - splitY);
      this.ctx2d.drawImage(img2, 0, splitY, w, h - splitY, 0, splitY, w, h - splitY);
    } else {
      let w2 = img2.width;
      let h2 = img2.height;
      let imgAspect = w2 / h2;
      let containerAspect = this.canvas.width / this.canvas.height;
      let containVertical = imgAspect < containerAspect;
      if (containVertical) {
        w2 = w2 * containerAspect / imgAspect;
      }
      let gap = w2 * (1 - k);
      let renderedWidth, renderedHeight;
      if (containVertical) {
        renderedHeight = this.canvas.height;
        renderedWidth = renderedHeight * imgAspect;
      } else {
        renderedWidth = this.canvas.width;
        renderedHeight = renderedWidth / imgAspect;
      }
      let leftOffset = containVertical ? (this.canvas.width - renderedWidth) / 2 : 0;
      let sx = w2 - gap - leftOffset;
      let sy = 0;
      let sWidth = img2.width - sx;
      let sHeight = h2;
      this.ctx2d.clearRect(sx, sy, sWidth, sHeight);
      this.ctx2d.drawImage(img2, sx, sy, sWidth, sHeight, sx, 0, sWidth, sHeight);
    }
  }

  /**
   * @param {number} idx
   * @param {number} opacity - 0..1
   */
  #drawOnion(idx, opacity) {
    let img1 = this.#images[idx];
    let img2 = this.#images[idx + 1];
    if (!img1 || !img2) return;

    let w = img1.width;
    let h = img1.height;
    this.canvas.width = w;
    this.canvas.height = h;

    this.ctx2d.globalAlpha = 1;
    this.ctx2d.drawImage(img1, 0, 0, w, h);
    this.ctx2d.globalAlpha = opacity;
    this.ctx2d.drawImage(img2, 0, 0, w, h);
    this.ctx2d.globalAlpha = 1;
  }

  // --- Animation ---

  #animStartTime = 0;

  #animLoop = (timestamp) => {
    if (!this.$.animating) return;
    if (!this.#animStartTime) this.#animStartTime = timestamp;
    let elapsed = timestamp - this.#animStartTime;
    let speed = this.srcData.animateSpeed || 2000;
    let cycle = (elapsed % (speed * 2)) / speed;
    this.#share = cycle <= 1 ? cycle : 2 - cycle;
    this.#redraw();
    this.#animRafId = requestAnimationFrame(this.#animLoop);
  }

  /** Start animated sweep */
  startAnimate() {
    this.$.animating = true;
    this.#animStartTime = 0;
    this.#animRafId = requestAnimationFrame(this.#animLoop);
  }

  /** Stop animated sweep */
  stopAnimate() {
    this.$.animating = false;
    cancelAnimationFrame(this.#animRafId);
  }

  /** Toggle animated sweep */
  toggleAnimate() {
    if (this.$.animating) {
      this.stopAnimate();
    } else {
      this.startAnimate();
    }
  }

  // --- Public API ---

  /**
   * Set the diff split position
   * @param {number} percent - share percentage (0-100)
   */
  setShare(percent) {
    let k = Math.max(0, Math.min(100, percent)) / 100;
    this.#share = k;
    this.#redraw();
  }

  /**
   * Go to a specific diff pair
   * @param {number} index - pair index (0-based)
   */
  goTo(index) {
    let max = Math.max(0, this.#images.length - 2);
    this.#currentIdx = Math.max(0, Math.min(index, max));
    this.#share = 0.5;
    this.#redraw();
  }

  /**
   * Set comparison mode
   * @param {'slider' | 'onion'} mode
   */
  setMode(mode) {
    this.$.mode = mode;
    this.#redraw();
  }

  /** Toggle between slider and onion modes */
  toggleMode() {
    this.$.mode = this.$.mode === 'slider' ? 'onion' : 'slider';
    this.#redraw();
  }

  /** Toggle orientation between horizontal and vertical */
  toggleOrientation() {
    this.$.isVertical = !this.$.isVertical;
    if (this.$.isVertical) {
      this.setAttribute('vertical', '');
    } else {
      this.removeAttribute('vertical');
    }
    this.#redraw();
  }

  destroyCallback() {
    this.stopAnimate();
    this.canvas.removeEventListener('mousedown', this.#mDownHandler);
    this.canvas.removeEventListener('mouseout', this.#mOutHandler);
    this.canvas.removeEventListener('touchstart', this.#mDownHandler);
    this.canvas.removeEventListener('touchend', this.#mUpHandler);
    this.canvas.removeEventListener('touchmove', this.#mMoveHandler);
  }

}

ImsDiff.shadowStyles = DIFF_STYLES;
ImsDiff.template = DIFF_TPL;

ImsDiff.reg('ims-diff');

export default ImsDiff;
export { ImsDiff, ImsDiffData }
