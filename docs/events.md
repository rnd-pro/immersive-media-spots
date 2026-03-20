# Events

All IMS widgets emit standard lifecycle events via `CustomEvent`. Enable with `dispatchEvents: true` in config or listen directly on the widget element.

## Event Types

| Event | Constant | Detail | Description |
|---|---|---|---|
| `ims-load` | `ImsEvents.LOAD` | `{ progress: number }` | Data loading started |
| `ims-ready` | `ImsEvents.READY` | `{ srcData }` | Widget initialized and ready |
| `ims-error` | `ImsEvents.ERROR` | `{ error }` | Loading or initialization error |
| `ims-resize` | `ImsEvents.RESIZE` | — | Widget resized |
| `ims-destroy` | `ImsEvents.DESTROY` | — | Widget removed from DOM |

## Usage

```js
import { ImsEvents } from 'interactive-media-spots';

let spinner = document.querySelector('ims-spinner');

spinner.addEventListener(ImsEvents.READY, (e) => {
  console.log('Widget ready:', e.detail.srcData);
});

spinner.addEventListener(ImsEvents.ERROR, (e) => {
  console.error('Widget error:', e.detail.error);
});
```
