# ims-gallery

Image gallery with navigation controls.

## Tag

```html
<ims-gallery src-data="path/to/data.json"></ims-gallery>
```

## Attributes

| Attribute | Description |
|---|---|
| `src-data` | URL to JSON config |
| `lazy` | Enable lazy loading |
| `no-preloader` | Disable loading spinner |

## Config (`ImsGalleryData`)

| Property | Type | Default | Description |
|---|---|---|---|
| `imsType` | `string` | `'gallery'` | Widget type identifier |
| `srcList` | `string[]` | — | Image URLs |
| `hideUi` | `boolean` | `false` | Hide toolbar |
| `urlTemplate` | `string` | — | URL template with placeholders |
| `variants` | `string[]` | — | Available size variants |

## Public API

| Method | Description |
|---|---|
| `goTo(index)` | Navigate to image by index (0-based) |
| `next()` | Show next image |
| `prev()` | Show previous image |

## Events

See [events.md](./events.md) for standard IMS lifecycle events.
