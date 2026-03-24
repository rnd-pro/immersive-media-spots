import { html } from '@symbiotejs/symbiote';
export { ImsMapToolbar } from './ims-map-toolbar.js';

export const template = html`
<div ref="mapContainer"></div>
<ims-map-toolbar ref="toolbar"></ims-map-toolbar>
<slot></slot>
`;
