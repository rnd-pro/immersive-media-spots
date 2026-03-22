import { html } from '@symbiotejs/symbiote';
export { ImsViewerToolbar } from './ims-viewer-toolbar.js';

export const template = html`
<slot></slot>
<ims-viewer-toolbar ref="toolbar"></ims-viewer-toolbar>
`;
