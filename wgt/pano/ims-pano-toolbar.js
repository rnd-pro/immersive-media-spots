import Symbiote, { html, css } from '@symbiotejs/symbiote';
export { ImsButton } from '../../lib/ims-button.js';

export class ImsPanoToolbar extends Symbiote {
  init$ = {
    playStateIcon: 'play',
    fsStateIcon: 'fs_on',
  }

  initCallback() {
    this.sub('^fullscreen', (val) => {
      this.$.fsStateIcon = val ? 'fs_off' : 'fs_on';
    });
  }
}

ImsPanoToolbar.rootStyles = css`
ims-pano-toolbar {
  position: absolute;
  display: inline-flex;
  gap: var(--ims-toolbar-gap, 5px);
  background-color: var(--ims-toolbar-bg, rgba(0, 0, 0, 0.3));
  backdrop-filter: blur(4px);
  color: var(--color-fg, #fff);
  padding: var(--ims-toolbar-padding, 5px);
  z-index: 10000;
  left: 50%;
  transform: translateX(-50%);
  bottom: var(--ims-toolbar-bottom, 10px);
  border-radius: var(--ims-toolbar-radius, 22px);
  transition: var(--ims-transition, 0.5s);

  &:hover {
    background-color: var(--ims-toolbar-bg-hover, rgba(0, 0, 0, 0.6));
    box-shadow: var(--ims-toolbar-shadow, 0 2px 4px rgba(0, 0, 0, 0.2));
  }
}
`;

ImsPanoToolbar.template = html`
<ims-button ${{onclick: '^onPlayPause', '@icon': 'playStateIcon'}}></ims-button>
<ims-button ${{onclick: '^onFs', '@icon': 'fsStateIcon'}}></ims-button>
`;

ImsPanoToolbar.reg('ims-pano-toolbar');