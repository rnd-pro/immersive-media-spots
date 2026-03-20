# ims-audio

Audio player with waveform visualization.

## Tag

```html
<ims-audio src-data="path/to/data.json"></ims-audio>
```

## Attributes

| Attribute | Description |
|---|---|
| `src-data` | URL to JSON config |
| `lazy` | Enable lazy loading |
| `no-preloader` | Disable loading spinner |

## Config (`ImsAudioData`)

| Property | Type | Default | Description |
|---|---|---|---|
| `imsType` | `string` | `'audio'` | Widget type identifier |
| `srcList` | `string[]` | — | Audio file URL(s) |
| `autoplay` | `boolean` | `false` | Auto-play on load |
| `loop` | `boolean` | `false` | Loop playback |
| `waveformColor` | `string` | — | Waveform fill color |
| `progressColor` | `string` | — | Progress indicator color |
| `hideUi` | `boolean` | `false` | Hide toolbar |

## Public API

| Method | Description |
|---|---|
| `play()` | Start playback |
| `pause()` | Pause playback |
| `togglePlay()` | Toggle play/pause |
| `seek(seconds)` | Seek to position in seconds |
| `setVolume(val)` | Set volume (0–100) |
| `toggleMute()` | Toggle mute |

## Events

See [events.md](./events.md) for standard IMS lifecycle events.
