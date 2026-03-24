import { VERSION } from '../../lib/version.js';

export class ImsMapData {
  imsType = 'map';
  version = VERSION;
  hideUi = false;
  dispatchEvents = false;
  /** @type {[number, number]} */
  center = [0, 0];
  zoom = 13;
  minZoom = 1;
  maxZoom = 18;
  tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
  /** @type {{ lat: number, lng: number, label?: string }[]} */
  markers = [];

  /**
   * @param {Partial<ImsMapData>} initObject
   */
  constructor(initObject = {}) {
    Object.assign(this, initObject);
  }
}
