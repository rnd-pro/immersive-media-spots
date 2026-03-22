import { css } from '@symbiotejs/symbiote';

export const shadowCss = css`
:host {
  display: block;
  position: relative;
  overflow: hidden;
}

:host([fullscreen]) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  max-width: none !important;
  max-height: none !important;
  z-index: 999999;

  ::slotted(*) {
    width: 100% !important;
    height: 100% !important;
    max-width: none !important;
    max-height: none !important;
  }
}

::slotted(*) {
  transition: opacity var(--ims-transition, .3s);
}

::slotted([fading-out]) {
  opacity: 0;
}

::slotted([fading-in]) {
  opacity: 0;
}
`;
