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
  }
  :host([no-ui]) {
    ims-map-toolbar {
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
  :host([active]:active) ims-map-toolbar {
    opacity: .2;
  }

  [ref="mapContainer"] {
    width: 100%;
    height: 100%;
  }

  .leaflet-container {
    width: 100%;
    height: 100%;
  }

  .ims-map-pin {
    background: none !important;
    border: none !important;
  }

  .ims-map-popup-label {
    margin-bottom: 4px;
  }

  .ims-map-popup-action {
    display: inline-block;
    font-weight: 600;
    color: var(--color-accent, #0078d4);
    text-decoration: none;
    cursor: pointer;

    &:hover {
      text-decoration: underline;
    }
  }
`;
