# ims-spinner

360° product viewer with frame-by-frame image sequences.

## Tag

```html
<ims-spinner src-data="path/to/data.json"></ims-spinner>
```

## Attributes

| Attribute | Description |
|---|---|
| `src-data` | URL to JSON config |
| `lazy` | Enable lazy loading (IntersectionObserver) |
| `no-preloader` | Disable loading spinner |

## Config (`ImsSpinnerData`)

| Property | Type | Default | Description |
|---|---|---|---|
| `imsType` | `string` | `'spinner'` | Widget type identifier |
| `srcList` | `string[]` | — | Frame image URLs |
| `autoplay` | `boolean` | `false` | Start playing on load |
| `startFrame` | `number` | `0` | Initial frame index |
| `invertDirection` | `boolean` | `false` | Reverse drag direction |
| `showCover` | `boolean` | `false` | Show cover image before interaction |
| `coverUrl` | `string` | — | Custom cover image URL |
| `speed` | `number` | `50` | Playback interval (ms) |
| `multiplePlay` | `boolean` | `false` | Allow multiple spinners to play simultaneously |
| `hideUi` | `boolean` | `false` | Hide toolbar |
| `urlTemplate` | `string` | — | URL template with `{UID}` and `{VARIANT}` placeholders |
| `variants` | `string[]` | — | Available size variants |

## Public API

| Method | Description |
|---|---|
| `play()` | Start playback |
| `pause()` | Pause playback |
| `togglePlay()` | Toggle play/pause |
| `goToFrame(n)` | Jump to frame index (0-based) |
| `kill()` | Stop playback and reset loading state |
| `currentFrame` | Get/set current frame index |

## Events

See [events.md](./events.md) for standard IMS lifecycle events.
