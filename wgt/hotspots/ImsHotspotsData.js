/**
 * @typedef {Object} HotspotVisibility
 * @property {number | number[]} [frame] - Frame index or [start, end] range (spinner)
 * @property {number | number[]} [image] - Image index or [start, end] range (gallery)
 * @property {number[]} [yaw] - [min, max] yaw range in degrees (pano)
 * @property {number[]} [pitch] - [min, max] pitch range (pano)
 * @property {number[]} [time] - [start, end] time range in seconds (video)
 * @property {number[]} [share] - [min, max] slider position (diff)
 */

/**
 * @typedef {Object.<string, {x: number, y: number}>} HotspotKeyframes
 */

/**
 * @typedef {Object} HotspotSpot
 * @property {string} id
 * @property {string} label
 * @property {number} x - Normalized x (0…1)
 * @property {number} y - Normalized y (0…1)
 * @property {string} [targetSrcData] - Navigate to another IMS widget
 * @property {string} [targetHotspotsData] - Hotspots config for the target
 * @property {string} [url] - Open external URL
 * @property {string} [action] - Call method on host widget
 * @property {string} [emit] - Dispatch custom event
 * @property {HotspotVisibility} [visible] - Visibility rules
 * @property {HotspotKeyframes} [keyframes] - Position animation keyframes
 */

/**
 * @typedef {Object} ImsHotspotsData
 * @property {string} imsType - 'hotspots'
 * @property {string} version
 * @property {HotspotSpot[]} spots
 */

export default /** @type {ImsHotspotsData} */ ({
  imsType: 'hotspots',
  version: '',
  spots: [],
});
