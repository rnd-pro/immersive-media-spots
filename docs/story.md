# ims-story

Sequential slide viewer for multi-widget narratives.

## Tag

```html
<ims-story src-data="path/to/data.json"></ims-story>
```

## Attributes

| Attribute | Description |
|---|---|
| `src-data` | URL to JSON config |

## Config

| Property | Type | Default | Description |
|---|---|---|---|
| `imsType` | `string` | `'story'` | Widget type identifier |
| `slides` | `object[]` | — | Slide definitions |
| `slides[].srcData` | `string` | — | URL to IMS widget data JSON |
| `slides[].caption` | `string` | — | Optional caption text |

## Public API

| Method | Description |
|---|---|
| `goToSlide(n)` | Navigate to slide by index (0-based) |
| `next()` | Go to next slide |
| `prev()` | Go to previous slide |
