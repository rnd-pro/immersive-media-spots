# ims-diff

Before/after image comparison with multiple modes.

## Tag

```html
<ims-diff src-data="path/to/data.json"></ims-diff>
```

## Attributes

| Attribute | Description |
|---|---|
| `src-data` | URL to JSON config |
| `lazy` | Enable lazy loading |
| `no-preloader` | Disable loading spinner |
| `vertical` | Set automatically when orientation is vertical |

## Config (`ImsDiffData`)

| Property | Type | Default | Description |
|---|---|---|---|
| `imsType` | `string` | `'diff'` | Widget type identifier |
| `srcList` | `string[]` | — | Image URLs (pairs for comparison) |
| `mode` | `string` | `'slider'` | Comparison mode: `'slider'` or `'onion'` |
| `orientation` | `string` | `'horizontal'` | Split orientation: `'horizontal'` or `'vertical'` |
| `startPosition` | `number` | `50` | Initial slider position (0–100) |
| `animateSpeed` | `number` | `2000` | Animated sweep duration (ms per full sweep) |
| `filters` | `string[]` | — | CSS filter strings per image |
| `hideUi` | `boolean` | `false` | Hide toolbar |
| `urlTemplate` | `string` | — | URL template with placeholders |
| `variants` | `string[]` | — | Available size variants |

## Comparison Modes

### Slider (default)
Drag to reveal — splits images with a movable divider line. In horizontal mode the split is left/right, in vertical mode it's top/bottom.

### Onion-skin
Overlays the second image on top of the first. Drag controls the opacity (0–1) of the overlay.

## Public API

| Method | Description |
|---|---|
| `setShare(percent)` | Set slider/opacity position (0–100) |
| `goTo(index)` | Switch to a specific diff pair (0-based) |
| `setMode(mode)` | Set mode: `'slider'` or `'onion'` |
| `toggleMode()` | Toggle between slider and onion |
| `toggleOrientation()` | Toggle horizontal/vertical split |
| `startAnimate()` | Start animated sweep |
| `stopAnimate()` | Stop animated sweep |
| `toggleAnimate()` | Toggle animated sweep |

## Toolbar

| Button | Action |
|---|---|
| Mode | Toggle slider ↔ onion |
| Orientation | Toggle horizontal ↔ vertical |
| Play/Pause | Toggle animated sweep |
| ◀ / ▶ | Previous/next pair (visible when `srcList > 2`) |
| Fullscreen | Toggle fullscreen |

## Events

See [events.md](./events.md) for standard IMS lifecycle events.
