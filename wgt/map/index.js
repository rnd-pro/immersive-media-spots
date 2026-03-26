import { ImsBaseClass } from '../../lib/ImsBaseClass.js';
import { ImsMapData } from './ImsMapData.js';
import { template } from './template.js';
import { styles } from './styles.js';
// @ts-ignore — Leaflet 2.0 alpha ships no type definitions
import { LeafletMap, TileLayer, Marker, Icon, DivIcon } from 'leaflet';

const LEAFLET_CDN = 'https://cdn.jsdelivr.net/npm/leaflet@2.0.0-alpha.1/dist';
const LEAFLET_CSS_URL = `${LEAFLET_CDN}/leaflet.css`;

/** @type {CSSStyleSheet | null} */
let leafletSheet = null;

async function getLeafletSheet() {
  if (leafletSheet) return leafletSheet;
  let res = await fetch(LEAFLET_CSS_URL);
  let cssText = await res.text();
  leafletSheet = new CSSStyleSheet();
  leafletSheet.replaceSync(cssText);
  return leafletSheet;
}

/**
 * @param {string} color
 * @returns {DivIcon}
 */
function createPinIcon(color) {
  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="41" viewBox="0 0 25 41">
    <path d="M12.5 0C5.6 0 0 5.6 0 12.5C0 21.9 12.5 41 12.5 41S25 21.9 25 12.5C25 5.6 19.4 0 12.5 0Z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
    <circle cx="12.5" cy="12.5" r="5" fill="#fff"/>
  </svg>`;
  return new DivIcon({
    html: svg,
    className: 'ims-map-pin',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
}

/**
 * @param {ImsMapMarker} m
 * @returns {string}
 */
function buildPopupHtml(m) {
  let hasAction = m.url || m.targetSrcData || m.action || m.api;
  let label = m.label || '';
  if (!hasAction) return label;
  let parts = [];
  if (label) {
    parts.push(`<div class="ims-map-popup-label">${label}</div>`);
  }
  parts.push('<a class="ims-map-popup-action" href="#">\u2192</a>');
  return parts.join('');
}

export class ImsMap extends ImsBaseClass {

  dataClass = ImsMapData;

  init$ = {
    onZoomIn: () => this.onZoomIn(),
    onZoomOut: () => this.onZoomOut(),
  }

  /** @type {any} */
  #map = null;

  async init() {
    let sheet = await getLeafletSheet();
    this.shadowRoot.adoptedStyleSheets = [
      ...this.shadowRoot.adoptedStyleSheets,
      sheet,
    ];

    let container = this.ref.mapContainer;
    let center = this.srcData.center || [0, 0];
    let zoom = this.srcData.zoom ?? 13;
    let tileUrl = this.srcData.tileUrl || 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

    Icon.Default.imagePath = `${LEAFLET_CDN}/images/`;

    this.#map = new LeafletMap(container, {
      center,
      zoom,
      minZoom: this.srcData.minZoom ?? 1,
      maxZoom: this.srcData.maxZoom ?? 18,
      attributionControl: false,
      zoomControl: false,
    });

    new TileLayer(tileUrl, {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(this.#map);

    if (this.srcData.markers?.length) {
      for (let m of this.srcData.markers) {
        let opts = {};
        if (m.color) {
          opts.icon = createPinIcon(m.color);
        }
        /** @type {any} */
        let marker = new Marker([m.lat, m.lng], opts).addTo(this.#map);
        let hasAction = m.url || m.targetSrcData || m.action || m.api;
        let popupHtml = buildPopupHtml(m);
        if (popupHtml) {
          marker.bindPopup(popupHtml);
        }
        if (hasAction) {
          marker.on('popupopen', (e) => {
            let actionEl = e.popup.getElement()?.querySelector('.ims-map-popup-action');
            if (actionEl) {
              actionEl.addEventListener('click', (ev) => {
                ev.preventDefault();
                this.#onMarkerAction(m);
                marker.closePopup();
              });
            }
          });
        }
      }
    }

    this.$.progress = 100;
  }

  /**
   * @param {ImsMapMarker} m
   */
  #onMarkerAction(m) {
    if (m.action) {
      this.$['^' + m.action]?.();
    }
    if (m.targetSrcData) {
      this.$['^onHotspotNavigate']?.(m);
    }
    if (m.url) {
      window.open(m.url, '_blank');
    }
    if (m.api) {
      for (let [method, args] of Object.entries(m.api)) {
        if (typeof this[method] === 'function') {
          let callArgs = Array.isArray(args) ? args : [args];
          this[method](...callArgs);
        }
      }
    }
  }

  onResize() {
    super.onResize();
    this.#map?.invalidateSize();
  }

  /**
   * @param {number} lat
   * @param {number} lng
   */
  panTo(lat, lng) {
    this.#map?.panTo([lat, lng]);
  }

  /** @param {number} level */
  setZoom(level) {
    this.#map?.setZoom(level);
  }

  onZoomIn() {
    this.#map?.zoomIn();
  }

  onZoomOut() {
    this.#map?.zoomOut();
  }

  destroyCallback() {
    super.destroyCallback();
    this.#map?.remove();
    this.#map = null;
  }
}

ImsMap.shadowStyles = styles;
ImsMap.template = template;

ImsMap.reg('ims-map');

export default ImsMap;
