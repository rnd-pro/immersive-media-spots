import { css } from '@symbiotejs/symbiote';

export const styles = css`
:host {
  position: relative;
  display: flex;
  flex-direction: column;
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
.controls {
  display: flex;
  align-items: center;
  gap: var(--ui-gap, 4px);
  padding: var(--ui-padding, 4px 8px);
}
.time {
  font-family: var(--ims-font-mono, monospace);
  font-size: var(--ims-font-size, 12px);
  opacity: 0.7;
  flex: 1;
}
:host([fullscreen]) {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  canvas {
    flex: 1;
  }
}
`;
