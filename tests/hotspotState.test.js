import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

/**
 * Pure-logic unit tests for the hotspot visibility and keyframe
 * algorithms. These mirror the private methods in ims-hotspots
 * so we can test the logic without a DOM.
 */

/**
 * @param {{ visible?: Record<string, any> }} def
 * @param {Record<string, number>} state
 * @returns {boolean}
 */
function checkVisibility(def, state) {
  if (!def.visible) return true;
  for (let [key, val] of Object.entries(def.visible)) {
    let stateVal = state[key];
    if (stateVal === undefined) continue;
    if (Array.isArray(val)) {
      if (stateVal < val[0] || stateVal > val[1]) return false;
    } else {
      if (Math.round(stateVal) !== val) return false;
    }
  }
  return true;
}

/**
 * @param {Record<string, { x: number, y: number }>} keyframes
 * @param {number} stateVal
 * @returns {{ x: number, y: number }}
 */
function interpolateKeyframes(keyframes, stateVal) {
  /** @type {Map<number, { x: number, y: number }>} */
  let map = new Map();
  for (let [k, v] of Object.entries(keyframes)) {
    map.set(Number(k), v);
  }
  let keys = [...map.keys()].sort((a, b) => a - b);
  if (!keys.length) return { x: 0, y: 0 };
  if (stateVal <= keys[0]) return map.get(keys[0]);
  if (stateVal >= keys[keys.length - 1]) return map.get(keys[keys.length - 1]);

  let lo = keys[0];
  let hi = keys[keys.length - 1];
  for (let i = 0; i < keys.length - 1; i++) {
    if (stateVal >= keys[i] && stateVal <= keys[i + 1]) {
      lo = keys[i];
      hi = keys[i + 1];
      break;
    }
  }

  let t = (stateVal - lo) / (hi - lo);
  let from = map.get(lo);
  let to = map.get(hi);
  return {
    x: from.x + (to.x - from.x) * t,
    y: from.y + (to.y - from.y) * t,
  };
}


// --- Visibility Tests ---

describe('checkVisibility – multi-key state', () => {

  it('always visible when no visible property', () => {
    assert.ok(checkVisibility({}, { frame: 10 }));
  });

  it('single key: frame range', () => {
    let def = { visible: { frame: [10, 25] } };
    assert.ok(checkVisibility(def, { frame: 15 }));
    assert.ok(!checkVisibility(def, { frame: 5 }));
    assert.ok(!checkVisibility(def, { frame: 30 }));
  });

  it('single key: exact match', () => {
    let def = { visible: { image: 2 } };
    assert.ok(checkVisibility(def, { image: 2 }));
    assert.ok(!checkVisibility(def, { image: 3 }));
    // Rounds to nearest integer
    assert.ok(checkVisibility(def, { image: 2.4 }));
    assert.ok(!checkVisibility(def, { image: 2.6 }));
  });

  it('multi-key: pano yaw + pitch (both must match)', () => {
    let def = { visible: { yaw: [170, 190], pitch: [-10, 10] } };
    assert.ok(checkVisibility(def, { yaw: 180, pitch: 0 }));
    assert.ok(!checkVisibility(def, { yaw: 180, pitch: 20 }));
    assert.ok(!checkVisibility(def, { yaw: 100, pitch: 0 }));
    assert.ok(!checkVisibility(def, { yaw: 100, pitch: 20 }));
  });

  it('video time range', () => {
    let def = { visible: { time: [15, 30] } };
    assert.ok(checkVisibility(def, { time: 20 }));
    assert.ok(!checkVisibility(def, { time: 10 }));
    assert.ok(!checkVisibility(def, { time: 35 }));
  });

  it('diff share range', () => {
    let def = { visible: { share: [30, 70] } };
    assert.ok(checkVisibility(def, { share: 50 }));
    assert.ok(!checkVisibility(def, { share: 10 }));
  });

  it('model rotation range', () => {
    let def = { visible: { rotationY: [-1, 1] } };
    assert.ok(checkVisibility(def, { rotationX: 0, rotationY: 0.5 }));
    assert.ok(!checkVisibility(def, { rotationX: 0, rotationY: 2 }));
  });

  it('ignores unknown keys gracefully', () => {
    let def = { visible: { frame: [0, 10] } };
    // Host has no frame key — condition is skipped, visible
    assert.ok(checkVisibility(def, { time: 5 }));
  });

  it('boundary values are inclusive', () => {
    let def = { visible: { time: [10, 20] } };
    assert.ok(checkVisibility(def, { time: 10 }));
    assert.ok(checkVisibility(def, { time: 20 }));
  });
});


// --- Keyframe Tests ---

describe('interpolateKeyframes', () => {

  let kf = {
    '0':  { x: 0.0, y: 0.0 },
    '10': { x: 1.0, y: 1.0 },
  };

  it('clamps to first keyframe below range', () => {
    let pos = interpolateKeyframes(kf, -5);
    assert.deepEqual(pos, { x: 0, y: 0 });
  });

  it('clamps to last keyframe above range', () => {
    let pos = interpolateKeyframes(kf, 15);
    assert.deepEqual(pos, { x: 1, y: 1 });
  });

  it('interpolates linearly at midpoint', () => {
    let pos = interpolateKeyframes(kf, 5);
    assert.equal(pos.x, 0.5);
    assert.equal(pos.y, 0.5);
  });

  it('interpolates at exact keyframe', () => {
    let pos = interpolateKeyframes(kf, 0);
    assert.deepEqual(pos, { x: 0, y: 0 });
    pos = interpolateKeyframes(kf, 10);
    assert.deepEqual(pos, { x: 1, y: 1 });
  });

  it('handles three keyframes', () => {
    let kf3 = {
      '0':  { x: 0, y: 0 },
      '10': { x: 0.5, y: 0.5 },
      '20': { x: 1, y: 0 },
    };
    let pos = interpolateKeyframes(kf3, 15);
    assert.equal(pos.x, 0.75);
    assert.equal(pos.y, 0.25);
  });

  it('returns origin for empty keyframes', () => {
    let pos = interpolateKeyframes({}, 5);
    assert.deepEqual(pos, { x: 0, y: 0 });
  });

  it('handles float keys like "1.0" without crash', () => {
    let kfFloat = {
      '1.0': { x: 0.8, y: 0.5 },
      '1.5': { x: 0.7, y: 0.45 },
      '2.0': { x: 0.6, y: 0.5 },
    };
    let pos = interpolateKeyframes(kfFloat, 1.0);
    assert.deepEqual(pos, { x: 0.8, y: 0.5 });
    pos = interpolateKeyframes(kfFloat, 1.25);
    assert.equal(pos.x, 0.75);
    pos = interpolateKeyframes(kfFloat, 2.0);
    assert.deepEqual(pos, { x: 0.6, y: 0.5 });
  });
});
