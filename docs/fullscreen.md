# Fullscreen

IMS widgets include a fullscreen toggle button in their toolbars. The implementation handles three scenarios depending on browser capabilities and DOM context.

## Strategy

### 1. Native Fullscreen API

When the browser supports the [Fullscreen API](https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API) (`requestFullscreen` or vendor-prefixed variants), the widget uses it directly. A `[fullscreen]` attribute is also set on the element for styling hooks.

### 2. CSS Fallback

When the native API is **unsupported** (e.g. mobile Safari), a CSS-only fallback activates. The `[fullscreen]` attribute is set on the target element, and the widget's shadow styles apply:

```css
:host([fullscreen]) {
  position: fixed !important;
  top: 0 !important;
  left: 0 !important;
  width: 100% !important;
  height: 100% !important;
  z-index: 999999;
}
```

### 3. Button Hidden (Fallback Blocked)

The CSS fallback relies on `position: fixed` being relative to the viewport. Certain ancestor CSS properties create a **new containing block**, breaking this assumption:

- `transform` (any value other than `none`)
- `will-change: transform`
- `filter` (any value other than `none`)
- `contain: paint | layout | strict | content`

On widget initialization, if the native API is unsupported, `FullscreenMgr.cssFallbackBlocked()` walks the DOM tree from the widget up to `document.body`. If a blocking ancestor is found, the fullscreen button is **hidden from all toolbars** via the shared `fsHideUnsupported` context flag.

## Fullscreen Target

When a widget is inside an `<ims-viewer>`, the fullscreen target is the viewer (not the inner widget). This ensures navigation controls remain visible during fullscreen.

## CSS Custom Properties

| Token | Default | Description |
|---|---|---|
| `--color-bg` | — | Background in fullscreen mode |
| `--color-fg` | `#fff` | Foreground (icon color) |

## Testing

The `__FULLSCREEN_API_UNSUPPORTED_TEST__` window flag forces the native API to report as unsupported, enabling fullscreen fallback testing in desktop browsers.

```html
<script type="module">
  window['__FULLSCREEN_API_UNSUPPORTED_TEST__'] = true;
</script>
```

See `wgt/viewer/test-fs-blocked.html` for an example with a blocking `transform` ancestor.
