import Symbiote, { css } from '@symbiotejs/symbiote';

export class ImsPreloader extends Symbiote {}

ImsPreloader.rootStyles = css`
ims-preloader {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100000;
  pointer-events: none;
  transition: opacity 0.3s ease;

  &[hidden] {
    opacity: 0;
  }

  .spinner {
    width: var(--ui-size, 32px);
    height: var(--ui-size, 32px);
    border: 5px solid rgba(0, 0, 0, .1);
    border-top-color: var(--ims-accent, #fff);
    border-radius: 50%;
    animation: ims-spin 0.8s linear infinite;
  }

}
@keyframes ims-spin {
  to { transform: rotate(360deg); }
}
`;
ImsPreloader.template = /*html*/ `<div class="spinner"></div>`;
ImsPreloader.reg('ims-preloader');

export default ImsPreloader;
