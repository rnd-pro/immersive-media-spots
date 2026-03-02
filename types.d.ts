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

// --- Utility Functions ---

export function dataToImage(data: any, coverUrl?: string): Promise<string>;
export function imageToData(url: string): Promise<any>;

// --- Widget Classes ---

import Symbiote from '@symbiotejs/symbiote';

export declare class ImsBaseClass extends Symbiote {
  srcData: ImsData;
  override: Record<string, any>;
  onResize(): void;
  fillSrcVariantList(): void;
  init(): void;
}

export declare class ImsDiff extends ImsBaseClass {
  srcData: ImsDiffData;
}

export declare class ImsGallery extends ImsBaseClass {
  srcData: ImsGalleryData;
}

export declare class ImsPano extends ImsBaseClass {
  srcData: ImsPanoData;
}

export declare class ImsSpinner extends ImsBaseClass {
  srcData: ImsSpinnerData;
  play(): void;
  pause(): void;
  togglePlay(): void;
  kill(): void;
  currentFrame: number;
}

export declare class ImsVideo extends ImsBaseClass {
  srcData: ImsVideoData;
  togglePlay(): void;
  toggleCaptions(): void;
  toggleSound(): void;
  setVolume(val: number): void;
}

export declare class ImsViewer extends Symbiote {}

export declare class ImsModel extends ImsBaseClass {
  srcData: ImsModelData;
}

export declare class ImsAudio extends ImsBaseClass {
  srcData: ImsAudioData;
  togglePlay(): void;
}

export declare class ImsStory extends Symbiote {}

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
  onInit?(widget: ImsBaseClass): void;
  onReady?(widget: ImsBaseClass): void;
  onResize?(widget: ImsBaseClass): void;
  onDestroy?(widget: ImsBaseClass): void;
  onRender?(widget: ImsBaseClass, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void;
}

export declare function watermark(options: {
  text: string;
  font?: string;
  color?: string;
  opacity?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
}): ImsPlugin;

export declare function analytics(options: {
  handler: (event: { type: string; widget: string; detail?: any }) => void;
  trackResize?: boolean;
}): ImsPlugin;
