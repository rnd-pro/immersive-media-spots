# ims-viewer

Universal loader that dynamically imports and renders any IMS widget based on the `imsType` field in the source data.

## Tag

```html
<ims-viewer src-data="path/to/data.json"></ims-viewer>
```

## How It Works

1. Fetches JSON from `src-data` URL
2. Reads `imsType` (e.g. `"spinner"`, `"gallery"`, `"diff"`)
3. Dynamically imports the widget module via `url-template`
4. Creates `<ims-{imsType}>` element, passes `src-data` as blob URL
5. Appends the widget as a child

This enables a single tag to render any widget type without knowing the type at build time.

## Attributes

| Attribute | Description |
|---|---|
| `src-data` | URL to JSON config (must contain `imsType` field) |
| `url-template` | ES module URL pattern. Placeholders: `{{version}}`, `{{imsType}}` |
| `version` | Override version for CDN URL (default: from source data or `latest`) |
| `cast-next` | Marker attribute — all attributes after this one are forwarded to the child widget |

## Default URL Template

```
https://cdn.jsdelivr.net/npm/interactive-media-spots@{{version}}/wgt/{{imsType}}/+esm
```

Override for local development:

```html
<ims-viewer 
  src-data="../spinner/test-data.json" 
  url-template="../{{imsType}}/index.js">
</ims-viewer>
```

## Attribute Forwarding (`cast-next`)

Forward attributes to the dynamically created child widget:

```html
<ims-viewer 
  src-data="../spinner/test-data.json" 
  url-template="../{{imsType}}/index.js"
  cast-next
  autoplay="true"
  no-ui>
</ims-viewer>
```

All attributes after `cast-next` (`autoplay`, `no-ui`) are set on the child `<ims-spinner>`.

## Styling

`ims-viewer` uses `display: contents`, making it invisible in the layout. Style the child widget directly:

```css
ims-viewer > * {
  width: 640px;
  height: 400px;
}
```

## Events

See [events.md](./events.md) for standard IMS lifecycle events (emitted by the child widget, not ims-viewer itself).
