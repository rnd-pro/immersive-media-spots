# ims-map

Interactive tile-based map widget powered by [Leaflet.js](https://leafletjs.com/) v2. Displays map tiles with optional markers and popups.

## Tag

```html
<ims-map src-data="path/to/data.json"></ims-map>
```

## Config

```json
{
  "imsType": "map",
  "center": [48.8566, 2.3522],
  "zoom": 13,
  "markers": [
    { "lat": 48.8566, "lng": 2.3522, "label": "Paris" }
  ]
}
```

## Config Properties

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
| `label` | `string` | Popup text (shown on click) |

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
