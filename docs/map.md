# ims-map

Interactive tile-based map widget powered by [Leaflet.js](https://leafletjs.com/) v2. Displays map tiles with optional markers. Markers support popups with interactive actions: opening URLs, navigating to other IMS scenes, calling widget API methods, and custom colors.

## Tag

```html
<ims-map src-data="path/to/data.json"></ims-map>
```

## Widget Data

```json
{
  "imsType": "map",
  "center": [48.8566, 2.3522],
  "zoom": 13,
  "markers": [
    { "lat": 48.8566, "lng": 2.3522, "label": "Paris" },
    { "lat": 48.8606, "lng": 2.3376, "label": "Louvre", "url": "https://www.louvre.fr" },
    { "lat": 48.8584, "lng": 2.2945, "label": "Eiffel Tower", "color": "#e74c3c", "api": { "setZoom": 16 } }
  ]
}
```

## Widget Data Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `center` | `[number, number]` | `[0, 0]` | Map center as `[lat, lng]` |
| `zoom` | `number` | `13` | Initial zoom level |
| `minZoom` | `number` | `1` | Minimum zoom level |
| `maxZoom` | `number` | `18` | Maximum zoom level |
| `tileUrl` | `string` | OpenStreetMap | Tile layer URL template |
| `markers` | `array` | `[]` | Array of marker objects |

### Marker Object

| Property | Type | Description |
|---|---|---|
| `lat` | `number` | Latitude |
| `lng` | `number` | Longitude |
| `label` | `string` | Popup text |
| `color` | `string` | Custom pin color (hex). Renders an SVG pin icon |
| `url` | `string` | URL to open in a new tab on action click |
| `targetSrcData` | `string` | Path to another IMS data file for scene navigation |
| `targetHotspotsData` | `string` | Path to hotspots data for the target scene |
| `action` | `string` | Name of a parent component method to call |
| `api` | `object` | Map of widget method names to arguments (e.g. `{ "panTo": [lat, lng], "setZoom": 16 }`) |

When a marker has any action field (`url`, `targetSrcData`, `action`, `api`), clicking the marker opens a popup containing the label and an action link (→). Clicking the link triggers the configured actions.

### Marker Actions

**Open URL** — opens an external link in a new tab:
```json
{ "lat": 48.86, "lng": 2.34, "label": "Louvre", "url": "https://www.louvre.fr" }
```

**Navigate to another IMS** — switches to a different widget scene (requires `ims-viewer` parent):
```json
{ "lat": 48.86, "lng": 2.34, "label": "Gallery →", "targetSrcData": "../gallery/data.json" }
```

**Call widget API** — executes map methods like `panTo` and `setZoom`:
```json
{ "lat": 48.86, "lng": 2.34, "label": "Zoom here", "api": { "panTo": [48.86, 2.34], "setZoom": 16 } }
```

## Public API

| Method | Description |
|---|---|
| `panTo(lat, lng)` | Pan the map to the given coordinates |
| `setZoom(level)` | Set the zoom level |

## Custom Tile Providers

Override the default OpenStreetMap tiles:

```json
{
  "imsType": "map",
  "center": [51.505, -0.09],
  "zoom": 13,
  "tileUrl": "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
}
```

## Styling

```css
ims-map {
  width: 640px;
  height: 400px;
}
```

Leaflet's CSS is loaded from CDN and injected into Shadow DOM via `adoptedStyleSheets`.

## Dependencies

- [Leaflet.js](https://leafletjs.com/) v2 — BSD 2-Clause license
- [OpenStreetMap](https://www.openstreetmap.org/) — default tile provider

## Attribution

When using the default OpenStreetMap tiles, attribution `© OpenStreetMap contributors` is **required** by the [ODbL license](https://www.openstreetmap.org/copyright). Custom tile providers may have their own attribution requirements.

Leaflet.js attribution is optional (BSD 2-Clause).

## Acknowledgments

Thanks to [Volodymyr Agafonkin](https://github.com/mourner) and the [Leaflet](https://leafletjs.com/) team for the excellent open-source mapping library, and to the [OpenStreetMap](https://www.openstreetmap.org/) community for providing free, open map data.

## Events

Standard lifecycle events are emitted (see [events.md](./events.md)).
