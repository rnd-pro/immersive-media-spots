import Symbiote from '@symbiotejs/symbiote';
import { template } from './template.js';
import { shadowCss } from './styles.js';
import { loadSourceData } from '../../lib/loadSourceData.js';
import '../hotspots/index.js';

export class ImsViewer extends Symbiote {

  init$ = {
    urlTpl: 'https://cdn.jsdelivr.net/npm/interactive-media-spots@{{version}}/wgt/{{imsType}}/+esm',
    hasHistory: false,
    onBack: () => this.#goBack(),
    onHotspotNavigate: (/** @type {HotspotSpot} */ spot) => {
      this.#history.push({
        srcData: this.$.srcData,
        hotspots: this.$.hotspots || '',
      });
      this.$.hasHistory = true;
      this.$.hotspots = spot.targetHotspotsData || '';
      this.$.srcData = spot.targetSrcData;
    },
  };

  /** @type {{ srcData: string, hotspots: string }[]} */
  #history = [];

  initCallback() {
    this.sub('srcData', async (srcDataUrl) => {
      if (!srcDataUrl) return;
      await this.#loadWidget(srcDataUrl, this.$.hotspots);
    });
  }

  /**
   * @param {string} srcDataUrl
   * @param {string} [hotspotsUrl]
   */
  async #loadWidget(srcDataUrl, hotspotsUrl) {
    let oldWidget = this.querySelector(':scope > *');
    if (oldWidget) {
      await this.#fadeOut(oldWidget);
    }
    this.innerHTML = '';

    let srcData = await loadSourceData(srcDataUrl);
    let overrideVersion = this.getAttribute('version');
    let urlStr = this.$.urlTpl
      .replaceAll('{{version}}', overrideVersion || srcData.version || 'latest')
      .replaceAll('{{imsType}}', srcData.imsType);
    await import(urlStr);

    let imsTypeEl = document.createElement(`ims-${srcData.imsType}`);
    let elAttributes = [...this.attributes];
    let castAttr = elAttributes.find(attr => attr.name === 'cast-next');
    if (castAttr) {
      let castAttrIndex = elAttributes.indexOf(castAttr);
      elAttributes = elAttributes.slice(castAttrIndex + 1, elAttributes.length);
      elAttributes.forEach(attr => {
        imsTypeEl.setAttribute(attr.name, attr.value);
      });
    }
    let blob = new Blob([JSON.stringify(srcData)], {
      type: 'application/json',
    });
    let url = URL.createObjectURL(blob);
    imsTypeEl.setAttribute('src-data', url);

    if (oldWidget) {
      imsTypeEl.setAttribute('fading-in', '');
    }
    this.appendChild(imsTypeEl);

    if (hotspotsUrl) {
      let hotEl = document.createElement('ims-hotspots');
      hotEl.setAttribute('src-data', hotspotsUrl);
      imsTypeEl.appendChild(hotEl);
    }

    if (oldWidget) {
      requestAnimationFrame(() => {
        imsTypeEl.removeAttribute('fading-in');
      });
    }
  }

  /**
   * @param {Element} el
   * @returns {Promise<void>}
   */
  #fadeOut(el) {
    return new Promise((resolve) => {
      el.addEventListener('transitionend', () => resolve(), { once: true });
      el.setAttribute('fading-out', '');
      setTimeout(resolve, 500);
    });
  }

  #goBack() {
    let prev = this.#history.pop();
    if (!prev) return;
    this.$.hasHistory = this.#history.length > 0;
    this.$.hotspots = prev.hotspots;
    this.$.srcData = prev.srcData;
  }
}

ImsViewer.template = template;
ImsViewer.shadowStyles = shadowCss;

ImsViewer.bindAttributes({
  'src-data': 'srcData',
  'url-template': 'urlTpl',
  'hotspots': 'hotspots',
});

ImsViewer.reg('ims-viewer');

export default ImsViewer;