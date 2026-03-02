import { VERSION } from '../../lib/version.js';

export class ImsAudioData {
  imsType = 'audio';
  version = VERSION;
  hideUi = false;
  autoplay = false;
  loop = false;
  /** @type {String[]} */
  srcList = [];
  /** @type {String[]} */
  cdnIdList = [];
  urlTemplate = '';
  /** @type {String[]} */
  variants = [];
  maxVariantName = '';
  waveformColor = '';
  progressColor = '';
  dispatchEvents = false;

  /**
   * @param {Partial<ImsAudioData>} initObject
   */
  constructor(initObject = {}) {
    Object.assign(this, initObject);
  }
}
