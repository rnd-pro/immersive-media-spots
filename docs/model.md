# ims-model

3D model viewer with GLTF/GLB support.

## Tag

```html
<ims-model src-data="path/to/data.json"></ims-model>
```

## Attributes

| Attribute | Description |
|---|---|
| `src-data` | URL to JSON config |
| `lazy` | Enable lazy loading |
| `no-preloader` | Disable loading spinner |

## Config (`ImsModelData`)

| Property | Type | Default | Description |
|---|---|---|---|
| `imsType` | `string` | `'model'` | Widget type identifier |
| `srcList` | `string[]` | — | Model file URL(s) (GLTF/GLB) |
| `autoplay` | `boolean` | `true` | Auto-rotate on load |
| `fov` | `number` | `45` | Camera field of view |
| `bgColor` | `string` | — | Background color (CSS color string) |
| `envMapIntensity` | `number` | — | Environment map intensity |
| `hideUi` | `boolean` | `false` | Hide toolbar |
| `urlTemplate` | `string` | — | URL template with placeholders |
| `variants` | `string[]` | — | Available size variants |

## Public API

| Method | Description |
|---|---|
| `resetCamera()` | Reset camera to initial position |
| `setRotation(x, y)` | Set model rotation (radians) |
| `toggleAutoRotate()` | Toggle auto-rotation |

## Events

See [events.md](./events.md) for standard IMS lifecycle events.
