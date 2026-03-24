import { ImsBaseClass } from '../../lib/ImsBaseClass.js';
import { ImsMapData } from './ImsMapData.js';
import { template } from './template.js';
import { styles } from './styles.js';
import { LeafletMap, TileLayer, Marker, Icon } from 'leaflet';

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

export class ImsMap extends ImsBaseClass {

  dataClass = ImsMapData;

  init$ = {
    onZoomIn: () => this.onZoomIn(),
    onZoomOut: () => this.onZoomOut(),
  }

  /** @type {LeafletMap} */
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
        let marker = new Marker([m.lat, m.lng]).addTo(this.#map);
        if (m.label) {
          marker.bindPopup(m.label);
        }
      }
    }

    this.$.progress = 100;
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
