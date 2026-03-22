import { css } from '@symbiotejs/symbiote';

export const shadowCss = css`
:host {
  display: block;
  position: relative;
  overflow: hidden;
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
