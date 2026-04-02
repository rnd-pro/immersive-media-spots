/**
 * 
 * @param {String[]} variants 
 * @param {Element} element 
 * @param {Number} [dpr] Device pixel ratio
 */
export function getVariantFit(variants, element, dpr = window.devicePixelRatio || 1) {
  let numberVars = variants.filter((vnt) => {
    return !Number.isNaN(parseFloat(vnt));
  }).map((v) => {
    return parseFloat(v);
  }).sort((a, b) => {
    return b - a;
  });
  /** @type {DOMRect} */
  let rect = element.getBoundingClientRect();
  let variantFit = numberVars.pop();
  let targetDimension = Math.max(rect.width, rect.height) * dpr;
  while (numberVars.length && (variantFit < targetDimension)) {
    variantFit = numberVars.pop();
  }
  return variantFit;
}