import { html } from '@symbiotejs/symbiote';

export const template = html`
<canvas ref="canvas"></canvas>
<div class="controls">
  <ims-button ${{'@icon': 'ppIcon', onclick: 'onPP'}}></ims-button>
  <span class="time">{{currentTime}} / {{totalTime}}</span>
  <ims-button icon="fs_on" ${{onclick: 'onFs'}}></ims-button>
</div>`;
