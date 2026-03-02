import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { getVariantFit } from '../lib/getVariantFit.js';

/**
 * Mock element with getBoundingClientRect
 * @param {number} width
 * @returns {any}
 */
function mockElement(width) {
  return {
    getBoundingClientRect: () => ({ width, height: width * 0.75 }),
  };
}

describe('getVariantFit', () => {

  it('should return the smallest variant for small elements', () => {
    let result = getVariantFit(['320', '640', '1024'], mockElement(200), 1);
    assert.equal(result, 320);
  });

  it('should return a larger variant when element is wider', () => {
    let result = getVariantFit(['320', '640', '1024'], mockElement(500), 1);
    assert.equal(result, 640);
  });

  it('should return the largest variant for very wide elements', () => {
    let result = getVariantFit(['320', '640', '1024'], mockElement(2000), 1);
    assert.equal(result, 1024);
  });

  it('should account for device pixel ratio', () => {
    let result = getVariantFit(['320', '640', '1024'], mockElement(400), 2);
    assert.equal(result, 1024);
  });

  it('should handle single variant', () => {
    let result = getVariantFit(['640'], mockElement(800), 1);
    assert.equal(result, 640);
  });

  it('should handle unsorted variants', () => {
    let result = getVariantFit(['1024', '320', '640'], mockElement(500), 1);
    assert.equal(result, 640);
  });

  it('should filter out non-numeric variants', () => {
    let result = getVariantFit(['320', 'max', '640', '1024'], mockElement(500), 1);
    assert.equal(result, 640);
  });

});
