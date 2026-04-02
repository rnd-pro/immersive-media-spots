import { VERSION } from '../../lib/version.js';

export class ImsModelData {
  imsType = 'model';
  version = VERSION;
  hideUi = false;
  autoplay = true;
  /** @type {String[]} */
  srcList = [];
  dispatchEvents = false;
  fov = 45;
  bgColor = '';
  envMapIntensity = 1;

  /**
   * @param {Partial<ImsModelData>} initObject
   */
  constructor(initObject = {}) {
    Object.assign(this, initObject);
  }
}
