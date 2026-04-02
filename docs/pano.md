# ims-pano

360° panorama viewer with WebGL rendering.

## Tag

```html
<ims-pano src-data="path/to/data.json"></ims-pano>
```

## Attributes

| Attribute | Description |
|---|---|
| `src-data` | URL to JSON config |
| `lazy` | Enable lazy loading |
| `no-preloader` | Disable loading spinner |

## Widget Data (`ImsPanoData`)

```json
{
  "imsType": "pano",
  "autoplay": false,
  "fov": 90,
  "urlTemplate": "https://cdn.example.com/images/{UID}/{VARIANT}",
  "variants": ["120", "320", "640", "860", "1024", "1200", "2048"],
  "maxVariantName": "max",
  "cdnIdList": ["eb698ef5-0eb6-48a1-1641-08862eae1700"]
}
```

### Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `imsType` | `string` | `'pano'` | Widget type identifier |
| `srcList` | `string[]` | — | Panorama image URL(s) |
| `autoplay` | `boolean` | `false` | Auto-rotate on load |
| `fov` | `number` | `80` | Field of view in degrees |
| `startPosition` | `number` | — | Initial view angle |
| `hideUi` | `boolean` | `false` | Hide toolbar |
| `urlTemplate` | `string` | — | URL template with placeholders |
| `variants` | `string[]` | — | Available size variants |

## Public API

| Method | Description |
|---|---|
| `lookAt(lon, lat)` | Set camera direction (degrees) |
| `setFov(deg)` | Set field of view (10–max) |
| `toggleAutoRotate()` | Toggle auto-rotation |

## Events

See [events.md](./events.md) for standard IMS lifecycle events.
