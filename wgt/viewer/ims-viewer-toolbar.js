import Symbiote, { html, css } from '@symbiotejs/symbiote';
export { ImsButton } from '../../lib/ims-button.js';

export class ImsViewerToolbar extends Symbiote {

  initCallback() {
    this.sub('^hasHistory', (val) => {
      this.hidden = !val;
    });
  }
}

ImsViewerToolbar.rootStyles = css`
ims-viewer-toolbar {
  position: absolute;
  display: inline-flex;
  gap: var(--ims-toolbar-gap, 5px);
  padding: var(--ims-toolbar-padding, 5px);
  z-index: 10000;
  top: var(--ims-viewer-toolbar-top, 10px);
  left: var(--ims-viewer-toolbar-left, 10px);
  transition: var(--ims-transition, 0.5s);
  background-color: var(--ims-toolbar-bg, rgba(0, 0, 0, .3));
  color: var(--color-fg, #fff);
  backdrop-filter: blur(4px);
  border-radius: var(--ims-toolbar-radius, 22px);
  &[hidden] {
    opacity: 0;
    pointer-events: none;
  }
}
`;

ImsViewerToolbar.template = html`
<ims-button ${{onclick: '^onBack'}} icon="arrow_left"></ims-button>
`;

ImsViewerToolbar.reg('ims-viewer-toolbar');
