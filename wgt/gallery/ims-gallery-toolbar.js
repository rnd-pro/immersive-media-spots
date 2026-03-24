import Symbiote, { html, css } from '@symbiotejs/symbiote';
export { ImsButton } from '../../lib/ims-button.js';
import { imsCtxName } from '../../lib/imsCtxName.js';

export class ImsGalleryToolbar extends Symbiote {

  init$ = {
    autoplayIcon: 'play',
  };

  initCallback() {
    this.sub('^autoplay', (val) => {
      this.$.autoplayIcon = val ? 'pause' : 'play';
    });
  }
}

ImsGalleryToolbar.rootStyles = css`
ims-gallery-toolbar {
  position: absolute;
  display: inline-flex;
  align-items: center;
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

  [counter] {
    font-size: 12px;
    padding: 0 6px;
    opacity: 0.8;
    white-space: nowrap;
    font-variant-numeric: tabular-nums;
  }
}
`;

ImsGalleryToolbar.template = html`
<ims-button ${{onclick: '^onPrev', '@disabled': '^prevDisabled'}} icon="left"></ims-button>
<span counter>{{^currentDisplay}} / {{^total}}</span>
<ims-button ${{onclick: '^onNext', '@disabled': '^nextDisabled'}} icon="right"></ims-button>
<ims-button ${{onclick: '^toggleAutoplay', '@icon': 'autoplayIcon'}}></ims-button>
<ims-button ${{onclick: '^onFs', '@icon': `${imsCtxName}/fsStateIcon`, '@hidden': `${imsCtxName}/fsHideUnsupported`}}></ims-button>
`;

ImsGalleryToolbar.reg('ims-gallery-toolbar');