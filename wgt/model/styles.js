import { css } from '@symbiotejs/symbiote';

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
  user-select: none;
  overflow: hidden;
  background-color: var(--color-bg);
  color: var(--color-fg);
  cursor: grab;
}
:host(:active) {
  cursor: grabbing;
}
:host([fullscreen]) {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
:host([no-ui]) ims-model-toolbar {
  display: none;
}

canvas {
  box-sizing: border-box;
  height: 100%;
  width: 100%;
}
slot {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  transition: var(--ims-transition, 0.2s);
}
`;
