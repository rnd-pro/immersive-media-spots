// Type definitions for interactive-media-spots

// --- Widget Data Types (re-exported from source classes) ---

type ImsDiffData = import('../wgt/diff/ImsDiffData.js').ImsDiffData;
type ImsGalleryData = import('../wgt/gallery/ImsGalleryData.js').ImsGalleryData;
type ImsPanoData = import('../wgt/pano/ImsPanoData.js').ImsPanoData;
type ImsSpinnerData = import('../wgt/spinner/ImsSpinnerData.js').ImsSpinnerData;
type ImsVideoData = import('../wgt/video/ImsVideoData.js').ImsVideoData;
type ImsModelData = import('../wgt/model/ImsModelData.js').ImsModelData;
type ImsAudioData = import('../wgt/audio/ImsAudioData.js').ImsAudioData;
type ImsMapData = import('../wgt/map/ImsMapData.js').ImsMapData;

// --- Map Marker Type ---

interface ImsMapMarker {
  lat: number;
  lng: number;
  label?: string;
  color?: string;
  url?: string;
  targetSrcData?: string;
  targetHotspotsData?: string;
  action?: string;
  api?: Record<string, any>;
}

// --- Hotspots Data Types ---

interface HotspotVisibility {
  frame?: number | [number, number];
  image?: number | [number, number];
  yaw?: [number, number];
  pitch?: [number, number];
  time?: [number, number];
  share?: [number, number];
  rotationX?: [number, number];
  rotationY?: [number, number];
}

interface HotspotKeyframes {
  [key: string]: { x: number; y: number };
}

interface HotspotSpot {
  id: string;
  label: string;
  x: number;
  y: number;
  color?: string;
  targetSrcData?: string;
  targetHotspotsData?: string;
  url?: string;
  action?: string;
  emit?: string;
  visible?: HotspotVisibility;
  keyframes?: HotspotKeyframes;
  stateKey?: string;
}

interface ImsHotspotsData {
  imsType: 'hotspots';
  version: string;
  spots: HotspotSpot[];
}

type ImsData = ImsDiffData | ImsGalleryData | ImsPanoData | ImsSpinnerData | ImsVideoData | ImsModelData | ImsAudioData | ImsMapData | ImsHotspotsData;

// --- Events ---

declare const ImsEvents: {
  LOAD: 'ims-load';
  READY: 'ims-ready';
  ERROR: 'ims-error';
  RESIZE: 'ims-resize';
  DESTROY: 'ims-destroy';
};

// --- Plugins ---

interface ImsPlugin {
  name: string;
  onInit?(widget: any): void;
  onReady?(widget: any): void;
  onResize?(widget: any): void;
  onDestroy?(widget: any): void;
  onRender?(widget: any, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void;
}
