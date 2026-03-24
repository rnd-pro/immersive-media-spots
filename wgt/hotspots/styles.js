import { css } from '@symbiotejs/symbiote';

export const styles = css`
:host {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 1000;
}

.spot {
  position: absolute;
  pointer-events: auto;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 20px;
  background: var(--ims-hotspot-bg, rgba(0, 0, 0, 0.6));
  backdrop-filter: blur(4px);
  color: var(--ims-hotspot-color, #fff);
  font-size: var(--ims-hotspot-font-size, 13px);
  font-family: var(--ims-font, system-ui, sans-serif);
  white-space: nowrap;
  transform: translate(-50%, -50%);
  transition: opacity 0.2s, transform 0.15s;
  opacity: 0;
  user-select: none;

  &[visible] {
    opacity: 1;
  }

  &::before {
    content: '';
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: var(--spot-accent, var(--ims-accent, #08f));
    flex-shrink: 0;
  }

  &:hover {
    transform: translate(-50%, -50%) scale(1.08);
    background: var(--ims-hotspot-bg-hover, rgba(0, 0, 0, 0.8));
  }

  &:active {
    transform: translate(-50%, -50%) scale(0.96);
  }
}
`;
