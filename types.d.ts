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

export interface ImsDiffData extends ImsBaseData {
  imsType: 'diff';
  startPosition?: number;
  filters?: string[];
}

export interface ImsGalleryData extends ImsBaseData {
  imsType: 'gallery';
}

export interface ImsPanoData extends ImsBaseData {
  imsType: 'pano';
  autoplay?: boolean;
  startPosition?: number;
  fov?: number;
}

export interface ImsSpinnerData extends ImsBaseData {
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

export interface ImsVideoData extends ImsBaseData {
  imsType: 'video';
  autoplay?: boolean;
  hlsSrc?: string;
  hlsSubtitles?: boolean;
  sources?: Array<Record<string, string>>;
  tracks?: Array<Record<string, string>>;
  coverUrl?: string;
  showCover?: boolean;
}

export interface ImsModelData extends ImsBaseData {
  imsType: 'model';
  autoplay?: boolean;
  fov?: number;
  bgColor?: string;
  envMapIntensity?: number;
}

export interface ImsAudioData extends ImsBaseData {
  imsType: 'audio';
  autoplay?: boolean;
  loop?: boolean;
  waveformColor?: string;
  progressColor?: string;
}

export type ImsData = ImsDiffData | ImsGalleryData | ImsPanoData | ImsSpinnerData | ImsVideoData | ImsModelData | ImsAudioData;

// --- Events ---

export declare const ImsEvents: {
  LOAD: 'ims-load';
  READY: 'ims-ready';
  ERROR: 'ims-error';
  RESIZE: 'ims-resize';
  DESTROY: 'ims-destroy';
};

// --- Plugins ---

export interface ImsPlugin {
  name: string;
  onInit?(widget: any): void;
  onReady?(widget: any): void;
  onResize?(widget: any): void;
  onDestroy?(widget: any): void;
  onRender?(widget: any, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void;
}
