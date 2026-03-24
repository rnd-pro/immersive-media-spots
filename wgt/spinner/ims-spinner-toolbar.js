import Symbiote, { html, css } from '@symbiotejs/symbiote';
export { ImsButton } from '../../lib/ims-button.js';
import { imsCtxName } from '../../lib/imsCtxName.js';

export class ImsSpinnerToolbar extends Symbiote {
  init$ = {
    playStateIcon: 'play',
    stopIconDisabled: true,
    zoomStateIcon: 'zoom_in',
  };
}

ImsSpinnerToolbar.rootStyles = css`
ims-spinner-toolbar {
  position: absolute;
  display: inline-flex;
  gap: var(--ims-toolbar-gap, 5px);
  background-color: var(--ims-toolbar-bg, rgba(0, 0, 0, 0.3));
  backdrop-filter: blur(4px);
  color: var(--color-fg, #fff);
  padding: var(--ims-toolbar-padding, 5px);
  z-index: 10000;
  bottom: var(--ims-toolbar-bottom, 10px);
  border-radius: var(--ims-toolbar-radius, 22px);
  transition: var(--ims-transition, 0.5s);

  &:hover {
    background-color: var(--ims-toolbar-bg-hover, rgba(0, 0, 0, 0.6));
    box-shadow: var(--ims-toolbar-shadow, 0 2px 4px rgba(0, 0, 0, 0.2));
  }
}
`;

ImsSpinnerToolbar.template = html`
<ims-button ${{onclick: '^onPlayPause', '@icon': 'playStateIcon'}}></ims-button>
<ims-button ${{onclick: '^onStop', '@disabled': 'stopIconDisabled'}} icon="stop"></ims-button>
<ims-button ${{onclick: '^onZoomIn'}} icon="zoom_in"></ims-button>
<ims-button ${{onclick: '^onZoomOut'}} icon="zoom_out"></ims-button>
<ims-button ${{onclick: '^onFs', '@icon': `${imsCtxName}/fsStateIcon`, '@hidden': `${imsCtxName}/fsHideUnsupported`}}></ims-button>
`;

ImsSpinnerToolbar.reg('ims-spinner-toolbar');