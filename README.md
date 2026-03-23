[![npm version](https://badge.fury.io/js/immersive-media-spots.svg)](https://badge.fury.io/js/immersive-media-spots)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

# IMS — Immersive Media Spots

<img src="https://rnd-pro.com/svg/ims/index.svg" width="200" alt="IMS: Immersive Media Spots">

**Simple web components that turn static pages into immersive, interactive media experiences.** Drop a single HTML tag — get a full-featured 360° spinner, panorama viewer, image comparison slider, or video player.

## ✨ Why IMS?

- **One tag — one widget.** Just `<ims-viewer src-data="data.json">` and you're done.
- **Universal.** Works in any stack: vanilla HTML, React, Vue, Angular, Svelte — anything that renders DOM.
- **Smart loading.** Adaptive resolution based on viewport & DPI, lazy loading via IntersectionObserver, on-demand dependency imports.
- **Hypermedia navigation.** Link widgets together with interactive hotspots — let users explore 3D products, then dive into 360° interiors, then watch a demo video, all in one seamless flow.
- **Themeable.** Full CSS custom properties for colors, sizing, and layout. No CSS framework lock-in.
- **Lightweight.** Built on [Symbiote.js](https://github.com/nicothed/symbiote.js) — each widget loads only what it needs.

## 🧩 Widgets

| Widget | Description | Docs |
|--------|-------------|------|
| **ims-spinner** | 360° product viewer with frame-by-frame rotation, autoplay, and drag interaction | [→ docs](./docs/spinner.md) |
| **ims-gallery** | Touch-friendly image gallery with navigation, looping, and fullscreen | [→ docs](./docs/gallery.md) |
| **ims-diff** | Before/after image comparison with a draggable slider | [→ docs](./docs/diff.md) |
| **ims-pano** | 360° panorama with inertia-based pan, zoom, and auto-rotation (Three.js) | [→ docs](./docs/pano.md) |
| **ims-model** | 3D model viewer for GLTF/GLB with orbit controls and auto-rotation (Three.js) | [→ docs](./docs/model.md) |
| **ims-video** | Video player with HLS adaptive streaming, subtitles, and quality switching | [→ docs](./docs/video.md) |
| **ims-audio** | Audio player with real-time waveform visualization (Web Audio API) | [→ docs](./docs/audio.md) |
| **ims-hotspots** | Interactive overlay spots with state-bound positioning and keyframe animation | [→ docs](./docs/hotspots.md) |
| **ims-viewer** | Universal loader — auto-imports any widget by type with version control, manages hotspot navigation and history | [→ docs](./docs/viewer.md) |

## 🚀 Quick Start

**1.** Set up [dependencies](./docs/dependencies.md) — add an importmap or install via npm (only Symbiote.js is required; Three.js and hls.js are needed only for the widgets that use them)

**2. Load the viewer** (it pulls widget code on demand):

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/immersive-media-spots@<VERSION>/viewer/+esm"></script>
```

**3. Use it:**

```html
<ims-viewer src-data="./product.json"></ims-viewer>
```

That's it. The viewer reads `imsType` from `product.json` and dynamically imports the right widget.

### Direct widget usage

Skip the viewer and load a specific widget directly:

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/immersive-media-spots@<VERSION>/spinner/+esm"></script>

<ims-spinner src-data="./data.json" autoplay="true"></ims-spinner>
```

### npm

```bash
npm install immersive-media-spots
```

## 🔗 Hypermedia Navigation

Combine `ims-viewer` with `ims-hotspots` to create connected experiences:

```html
<ims-viewer
  src-data="./exterior-spin.json"
  url-template="./{{imsType}}/index.js"
  hotspots="./exterior-hotspots.json">
</ims-viewer>
```

Hotspots link widgets together — click a spot on a 360° product to open a detail gallery, then jump to a panoramic interior, all with animated back navigation. [→ Hotspots docs](./docs/hotspots.md)

## ⚙️ Common Features

All widgets share a base architecture that provides:

- 🎯 **Adaptive loading** — automatically selects the best resolution variant for the viewport and DPI
- 🔄 **Lazy loading** — `lazy` attribute defers initialization until the element enters the viewport
- 🖥️ **Fullscreen** — native Fullscreen API with CSS fallback
- 📱 **Mobile-ready** — touch gestures, responsive sizing, pointer event support
- 🎨 **CSS theming** — design tokens for toolbar, colors, spacing, and transitions
- 🔌 **Plugin system** — extend lifecycle hooks with custom plugins
- 📡 **Events** — standard lifecycle events: `ims-load`, `ims-ready`, `ims-error` ([→ events docs](./docs/events.md))
- 🏷️ **Attribute overrides** — override any JSON config property via HTML attributes

## 📚 Documentation

Full per-widget API reference, config schemas, and CSS custom properties:

| | | |
|---|---|---|
| [Spinner](./docs/spinner.md) | [Gallery](./docs/gallery.md) | [Diff](./docs/diff.md) |
| [Pano](./docs/pano.md) | [Model](./docs/model.md) | [Video](./docs/video.md) |
| [Audio](./docs/audio.md) | [Hotspots](./docs/hotspots.md) | [Viewer](./docs/viewer.md) |
| [Events](./docs/events.md) | [Dependencies](./docs/dependencies.md) | |

## 📰 Articles & Demos

- [Concept details and live demo](https://rnd-pro.com/pulse/immersive-media-spots/)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT © [rnd-pro.com](https://rnd-pro.com)
