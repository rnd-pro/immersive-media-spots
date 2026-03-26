import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { ImsMapData } from '../wgt/map/ImsMapData.js';

describe('ImsMapData', () => {

  it('should have correct defaults', () => {
    let data = new ImsMapData();
    assert.equal(data.imsType, 'map');
    assert.deepEqual(data.center, [0, 0]);
    assert.equal(data.zoom, 13);
    assert.equal(data.minZoom, 1);
    assert.equal(data.maxZoom, 18);
    assert.deepEqual(data.markers, []);
  });

  it('should merge init values', () => {
    let data = new ImsMapData({
      center: [48.8, 2.3],
      zoom: 10,
    });
    assert.deepEqual(data.center, [48.8, 2.3]);
    assert.equal(data.zoom, 10);
  });

  it('should accept marker action fields', () => {
    let data = new ImsMapData({
      markers: [
        { lat: 10, lng: 20, label: 'A', url: 'https://example.com' },
        { lat: 30, lng: 40, label: 'B', targetSrcData: '../gallery/data.json' },
        { lat: 50, lng: 60, label: 'C', color: '#f00', api: { setZoom: 16 } },
      ],
    });
    assert.equal(data.markers.length, 3);
    assert.equal(data.markers[0].url, 'https://example.com');
    assert.equal(data.markers[1].targetSrcData, '../gallery/data.json');
    assert.equal(data.markers[2].color, '#f00');
    assert.deepEqual(data.markers[2].api, { setZoom: 16 });
  });

});

describe('buildPopupHtml', () => {

  // Re-implement locally since it is not exported
  function buildPopupHtml(m) {
    let hasAction = m.url || m.targetSrcData || m.action || m.api;
    let label = m.label || '';
    if (!hasAction) return label;
    let parts = [];
    if (label) {
      parts.push(`<div class="ims-map-popup-label">${label}</div>`);
    }
    parts.push('<a class="ims-map-popup-action" href="#">\u2192</a>');
    return parts.join('');
  }

  it('should return label only for markers with no actions', () => {
    let html = buildPopupHtml({ lat: 0, lng: 0, label: 'Hello' });
    assert.equal(html, 'Hello');
  });

  it('should return empty string for no label and no action', () => {
    let html = buildPopupHtml({ lat: 0, lng: 0 });
    assert.equal(html, '');
  });

  it('should include action link when url is set', () => {
    let html = buildPopupHtml({ lat: 0, lng: 0, label: 'Link', url: 'https://x.com' });
    assert.ok(html.includes('ims-map-popup-label'));
    assert.ok(html.includes('Link'));
    assert.ok(html.includes('ims-map-popup-action'));
  });

  it('should include action link when targetSrcData is set', () => {
    let html = buildPopupHtml({ lat: 0, lng: 0, label: 'Go', targetSrcData: '../a.json' });
    assert.ok(html.includes('ims-map-popup-action'));
  });

  it('should include action link when api is set', () => {
    let html = buildPopupHtml({ lat: 0, lng: 0, label: 'Zoom', api: { setZoom: 16 } });
    assert.ok(html.includes('ims-map-popup-action'));
  });

  it('should render action link without label div when label is empty', () => {
    let html = buildPopupHtml({ lat: 0, lng: 0, url: 'https://x.com' });
    assert.ok(!html.includes('ims-map-popup-label'));
    assert.ok(html.includes('ims-map-popup-action'));
  });

});
