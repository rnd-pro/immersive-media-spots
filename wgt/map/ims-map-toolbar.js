import Symbiote, { html, css } from '@symbiotejs/symbiote';
export { ImsButton } from '../../lib/ims-button.js';
import { imsCtxName } from '../../lib/imsCtxName.js';

export class ImsMapToolbar extends Symbiote {}

ImsMapToolbar.rootStyles = css`
ims-map-toolbar {
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

ImsMapToolbar.template = html`
<ims-button icon="zoom_in" ${{onclick: '^onZoomIn'}}></ims-button>
<ims-button icon="zoom_out" ${{onclick: '^onZoomOut'}}></ims-button>
<ims-button ${{onclick: '^onFs', '@icon': `${imsCtxName}/fsStateIcon`, '@hidden': `${imsCtxName}/fsHideUnsupported`}}></ims-button>
`;

ImsMapToolbar.reg('ims-map-toolbar');
