/** @type {Map<number, HTMLImageElement>} */
let cache = new Map();

/**
 * @param {number} idx
 * @returns {HTMLImageElement}
 */
export function createErrorPlaceholder(idx) {
  if (cache.has(idx)) {
    return cache.get(idx);
  }
  let size = 2048;
  let cvs = document.createElement('canvas');
  cvs.width = size;
  cvs.height = size;
  let ctx = cvs.getContext('2d');
  let color = getComputedStyle(document.documentElement).getPropertyValue('--color-fg').trim() || '#fff';
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.4;
  ctx.font = '90px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`⚠ Image loading error... (${idx})`, size / 2, size / 2);
  let img = new Image();
  img.src = cvs.toDataURL();
  cache.set(idx, img);
  return img;
}
