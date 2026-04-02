# ims-hotspots

Interactive overlay with positioned spots bound to host widget state. Used for hypermedia navigation between IMS widgets.

## Tag

```html
<ims-hotspots src-data="path/to/hotspots.json"></ims-hotspots>
```

Placed as a child of any IMS widget (uses `<slot>`):

```html
<ims-spinner src-data="spinner.json">
  <ims-hotspots src-data="hotspots.json"></ims-hotspots>
</ims-spinner>
```

Or managed automatically by `ims-viewer`:

```html
<ims-viewer src-data="spinner.json" hotspots="hotspots.json"></ims-viewer>
```

## Widget Data

```json
{
  "imsType": "hotspots",
  "version": "1.0.0",
  "spots": [
    {
      "id": "interior",
      "label": "See interior →",
      "color": "#f40",
      "targetSrcData": "../pano/test-data.json",
      "targetHotspotsData": "../pano/pano-hotspots.json",
      "x": 0.7,
      "y": 0.4,
      "visible": { "frame": [20, 40] },
      "keyframes": {
        "20": { "x": 0.65, "y": 0.4 },
        "30": { "x": 0.7, "y": 0.38 },
        "40": { "x": 0.75, "y": 0.42 }
      }
    }
  ]
}
```

## Spot Properties

| Property | Type | Description |
|---|---|---|
| `id` | `string` | Unique spot identifier |
| `label` | `string` | Display text |
| `x` | `number` | Normalized x position (0…1) |
| `y` | `number` | Normalized y position (0…1) |
| `color` | `string` | Override mark dot color (any CSS color value) |
| `targetSrcData` | `string` | Navigate to another IMS widget (viewer handles this) |
| `targetHotspotsData` | `string` | Hotspot config for the target widget |
| `url` | `string` | Open external URL |
| `action` | `string` | Call method on host widget (e.g. `"pause"`) |
| `emit` | `string` | Dispatch custom event |
| `visible` | `object` | Visibility rules (see below) |
| `keyframes` | `object` | Position animation (see below) |
| `stateKey` | `string` | Which host state key drives keyframes (default: first key from host) |

## State-Bound Coordinates

Coordinates are normalized (0…1) relative to the widget's visual area.

Every widget exposes a `hotspotState` getter returning a keyed state object. The table below shows the state keys for each widget type:

| Widget | State Keys | Meaning |
|---|---|---|
| spinner | `frame` | Frame index |
| gallery | `image` | Image index |
| pano | `yaw`, `pitch` | Camera direction — yaw normalized to 0–360°, pitch clamped ±85° |
| diff | `share` | Slider position (0–100) |
| video | `time` | Playback seconds |
| audio | `time` | Playback seconds |
| model | `rotationX`, `rotationY` | Model rotation normalized to −π…π radians |

## Visibility Rules

Show/hide spots based on widget state:

```json
{ "frame": [10, 25] }     // visible frames 10–25
{ "image": 2 }            // image 2 only
{ "yaw": [170, 190] }     // camera direction range
{ "time": [15, 30] }      // time range in seconds
{ "share": [30, 70] }     // diff slider range (0–100)
{ "rotationY": [-1, 1] }  // model rotation range (radians)
```

Multiple keys can be combined — the spot is visible only when **all** conditions are met:

```json
{ "yaw": [170, 190], "pitch": [-10, 10] }
```

No `visible` property = always visible.

## Keyframe Animation

Interpolate position between keyed states:

```json
"keyframes": {
  "0":  { "x": 0.3, "y": 0.4 },
  "15": { "x": 0.6, "y": 0.35 },
  "30": { "x": 0.8, "y": 0.5 }
}
```

Keys = frame/image index, seconds, or other state value. Positions interpolate linearly.

For widgets with multiple state keys (e.g. pano has `yaw` and `pitch`), use the `stateKey` property to select which key drives the keyframes:

```json
{
  "id": "portal",
  "label": "Enter →",
  "x": 0.5,
  "y": 0.5,
  "stateKey": "yaw",
  "visible": { "yaw": [80, 120] },
  "keyframes": {
    "80":  { "x": 0.8, "y": 0.4 },
    "100": { "x": 0.5, "y": 0.45 },
    "120": { "x": 0.2, "y": 0.4 }
  }
}
```

## Custom Widget Integration

Any custom widget extending `ImsBaseClass` can support hotspots by implementing a `hotspotState` getter:

```js
get hotspotState() {
  return { myKey: this.someValue };
}
```

## CSS Custom Properties

| Property | Default | Description |
|---|---|---|
| `--ims-hotspot-bg` | `rgba(0,0,0,0.6)` | Spot background |
| `--ims-hotspot-bg-hover` | `rgba(0,0,0,0.8)` | Hover background |
| `--ims-hotspot-color` | `#fff` | Text color |
| `--ims-hotspot-font-size` | `13px` | Label font size |
| `--ims-accent` | `#08f` | Indicator dot color (global) |

Per-spot `color` property overrides `--ims-accent` for individual spots.

## Events

| Event | Detail | Description |
|---|---|---|
| `ims-hotspot-click` | `HotspotSpot` | Fired when a spot is clicked. Bubbles + composed. |
