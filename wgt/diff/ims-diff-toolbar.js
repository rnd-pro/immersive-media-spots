import Symbiote, { html, css } from '@symbiotejs/symbiote';
export { ImsButton } from '../../lib/ims-button.js';
import { imsCtxName } from '../../lib/imsCtxName.js';

export class ImsDiffToolbar extends Symbiote {

  init$ = {
    modeIcon: 'layers',
    orientIcon: 'diff_horizontal',
    animIcon: 'play',
  };

  initCallback() {
    this.sub('^mode', (val) => {
      this.$.modeIcon = val === 'onion' ? 'layers' : 'compare';
    });
    this.sub('^animating', (val) => {
      this.$.animIcon = val ? 'pause' : 'play';
    });
  }
}

ImsDiffToolbar.rootStyles = css`
ims-diff-toolbar {
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

  [pair-nav] {
    display: contents;
    &[hidden] {
      display: none;
    }
  }

  ims-button[is-vertical] {
    transform: rotate(90deg);
  }
}
`;

ImsDiffToolbar.template = html`
<ims-button ${{onclick: '^toggleMode', '@icon': 'modeIcon'}}></ims-button>
<ims-button ${{onclick: '^toggleOrientation', '@icon': 'orientIcon', '@is-vertical': '^isVertical'}}></ims-button>
<ims-button ${{onclick: '^toggleAnimate', '@icon': 'animIcon'}}></ims-button>
<span pair-nav ${{'@hidden': '!^hasPairs'}}>
  <ims-button icon="left" ${{onclick: '^prevPair'}}></ims-button>
  <ims-button icon="right" ${{onclick: '^nextPair'}}></ims-button>
</span>
<ims-button ${{onclick: '^onFs', '@icon': `${imsCtxName}/fsStateIcon`}}></ims-button>
`;

ImsDiffToolbar.reg('ims-diff-toolbar');