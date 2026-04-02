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

## Widget Data (`ImsSpinnerData`)

```json
{
  "imsType": "spinner",
  "urlTemplate": "https://cdn.example.com/images/{UID}/{VARIANT}",
  "variants": ["120", "320", "640", "860", "1024", "1200", "2048"],
  "autoplay": true,
  "startFrame": 0,
  "isCycled": true,
  "speed": 50,
  "showCover": true,
  "coverUrl": "https://cdn.example.com/images/37acbe5d-ceb8-486e-98fb-4ef5e09a8800/640",
  "cdnIdList": [
    "37acbe5d-ceb8-486e-98fb-4ef5e09a8800",
    "fd79d5db-7cd4-42e1-4bbb-f80b4a84dc00",
    "..."
  ]
}
```

### Properties

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
