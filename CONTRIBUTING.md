# Contributing to IMS

Thank you for your interest in contributing to Interactive Media Spots!

## Development Setup

```bash
git clone https://github.com/rnd-pro/interactive-media-spots.git
cd interactive-media-spots
npm install
```

## Project Structure

```
lib/              — Shared base classes and utilities
  ImsBaseClass.js — Base class for all widgets
  FullscreenMgr.js — Fullscreen API manager
  ImageReader.js  — Image sequence loader with progress
  tokens.css      — CSS design tokens
  validateConfig.js — Runtime config validation

wgt/              — Widget implementations
  diff/           — Image comparison
  gallery/        — Image gallery
  pano/           — 360° panorama viewer
  spinner/        — 360° object viewer
  video/          — Video player with HLS
  viewer/         — Universal CDN-driven loader

tests/            — Unit tests (Node.js test runner)
```

## Widget Anatomy

Each widget follows this structure:
- `index.js` — Component class extending `ImsBaseClass`
- `template.js` — HTML template
- `styles.js` — Shadow DOM styles
- `ImsXxxData.js` — Data schema class
- `test.html` — Manual test page
- `test-data.json` — Test fixture data

## Running Tests

```bash
npm test
```

## Code Style

- Single quotes for strings
- 2-space indentation
- Semicolons required
- ESM only (no `require`)
- Use `#` for private class fields
- JSDoc for type annotations
- Modern CSS nesting
- No external CSS frameworks

## Submitting Changes

1. Fork and create a feature branch
2. Make your changes following the code style above
3. Add/update tests for new functionality
4. Ensure `npm test` passes
5. Submit a PR with a clear description

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
