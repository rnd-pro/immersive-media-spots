# Dependencies

IMS widgets are designed to keep a minimal footprint. Heavy third-party libraries are **only required by the widgets that actually use them** — if you never render a panorama or 3D model, Three.js is never loaded.

## Core

| Package | Specifier | Used by |
|---------|-----------|---------|
| [Symbiote.js](https://github.com/nicothed/symbiote.js) | `@symbiotejs/symbiote` | All widgets |

Symbiote.js is the only mandatory dependency. It provides the reactive web component base class used by every IMS widget.

## Optional (per-widget)

| Package | Specifier | Used by | Purpose |
|---------|-----------|---------|---------|
| [Three.js](https://threejs.org/) | `three` | ims-pano, ims-model | WebGL rendering for 360° panoramas and 3D models |
| Three.js addons | `three/addons/` | ims-model | GLTFLoader for `.glb`/`.gltf` model files |
| [hls.js](https://github.com/nicothed/hls.js/) | `hls.js/dist/hls.mjs` | ims-video | HLS adaptive streaming (only when `hlsSrc` is configured) |

> **If you only use `ims-spinner`, `ims-gallery`, `ims-diff`, `ims-audio`, or `ims-hotspots` — no optional dependencies are needed at all.**

## Setup via importmap

The simplest way to provide dependencies is an [importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) — no build step needed:

```html
<script type="importmap">
  {
    "imports": {
      "@symbiotejs/symbiote": "https://cdn.jsdelivr.net/npm/@symbiotejs/symbiote@3/+esm",
      "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/+esm",
      "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/",
      "hls.js/dist/hls.mjs": "https://cdn.jsdelivr.net/npm/hls.js@1.5/+esm"
    }
  }
</script>
```

Only include the entries you actually need. For example, if you only use `ims-spinner`:

```html
<script type="importmap">
  {
    "imports": {
      "@symbiotejs/symbiote": "https://cdn.jsdelivr.net/npm/@symbiotejs/symbiote@3/+esm"
    }
  }
</script>
```

## Bundled setup

When using a bundler (Vite, esbuild, Webpack, etc.), install the required packages via npm and let the bundler resolve them:

```bash
# Core (required)
npm install @symbiotejs/symbiote

# Optional — only if you use the corresponding widgets
npm install three       # ims-pano, ims-model
npm install hls.js      # ims-video with HLS
```

The bundler will tree-shake unused widgets and their dependencies automatically.

## CDN resolution (ims-viewer)

When using `ims-viewer`, widget code is **loaded dynamically** at runtime based on the `imsType` field in the source data. The importmap must be present at page load so that dynamically imported modules can resolve their dependencies correctly.
