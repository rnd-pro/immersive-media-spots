import { html } from '@symbiotejs/symbiote';
export { ImsDiffToolbar } from './ims-diff-toolbar.js';
export { ImsProgressBar } from '../../lib/ims-progress-bar.js';

export const DIFF_TPL = html`
<div slider ref="slider"></div>
<canvas ref="canvas"></canvas>
<ims-progress-bar></ims-progress-bar>
<ims-diff-toolbar></ims-diff-toolbar>
`;
