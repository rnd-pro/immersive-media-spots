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
      el.part = 'spot';
      el.dataset.id = spot.id;
      el.textContent = spot.label || '';
      el.style.left = `${spot.x * 100}%`;
      el.style.top = `${spot.y * 100}%`;
      if (spot.color) {
        el.style.setProperty('--spot-accent', spot.color);
      }
      el.addEventListener('click', () => this.#onSpotClick(spot));
      container.appendChild(el);
    }
  }

  /**
   * @param {HotspotSpot} spot
   */
  #onSpotClick(spot) {
    if (spot.action) {
      let bound = this.$['^' + spot.action];
      if (typeof bound === 'function') {
        bound();
      } else {
        let host = this.#getHostWidget();
        if (host && typeof host[spot.action] === 'function') {
          host[spot.action]();
        }
      }
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

  /** @returns {Record<string, number>} */
  #getHostState() {
    let host = this.#getHostWidget();
    if (!host || !host.isConnected) return {};
    return /** @type {any} */ (host).hotspotState || {};
  }

  #startStateLoop() {
    let update = () => {
      this.#updateSpots();
      this.#rafId = requestAnimationFrame(update);
    };
    this.#rafId = requestAnimationFrame(update);
  }

  #updateSpots() {
    let state = this.#getHostState();
    let spotEls = this.shadowRoot.querySelectorAll('.spot');
    spotEls.forEach((el, i) => {
      let def = this.#spotDefs[i];
      if (!def) return;

      // Visibility
      let visible = this.#checkVisibility(def, state);
      if (visible) {
        el.setAttribute('visible', '');
      } else {
        el.removeAttribute('visible');
      }

      // Keyframe position
      if (def.keyframes) {
        let stateKey = def.stateKey || Object.keys(state)[0] || 'frame';
        let stateVal = state[stateKey] ?? 0;
        let pos = this.#interpolateKeyframes(def.keyframes, stateVal);
        /** @type {HTMLElement} */ (el).style.left = `${pos.x * 100}%`;
        /** @type {HTMLElement} */ (el).style.top = `${pos.y * 100}%`;
      }
    });
  }

  /**
   * @param {HotspotSpot} def
   * @param {Record<string, number>} state
   * @returns {boolean}
   */
  #checkVisibility(def, state) {
    if (!def.visible) return true;

    for (let [key, val] of Object.entries(def.visible)) {
      let stateVal = state[key];
      if (stateVal === undefined) continue;
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
    /** @type {Map<number, { x: number, y: number }>} */
    let map = new Map();
    for (let [k, v] of Object.entries(keyframes)) {
      map.set(Number(k), v);
    }
    let keys = [...map.keys()].sort((a, b) => a - b);
    if (!keys.length) return { x: 0, y: 0 };

    if (stateVal <= keys[0]) return map.get(keys[0]);
    if (stateVal >= keys[keys.length - 1]) return map.get(keys[keys.length - 1]);

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
    let from = map.get(lo);
    let to = map.get(hi);
    return {
      x: from.x + (to.x - from.x) * t,
      y: from.y + (to.y - from.y) * t,
    };
  }

  destroyCallback() {
    cancelAnimationFrame(this.#rafId);
    this.#hostWidget = null;
  }
}

ImsHotspots.bindAttributes({
  'src-data': 'srcData',
});

ImsHotspots.shadowStyles = styles;
ImsHotspots.template = html`<slot></slot>`;

ImsHotspots.reg('ims-hotspots');

export default ImsHotspots;
