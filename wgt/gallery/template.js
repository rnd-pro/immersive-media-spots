import { html } from '@symbiotejs/symbiote';
export { ImsGalleryToolbar} from './ims-gallery-toolbar.js';
export { ImsProgressBar } from '../../lib/ims-progress-bar.js';

export const template = html`
<canvas ref="canvas"></canvas>
<ims-progress-bar></ims-progress-bar>
<ims-gallery-toolbar ref="toolbar"></ims-gallery-toolbar>
<slot></slot>
`;
