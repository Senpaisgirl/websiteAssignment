# Webcam Wizard

**Webcam Wizard** is a fully responsive HTML5 web application that combines **real-time Canvas video processing**, **Geolocation APIs**, and **CSS3 filters** into a unified camera experience. Built with React and TypeScript, it demonstrates advanced browser capabilities without external UI frameworks. Made for an university assignment demonstrating advanced HTML5 APIs.

[![LOC](https://img.shields.io/badge/LOC-1450%2B-blue.svg)](https://github.com/senpaisgirl/websiteAssignment)
[![HTML5](https://img.shields.io/badge/HTML5-Camera%20%2B%20Canvas%20%2B%20GPS-brightgreen.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-brightgreen.svg)](https://senpaisgirl.github.io/websiteAssignment)

## **Features** (All HTML5 Native)

### **Webcam Processing**

- **Native Stream**: Uses `navigator.mediaDevices.getUserMedia` for low-latency video.
- **15+ Canvas Filters**: Grayscale, invert, blur, sepia, brightness, contrast, saturate, hue-rotate, sharpen (SVG convolution), vintage
- **Live Preview**: 60fps `requestAnimationFrame`
- **Intensity Sliders**: 0-200% strength per filter
- **Smart Rendering**: Hybrid engine that uses `ctx.filter` for performance but falls back to CSS filters on older mobile devices.

### **GPS Location Awareness**

- **Live GPS Tracking**: Real-time updates for Latitude, Longitude, Altitude, and Accuracy.
- **Reverse Geocoding**: Automatically fetches and caches city names (e.g., "Berlin", "New York").
- **Visual Overlays**: "Burns" location data directly into the snapshot image, making it permanent.

### **Snapshots**

- **Geostamped PNGs**: City name + GPS overlays **burned in**
- **EXIF Metadata**: Full GPS (lat/lon/heading/time) + city
- **Gallery**: Max 10, individual downloads

### **UI/UX**

- **Responsive**: Mobile dropdown, desktop scrollable filters
- **Dark Mode**: CSS custom properties
- **Smooth Animations**: CSS transitions + RAF

**Mobile-First Experience**

- **Camera Switching**: Toggle between Front/Back cameras (User/Environment facing).
- **Touch-Friendly**: Filter lists become swipeable or dropdowns depending on screen size.
- **Progressive Web App (PWA) Feel**: Hides scrollbars and uses system fonts.

## **Tech Stack** (Pure HTML5/JS)

- **Core**: React 18, TypeScript, HTML5, CSS3
- **APIs**:
  - `CanvasRenderingContext2D` (Image processing)
  - `Geolocation API` (Position tracking)
  - `MediaStream API` (Camera access)
  - `Nominatim API` (Reverse geocoding)
- **Styling**: Pure CSS (CSS Grid, Flexbox, CSS Variables, Backdrop Filter) – _No Bootstrap/Tailwind used._
- LOC: 1450+ (commented)

## **Live Demo**

[![Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg?logo=github)](https://senpaisgirl.github.io/websiteAssignment)

1. **HTTPS required** (GitHub Pages)
2. **Start Camera** → Apply filters
3. **Enable GPS** → See "Cologne" overlay!
4. **Snapshot** → Download geostamped PNG

## **Project Structure**

src/

- App.tsx # Main Application Orchestrator
- App.css # Global Styles & Responsive Breakpoints
- index.tsx # React root
- hooks/
  - useCamera.tsx # Custom Hook: Camera stream & device switching
  - useGeolocation.tsx # Custom Hook: GPS tracking & API geocoding
- components/
  - CanvasRenderer.tsx # The "Core": Handles 60fps draw loop & overlays
  - FilterControls.tsx # UI: Scrollable lists & mobile dropdowns
  - LocationPanel.tsx # UI: GPS status dashboard
  - SnapshotGallery.tsx x# UI: Image grid & download handling

## **Technical Edge Cases & Fallbacks**

To ensure a consistent experience across fragmented mobile browsers, the app implements robust feature detection:

- **Canvas Filter Support**: Some iOS WebKit environments (like in-app browsers) do not support the `ctx.filter` API for manipulating pixels directly.
- **Graceful Degradation**: The app detects this limitation instantly. If unsupported, it:
  1.  Switches to **CSS-based filters** so the live preview still looks correct.
  2.  Displays a **"Device Limit" warning** to honestly inform the user that the filter cannot be "burned" into the downloaded snapshot.

## **Local Setup**

```bash
git clone https://github.com/senpaisgirl/websiteAssignment.git
npm install
npm start
```
