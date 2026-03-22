import { css } from '@symbiotejs/symbiote';

export const DIFF_STYLES = css`
  :host {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: var(--color-fg);
    background-color: var(--color-bg);
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center center;
    overflow: hidden;
    box-sizing: border-box;

    canvas {
      max-height: 100%;
      max-width: 100%;
      cursor: grab;

      &:active {
        cursor: grabbing;
      }
    }

    div[slider] {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 50%;
      width: 1px;
      background-color: var(--color-slider, rgba(0, 0, 0, .2));
      pointer-events: none;
    }
  }

  :host([vertical]) div[slider] {
    top: 50%;
    bottom: auto;
    left: 0;
    right: 0;
    width: auto;
    height: 1px;
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

`;