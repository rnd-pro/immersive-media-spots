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
