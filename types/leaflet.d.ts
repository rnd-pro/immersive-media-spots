declare module 'leaflet' {

  interface MapOptions {
    center?: [number, number];
    zoom?: number;
    minZoom?: number;
    maxZoom?: number;
    [key: string]: any;
  }

  interface TileLayerOptions {
    attribution?: string;
    subdomains?: string | string[];
    minZoom?: number;
    maxZoom?: number;
    [key: string]: any;
  }

  interface IconOptions {
    iconUrl?: string;
    iconRetinaUrl?: string;
    shadowUrl?: string;
    iconSize?: [number, number];
    iconAnchor?: [number, number];
    popupAnchor?: [number, number];
    [key: string]: any;
  }

  class LeafletMap {
    constructor(element: HTMLElement, options?: MapOptions);
    setView(center: [number, number], zoom?: number): this;
    panTo(latlng: [number, number]): this;
    setZoom(zoom: number): this;
    zoomIn(): this;
    zoomOut(): this;
    invalidateSize(): this;
    addControl(control: any): this;
    remove(): this;
  }

  class TileLayer {
    constructor(urlTemplate: string, options?: TileLayerOptions);
    addTo(map: LeafletMap): this;
  }

  class Marker {
    constructor(latlng: [number, number], options?: any);
    addTo(map: LeafletMap): this;
    bindPopup(content: string): this;
  }

  class Icon {
    constructor(options: IconOptions);
    static Default: {
      imagePath: string;
      prototype: { options: IconOptions };
    };
  }

  class Control {
    static Zoom: new (options?: { position?: string }) => any;
  }
}
