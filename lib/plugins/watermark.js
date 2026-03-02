/**
 * Watermark plugin for IMS widgets.
 * Draws a text watermark on the canvas after each render.
 *
 * @param {Object} [options]
 * @param {string} [options.text] - Watermark text
 * @param {string} [options.font] - CSS font string
 * @param {string} [options.color] - Text color
 * @param {number} [options.opacity] - Watermark opacity (0-1)
 * @param {'top-left'|'top-right'|'bottom-left'|'bottom-right'|'center'} [options.position]
 * @returns {import('../ImsBaseClass.js').ImsPlugin}
 */
export function watermark(options = {}) {
  let {
    text = '© Watermark',
    font = '14px system-ui',
    color = 'rgba(255, 255, 255, 0.4)',
    opacity = 0.4,
    position = 'bottom-right',
  } = options;

  /** @param {import('../ImsBaseClass.js').ImsBaseClass} widget */
  function draw(widget) {
    let canvas = widget.canvas;
    if (!canvas) return;
    let ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.save();
    ctx.globalAlpha = opacity;
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textBaseline = 'middle';

    let metrics = ctx.measureText(text);
    let padding = 12;
    let x, y;

    switch (position) {
      case 'top-left':
        x = padding;
        y = padding + 10;
        break;
      case 'top-right':
        x = canvas.width - metrics.width - padding;
        y = padding + 10;
        break;
      case 'bottom-left':
        x = padding;
        y = canvas.height - padding;
        break;
      case 'center':
        x = (canvas.width - metrics.width) / 2;
        y = canvas.height / 2;
        break;
      case 'bottom-right':
      default:
        x = canvas.width - metrics.width - padding;
        y = canvas.height - padding;
    }

    ctx.fillText(text, x, y);
    ctx.restore();
  }

  return {
    name: 'watermark',
    onReady: draw,
    onResize: draw,
  };
}
