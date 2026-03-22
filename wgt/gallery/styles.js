import {css} from '@symbiotejs/symbiote';

export const styles = css`
  :host {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    max-height: 100vh;
    width: 100%;
    max-width: 100vw;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
    user-select: none;
    overflow: hidden;
    background-color: var(--color-bg);
    color: var(--color-fg);
  }
  
  :host([no-ui]) {
    ims-gallery-toolbar {
      display: none;
    }
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
  }

  canvas {
    box-sizing: border-box;
    height: 100%;
    width: 100%;
    object-fit: contain;
  }
`;
