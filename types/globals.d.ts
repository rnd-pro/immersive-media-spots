// Type definitions for interactive-media-spots

// --- Common Data Types ---

interface ImsBaseData {
  imsType: string;
  version: string;
  hideUi?: boolean;
  urlTemplate?: string;
  variants?: string[];
  maxVariantName?: string;
  cdnIdList?: string[];
  srcList?: string[];
  dispatchEvents?: boolean;
}

// --- Widget Data Types ---

interface ImsDiffData extends ImsBaseData {
  imsType: 'diff';
  startPosition?: number;
  filters?: string[];
}

interface ImsGalleryData extends ImsBaseData {
  imsType: 'gallery';
}

interface ImsPanoData extends ImsBaseData {
  imsType: 'pano';
  autoplay?: boolean;
  startPosition?: number;
  fov?: number;
}

interface ImsSpinnerData extends ImsBaseData {
  imsType: 'spinner';
  autoplay?: boolean;
  startFrame?: number;
  invertDirection?: boolean;
  isCycled?: boolean;
  motionBlur?: boolean;
  coverUrl?: string;
  showCover?: boolean;
  speed?: number;
  multiplePlay?: boolean;
}

interface ImsVideoData extends ImsBaseData {
  imsType: 'video';
  autoplay?: boolean;
  hlsSrc?: string;
  hlsSubtitles?: boolean;
  sources?: Array<Record<string, string>>;
  tracks?: Array<Record<string, string>>;
  coverUrl?: string;
  showCover?: boolean;
}

interface ImsModelData extends ImsBaseData {
  imsType: 'model';
  autoplay?: boolean;
  fov?: number;
  bgColor?: string;
  envMapIntensity?: number;
}

interface ImsAudioData extends ImsBaseData {
  imsType: 'audio';
  autoplay?: boolean;
  loop?: boolean;
  waveformColor?: string;
  progressColor?: string;
}

// --- Hotspots Data Types ---

interface HotspotVisibility {
  frame?: number | [number, number];
  image?: number | [number, number];
  yaw?: [number, number];
  pitch?: [number, number];
  time?: [number, number];
  share?: [number, number];
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
}

interface ImsHotspotsData {
  imsType: 'hotspots';
  version: string;
  spots: HotspotSpot[];
}

type ImsData = ImsDiffData | ImsGalleryData | ImsPanoData | ImsSpinnerData | ImsVideoData | ImsModelData | ImsAudioData | ImsHotspotsData;

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
