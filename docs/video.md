# ims-video

Video player with HLS support, captions, and custom controls.

## Tag

```html
<ims-video src-data="path/to/data.json"></ims-video>
```

## Attributes

| Attribute | Description |
|---|---|
| `src-data` | URL to JSON config |
| `lazy` | Enable lazy loading |
| `no-preloader` | Disable loading spinner |
| `autoplay` | Auto-play (passed to video element) |
| `loop` | Loop playback (passed to video element) |
| `muted` | Start muted (passed to video element) |

## Config (`ImsVideoData`)

| Property | Type | Default | Description |
|---|---|---|---|
| `imsType` | `string` | `'video'` | Widget type identifier |
| `sources` | `object[]` | — | Video source descriptors (`{ src, type }`) |
| `hlsSrc` | `string` | — | HLS stream URL |
| `hlsSubtitles` | `boolean` | `false` | Enable HLS subtitles |
| `tracks` | `object[]` | — | Text track descriptors (`{ src, kind, srclang, label }`) |
| `coverUrl` | `string` | — | Poster image URL |
| `hideUi` | `boolean` | `false` | Hide custom controls |
| `autoplay` | `boolean` | `false` | Auto-play config |
| `urlTemplate` | `string` | — | URL template with placeholders |
| `variants` | `string[]` | — | Available size variants |

## Public API

| Method | Description |
|---|---|
| `play()` | Start playback |
| `pause()` | Pause playback |
| `seek(seconds)` | Seek to position in seconds |
| `togglePlay()` | Toggle play/pause |
| `toggleCaptions()` | Toggle captions on/off |
| `toggleSound()` | Toggle mute |
| `setVolume(val)` | Set volume (0–100) |

## Events

See [events.md](./events.md) for standard IMS lifecycle events.
