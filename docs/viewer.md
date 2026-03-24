# ims-viewer

Universal loader that dynamically imports and renders any IMS widget based on the `imsType` field in the source data. Also serves as the **hypermedia navigation container** when combined with `ims-hotspots`.

## Tag

```html
<ims-viewer src-data="path/to/data.json"></ims-viewer>
```

With hotspots:

```html
<ims-viewer src-data="spinner.json" hotspots="shop-hotspots.json"></ims-viewer>
```

## How It Works

1. Fetches JSON from `src-data` URL
2. Reads `imsType` (e.g. `"spinner"`, `"gallery"`, `"diff"`)
3. Dynamically imports the widget module via `url-template`
4. Creates `<ims-{imsType}>` element, passes `src-data` as blob URL
5. If `hotspots` attribute is set, creates `<ims-hotspots>` overlay inside the widget

## Attributes

| Attribute | Description |
|---|---|
| `src-data` | URL to JSON config (must contain `imsType` field) |
| `url-template` | ES module URL pattern. Placeholders: `{{version}}`, `{{imsType}}` |
| `version` | Override version for CDN URL (default: from source data or `latest`) |
| `hotspots` | URL to hotspot config JSON (see [hotspots.md](./hotspots.md)) |
| `cast-next` | Marker — all attributes after this are forwarded to child widget |

## Default URL Template

```
https://cdn.jsdelivr.net/npm/immersive-media-spots@{{version}}/{{imsType}}/+esm
```

Override for local development:

```html
<ims-viewer 
  src-data="../spinner/test-data.json" 
  url-template="../{{imsType}}/index.js">
</ims-viewer>
```

## Hypermedia Navigation

When `hotspots` is set, the viewer handles hotspot click events:

- **`targetSrcData`** — pushes current state to history, loads new widget + hotspots
- **`url`** — opens external link
- **`action`** — calls method on child widget

A **back button** (←) appears when navigation history is non-empty.

```
spinner.json ──hotspot──▶ pano.json ──hotspot──▶ gallery.json
                                                       │
                                          ← back ◀─────┘
```

## Attribute Forwarding (`cast-next`)

```html
<ims-viewer 
  src-data="../spinner/test-data.json" 
  url-template="../{{imsType}}/index.js"
  cast-next
  autoplay="true"
  no-ui>
</ims-viewer>
```

All attributes after `cast-next` (`autoplay`, `no-ui`) are set on the child widget.

## Styling

Style the viewer container or the child widget directly:

```css
ims-viewer {
  width: 640px;
  height: 400px;
}
```

Back button uses `--ims-hotspot-bg` and `--ims-hotspot-bg-hover` tokens.

## Public API

| Method | Description |
|---|---|
| `goBack()` | Navigate to the previous view in the history stack |
| `goHome()` | Navigate to the initial (first) view, clearing all history |

## Events

Hotspot navigation fires `ims-hotspot-click` (see [hotspots.md](./hotspots.md)). Standard lifecycle events are emitted by the child widget (see [events.md](./events.md)).
