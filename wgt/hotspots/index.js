import Symbiote, { html, css } from '@symbiotejs/symbiote';
import { loadSourceData } from '../../lib/loadSourceData.js';
import { styles } from './styles.js';

export class ImsHotspots extends Symbiote {

  init$ = {
    spots: [],
  };

  /** @type {HotspotSpot[]} */
  #spotDefs = [];

  /** @type {HTMLElement} */
  #hostWidget = null;

  /** @type {number} */
  #rafId = 0;

  initCallback() {
    this.hidden = true;
    this.sub('^ready', (val) => {
      this.hidden = !val;
    });
    this.sub('srcData', async (url) => {
      if (!url) return;
      let data = await loadSourceData(url);
      this.#spotDefs = data.spots || [];
      this.#render();
      this.#startStateLoop();
    });
  }

  #render() {
    let container = this.shadowRoot;
    container.querySelectorAll('.spot').forEach((el) => el.remove());
    for (let spot of this.#spotDefs) {
      let el = document.createElement('div');
      el.className = 'spot';
      el.dataset.id = spot.id;
      el.textContent = spot.label || '';
      el.style.left = `${spot.x * 100}%`;
      el.style.top = `${spot.y * 100}%`;
      el.addEventListener('click', () => this.#onSpotClick(spot));
      container.appendChild(el);
    }
  }

  /**
   * @param {HotspotSpot} spot
   */
  #onSpotClick(spot) {
    if (spot.action) {
      this.$['^' + spot.action]?.();
    }
    if (spot.targetSrcData) {
      this.$['^onHotspotNavigate']?.(spot);
    }
    if (spot.url) {
      window.open(spot.url, '_blank');
    }
  }

  #getHostWidget() {
    if (this.#hostWidget) return this.#hostWidget;
    let parent = this.parentElement;
    if (parent && parent.tagName.startsWith('IMS-')) {
      this.#hostWidget = parent;
    }
    return this.#hostWidget;
  }

  /** @returns {number} */
  #getStateValue() {
    let host = this.#getHostWidget();
    if (!host) return 0;
    let h = /** @type {any} */ (host);
    // Spinner: class getter
    if (h.currentFrame !== undefined) return h.currentFrame;
    // Gallery: reactive state
    if (h.$ && h.$.current !== undefined) return h.$.current;
    return 0;
  }

  #startStateLoop() {
    let update = () => {
      this.#updateSpots();
      this.#rafId = requestAnimationFrame(update);
    };
    this.#rafId = requestAnimationFrame(update);
  }

  #updateSpots() {
    let stateVal = this.#getStateValue();
    let spotEls = this.shadowRoot.querySelectorAll('.spot');
    spotEls.forEach((el, i) => {
      let def = this.#spotDefs[i];
      if (!def) return;

      // Visibility
      let visible = this.#checkVisibility(def, stateVal);
      if (visible) {
        el.setAttribute('visible', '');
      } else {
        el.removeAttribute('visible');
      }

      // Keyframe position
      if (def.keyframes) {
        let pos = this.#interpolateKeyframes(def.keyframes, stateVal);
        /** @type {HTMLElement} */ (el).style.left = `${pos.x * 100}%`;
        /** @type {HTMLElement} */ (el).style.top = `${pos.y * 100}%`;
      }
    });
  }

  /**
   * @param {HotspotSpot} def
   * @param {number} stateVal
   * @returns {boolean}
   */
  #checkVisibility(def, stateVal) {
    if (!def.visible) return true;

    for (let [key, val] of Object.entries(def.visible)) {
      if (Array.isArray(val)) {
        if (stateVal < val[0] || stateVal > val[1]) return false;
      } else {
        if (Math.round(stateVal) !== val) return false;
      }
    }
    return true;
  }

  /**
   * @param {HotspotKeyframes} keyframes
   * @param {number} stateVal
   * @returns {{ x: number, y: number }}
   */
  #interpolateKeyframes(keyframes, stateVal) {
    let keys = Object.keys(keyframes).map(Number).sort((a, b) => a - b);
    if (!keys.length) return { x: 0, y: 0 };

    if (stateVal <= keys[0]) return keyframes[keys[0]];
    if (stateVal >= keys[keys.length - 1]) return keyframes[keys[keys.length - 1]];

    let lo = keys[0];
    let hi = keys[keys.length - 1];
    for (let i = 0; i < keys.length - 1; i++) {
      if (stateVal >= keys[i] && stateVal <= keys[i + 1]) {
        lo = keys[i];
        hi = keys[i + 1];
        break;
      }
    }

    let t = (stateVal - lo) / (hi - lo);
    let from = keyframes[lo];
    let to = keyframes[hi];
    return {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    };
  }

  destroyCallback() {
    cancelAnimationFrame(this.#rafId);
  }
}

ImsHotspots.bindAttributes({
  'src-data': 'srcData',
});

ImsHotspots.shadowStyles = styles;
ImsHotspots.template = html`<slot></slot>`;

ImsHotspots.reg('ims-hotspots');

export default ImsHotspots;
