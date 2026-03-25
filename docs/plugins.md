# Plugins

IMS widgets share a plugin system that hooks into lifecycle events. Plugins are plain objects — no base class or registration boilerplate required.

## Plugin Interface

```ts
interface ImsPlugin {
  name: string;
  onInit?(widget: ImsBaseClass): void;
  onReady?(widget: ImsBaseClass): void;
  onResize?(widget: ImsBaseClass): void;
  onDestroy?(widget: ImsBaseClass): void;
  onRender?(widget: ImsBaseClass, canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D): void;
}
```

| Hook | When it fires |
|---|---|
| `onInit` | After source data is loaded and `init()` completes |
| `onReady` | Immediately after `onInit`, once the widget is fully interactive |
| `onResize` | On every observed resize (viewport change, fullscreen toggle, etc.) |
| `onDestroy` | When the widget element is removed from the DOM |
| `onRender` | After each canvas draw pass (canvas-based widgets only) |

## Registering Plugins

Use the static `use()` method on any widget class. Plugins can be registered before or after elements are created — they apply to all instances of that class.

```js
import ImsSpinner from 'immersive-media-spots/spinner';
import { analytics } from 'immersive-media-spots/plugins/analytics';

ImsSpinner.use(analytics({
  handler: (event) => console.log(event),
}));
```

Multiple plugins are supported — each one is called in registration order.

### Scoping

`use()` is per-class. Registering a plugin on `ImsSpinner` does **not** affect `ImsGallery`. To apply a plugin to every widget, call `use()` on `ImsBaseClass` directly:

```js
import { ImsBaseClass } from 'immersive-media-spots';
import { analytics } from 'immersive-media-spots/plugins/analytics';

ImsBaseClass.use(analytics({ handler: console.log }));
```

## Built-in Plugins

### `analytics`

Tracks widget lifecycle events via a callback.

```js
import { analytics } from 'immersive-media-spots/plugins/analytics';
```

| Option | Type | Default | Description |
|---|---|---|---|
| `handler` | `(event) => void` | — | **Required.** Receives `{ type, widget, detail? }` |
| `trackResize` | `boolean` | `false` | Whether to fire on resize events |

Event types emitted: `ready`, `resize`, `destroy`.

```js
ImsSpinner.use(analytics({
  handler: ({ type, widget, detail }) => {
    fetch('/api/analytics', {
      method: 'POST',
      body: JSON.stringify({ type, widget }),
    });
  },
  trackResize: true,
}));
```

---

### `watermark`

Draws a text watermark on canvas-based widgets after each render or resize.

```js
import { watermark } from 'immersive-media-spots/plugins/watermark';
```

| Option | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | `'© Watermark'` | Watermark text |
| `font` | `string` | `'14px system-ui'` | CSS font string |
| `color` | `string` | `'rgba(255,255,255,0.4)'` | Fill color |
| `opacity` | `number` | `0.4` | Canvas `globalAlpha` |
| `position` | `string` | `'bottom-right'` | One of: `top-left`, `top-right`, `bottom-left`, `bottom-right`, `center` |

```js
ImsSpinner.use(watermark({
  text: '© ACME Corp',
  position: 'bottom-left',
  opacity: 0.3,
}));
```

## Writing a Custom Plugin

A plugin is a factory function that returns an `ImsPlugin` object:

```js
export function myPlugin(options = {}) {
  return {
    name: 'my-plugin',

    onReady(widget) {
      // widget.canvas, widget.srcData, widget.rect are available
      console.log(`${widget.localName} is ready`);
    },

    onDestroy(widget) {
      // clean up resources
    },
  };
}
```

Key things available on the `widget` reference:

| Property | Description |
|---|---|
| `widget.canvas` | The `<canvas>` element (if present) |
| `widget.ctx2d` | Canvas 2D rendering context |
| `widget.srcData` | Parsed source data object |
| `widget.rect` | Current bounding rect |
| `widget.localName` | Tag name (`ims-spinner`, etc.) |
