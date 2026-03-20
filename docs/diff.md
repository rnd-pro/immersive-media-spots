# ims-diff

Before/after image comparison with interactive slider.

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

## Config (`ImsDiffData`)

| Property | Type | Default | Description |
|---|---|---|---|
| `imsType` | `string` | `'diff'` | Widget type identifier |
| `srcList` | `string[]` | — | Image URLs (pairs for comparison) |
| `startPosition` | `number` | — | Initial slider position |
| `filters` | `string[]` | — | CSS filter strings per image |
| `hideUi` | `boolean` | `false` | Hide toolbar |
| `urlTemplate` | `string` | — | URL template with placeholders |
| `variants` | `string[]` | — | Available size variants |

## Public API

| Method | Description |
|---|---|
| `setShare(percent)` | Set slider split position (0–100) |
| `goTo(index)` | Switch to a specific diff pair (0-based) |

## Events

See [events.md](./events.md) for standard IMS lifecycle events.
