import { html } from '@symbiotejs/symbiote';

export const template = html`
<canvas ref="canvas"></canvas>
<slot></slot>
<ims-model-toolbar ref="toolbar"></ims-model-toolbar>`;
