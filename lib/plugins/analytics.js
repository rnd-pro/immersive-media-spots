/**
 * Analytics plugin for IMS widgets.
 * Tracks user interactions and widget lifecycle events.
 *
 * @param {Object} [options]
 * @param {(event: {type: string, widget: string, detail?: any}) => void} [options.handler] - Event handler callback
 * @param {boolean} [options.trackResize] - Whether to track resize events
 * @returns {import('../ImsBaseClass.js').ImsPlugin}
 */
export function analytics(options = {}) {
  let { handler, trackResize = false } = options;

  if (typeof handler !== 'function') {
    console.warn('[IMS Analytics] handler must be a function');
    return { name: 'analytics' };
  }

  return {
    name: 'analytics',
    onReady: (widget) => {
      handler({ type: 'ready', widget: widget.localName });
    },
    onResize: trackResize ? (widget) => {
      handler({ type: 'resize', widget: widget.localName, detail: widget.rect });
    } : undefined,
    onDestroy: (widget) => {
      handler({ type: 'destroy', widget: widget.localName });
    },
  };
}
