# ims-gallery

Image gallery with navigation, crossfade transitions, and optional captions.

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

## Widget Data (`ImsGalleryData`)

```json
{
  "imsType": "gallery",
  "urlTemplate": "https://cdn.example.com/images/{UID}/{VARIANT}",
  "variants": ["120", "320", "640", "860", "1024", "1200", "2048"],
  "cdnIdList": [
    "37acbe5d-ceb8-486e-98fb-4ef5e09a8800",
    "352cb933-4604-41dc-957a-2c02b2305000",
    "0af30700-2327-4b33-dd29-2f56c124b900",
    "4a8df1f7-d023-413f-2a12-18d3cde77b00"
  ],
  "captions": [
    "Mountain landscape at sunrise",
    "Forest canopy from above",
    "Coastal cliffs and ocean waves",
    "Desert dunes under moonlight"
  ],
  "transitionDuration": 400,
  "autoplayInterval": 3000,
  "loop": true
}
```

### Properties

| Property | Type | Default | Description |
|---|---|---|---|
| `imsType` | `string` | `'gallery'` | Widget type identifier |
| `srcList` | `string[]` | — | Image URLs |
| `captions` | `string[]` | `[]` | Per-image captions (parallel to srcList) |
| `transitionDuration` | `number` | `300` | Crossfade duration in ms |
| `autoplayInterval` | `number` | `3000` | Autoplay slide interval in ms |
| `loop` | `boolean` | `true` | Wrap around at ends |
| `hideUi` | `boolean` | `false` | Hide toolbar |
| `urlTemplate` | `string` | — | URL template with placeholders |
| `variants` | `string[]` | — | Available size variants |

## Public API

| Method | Description |
|---|---|
| `goTo(index)` | Go to image by 0-based index |
| `next()` | Next image (wraps if `loop: true`) |
| `prev()` | Previous image (wraps if `loop: true`) |
| `startAutoplay()` | Start slideshow |
| `stopAutoplay()` | Stop slideshow |
| `toggleAutoplay()` | Toggle slideshow |

## Features

### Crossfade Transitions
Images crossfade using canvas globalAlpha blending. Duration controlled by `transitionDuration`.

### Touch Swipe
Horizontal swipe on the canvas triggers `next()`/`prev()`. Threshold: 50px.

### Image Counter
Toolbar shows current position (e.g. "3 / 12").

### Captions
Per-image captions from the `captions` config array are set as the widget's `title` attribute (browser tooltip). A `<slot>` element is available for custom caption components:

```html
<ims-gallery src-data="data.json">
  <my-custom-caption></my-custom-caption>
</ims-gallery>
```

### Autoplay
Timer-based auto-advance, toggleable from toolbar.

## Toolbar

| Button | Action |
|---|---|
| ◀ | Previous image |
| Counter | Shows position |
| ▶ | Next image |
| Play/Pause | Toggle autoplay |
| Fullscreen | Toggle fullscreen |

## Events

See [events.md](./events.md) for standard IMS lifecycle events.
