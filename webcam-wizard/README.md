# Webcam Wizard

A modern React app for live webcam effects using HTML5 Canvas and CSS filters. Apply real-time filters, adjust intensity, capture snapshots, and download them. Supports mobile/desktop with smooth scrolling and dark mode.

## Features

- **Live Camera Feed**: Front-facing camera at HD resolution.
- **15+ Filters**: Grayscale, invert, blur, sepia, brightness, contrast, saturate, hue shifts, darkness, sharpen (convolution), vintage.
- **Intensity Control**: Slider scales filter strength (0-200%).
- **Snapshots**: Capture & gallery (max 10), individual downloads.
- **Responsive**: Horizontal filter scroll (desktop), dropdown (mobile).
- **Dark Mode**: Toggle for better low-light use.
- \*\* performant RAF loop for 60fps rendering.

## Tech Stack

- React 18 (hooks, TypeScript)
- Canvas2D for rendering
- getUserMedia API
- CSS Grid/Flexbox, CSS Filters, SVG filters
- Tailwind-free custom CSS (glassmorphism)

## Quick Start

1. Clone & `cd` into project.
2. `npm install` (assumes standard CRA/Vite deps: react, react-dom).
3. `npm start` – opens http://localhost:3000.
4. Grant camera permission, apply filters, snapshot!

## Structure

src/
├── App.tsx # Main layout & state
├── hooks/
│ └── useCamera.tsx # Webcam logic
├── components/
│ ├── CanvasRenderer.tsx # RAF + filters
│ ├── FilterControls.tsx # Scrollable buttons
│ └── SnapshotGallery.tsx # Grid + downloads
├── App.css # Styles + dark mode
└── index.tsx # Entry

## Browser Support

- Chrome/Edge/Firefox/Safari (HTTPS required for getUserMedia).
- Mobile: iOS Safari/Android Chrome (dropdown mode).

## Customization

- Add filters in `FilterControls.tsx` + `parseAndApplyIntensity()`.
- Extend snapshots (localStorage for persistence).
- AR effects via Three.js integration.
