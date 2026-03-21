import { VERSION } from '../../lib/version.js';

export class ImsGalleryData {
  // Common properties:
  imsType = 'gallery';
  version = VERSION;
  hideUi = false;
  urlTemplate = '';
  /** @type {String[]} */
  variants = [];
  maxVariantName = '';
  dispatchEvents = false;
  transitionDuration = 300;
  autoplayInterval = 3000;
  loop = true;
  /** @type {String[]} */
  captions = [];
  /** @type {String[]} */
  cdnIdList = [];
  /** @type {String[]} */
  srcList = [];

  /**
   * 
   * @param {Partial<ImsGalleryData>} initObject
   */
  constructor(initObject = {}) {
    Object.assign(this, initObject);
  }
}