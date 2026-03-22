import { css } from '@symbiotejs/symbiote';

export const styles = css`
:host {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  background-color: var(--color-bg);
  color: var(--color-fg);
  overflow: hidden;
  user-select: none;
}
canvas {
  width: 100%;
  height: 80px;
  cursor: pointer;
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

  canvas {
    flex: 1;
  }
}
`;
