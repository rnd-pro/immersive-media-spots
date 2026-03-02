import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { validateConfig } from '../lib/validateConfig.js';

describe('validateConfig', () => {

  let dataRef = {
    imsType: 'spinner',
    version: '0.2.2',
    autoplay: false,
    speed: 50,
    cdnIdList: [],
    srcList: [],
    variants: [],
    urlTemplate: '',
  };

  it('should return no warnings for valid config', () => {
    let config = {
      imsType: 'spinner',
      version: '1.0.0',
      autoplay: true,
      speed: 80,
    };
    let warnings = validateConfig(config, dataRef, 'ims-spinner');
    assert.equal(warnings.length, 0);
  });

  it('should warn about unknown properties', () => {
    let config = {
      imsType: 'spinner',
      unknownProp: true,
    };
    let warnings = validateConfig(config, dataRef, 'ims-spinner');
    assert.equal(warnings.length, 1);
    assert.ok(warnings[0].includes('unknownProp'));
  });

  it('should warn about type mismatches', () => {
    let config = {
      imsType: 'spinner',
      autoplay: 'yes',
    };
    let warnings = validateConfig(config, dataRef, 'ims-spinner');
    assert.equal(warnings.length, 1);
    assert.ok(warnings[0].includes('Type mismatch'));
  });

  it('should detect array vs non-array mismatch', () => {
    let config = {
      imsType: 'spinner',
      cdnIdList: 'not-an-array',
    };
    let warnings = validateConfig(config, dataRef, 'ims-spinner');
    assert.equal(warnings.length, 1);
    assert.ok(warnings[0].includes('cdnIdList'));
  });

  it('should skip srcList from validation', () => {
    let config = {
      imsType: 'spinner',
      srcList: 'anything',
    };
    let warnings = validateConfig(config, dataRef, 'ims-spinner');
    assert.equal(warnings.length, 0);
  });

});
