import { ImsBaseClass } from '../../lib/ImsBaseClass.js';
import { template } from './template.js';
import { styles } from './styles.js';
import { ImsGalleryData } from './ImsGalleryData.js';
import { createErrorPlaceholder } from '../../lib/createErrorPlaceholder.js';

export class ImsGallery extends ImsBaseClass {

  dataClass = ImsGalleryData;

  init$ = {

    current: 0,

    onNext: () => {
      if (this.$.current < this.#images.length - 1) {
        this.$.current++;
      } else {
        this.$.current = 0;
      }
    },

    onPrev: () => {
      if (this.$.current > 0) {
        this.$.current--;
      } else {
        this.$.current = this.#images.length - 1;
      }
    },

  }

  #draw = () => {
    if (!this.#images.length) {
      return;
    }
    window.requestAnimationFrame(() => {
      this.ctx2d.clearRect(0, 0, this.canvas.width, this.canvas.height);
      let img = this.#images[this.$.current];
      if (!img.complete) {
        return;
      }
      this.canvas.width = img.width;
      this.canvas.height = img.height;
      this.ctx2d.drawImage(img, 0, 0, img.width, img.height);
    });
  }

  /** @type {HTMLImageElement[]} */
  #images = [];
  #loadImages() {
    let total = this.srcData.srcList.length;
    let loaded = 0;
    this.$.progress = 0;
    this.srcData.srcList.forEach((imgUrl, idx) => {
      let img = this.#images[idx] || new Image();
      if (!this.#images[idx]) {
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
      img.src = imgUrl;
    });
  }

  init() {
    this.#loadImages();
  }

  onResize() {
    super.onResize();
    this.#loadImages();
  }

  renderCallback() {
    this.sub('current', this.#draw);
  }

}

ImsGallery.template = template;
ImsGallery.shadowStyles = styles;

ImsGallery.reg('ims-gallery');

export default ImsGallery;