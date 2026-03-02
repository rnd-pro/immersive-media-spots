import Symbiote, { html, css } from '@symbiotejs/symbiote';
export { ImsButton } from '../../lib/ims-button.js';
export { ImsRange } from '../../lib/ims-range.js';

export class ImsAudioToolbar extends Symbiote {}

ImsAudioToolbar.rootStyles = css`
ims-audio-toolbar {
  position: absolute;
  display: flex;
  align-items: center;
  gap: var(--ims-toolbar-gap, 5px);
  padding: var(--ims-toolbar-padding, 5px);
  color: var(--color-fg, #fff);
  background-color: var(--ims-toolbar-bg, rgba(0, 0, 0, 0.3));
  backdrop-filter: blur(4px);
  z-index: 10000;
  bottom: var(--ims-toolbar-bottom, 10px);
  border-radius: var(--ims-toolbar-radius, 22px);
  transition: var(--ims-transition, 0.5s);

  &:hover {
    background-color: var(--ims-toolbar-bg-hover, rgba(0, 0, 0, 0.6));
    box-shadow: var(--ims-toolbar-shadow, 0 2px 4px rgba(0, 0, 0, 0.2));
  }

  .tb-block {
    display: flex;
    align-items: center;
    gap: var(--ims-toolbar-gap, 5px);
  }

  .timer {
    font-family: var(--ims-font-mono, monospace);
    font-size: 12px;
    opacity: 0.7;
    flex: 1;
  }
}
`;

ImsAudioToolbar.template = html`
<ims-button ${{onclick: '^togglePlay', '@icon': '^ppIcon'}}></ims-button>
<div class="timer">{{^currentTime}} / {{^totalTime}}</div>
<div class="tb-block">
  <ims-button ${{onclick: '^toggleMute', '@icon': '^volIcon'}}></ims-button>
  <ims-range
    type="range"
    ${{onchange: '^onVolChange', value: '^volumeValue'}}></ims-range>
</div>
`;

ImsAudioToolbar.reg('ims-audio-toolbar');
