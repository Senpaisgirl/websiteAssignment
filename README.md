# Webcam Wizard

**Webcam Wizard** is a fully responsive HTML5 web application that combines **real-time Canvas video processing**, **Geolocation APIs**, and **CSS3 filters** into a unified camera experience. Built with React and TypeScript, it demonstrates advanced browser capabilities without external UI frameworks. Made for an university assignment demonstrating advanced HTML5 APIs.

[![LOC](https://img.shields.io/badge/LOC-1450%2B-blue.svg)](https://github.com/senpaisgirl/websiteAssignment)
[![HTML5](https://img.shields.io/badge/HTML5-Camera%20%2B%20Canvas%20%2B%20GPS-brightgreen.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-brightgreen.svg)](https://senpaisgirl.github.io/websiteAssignment)

## 🎓 **Assignment Evaluation Compliance**

This project specifically targets the following evaluation criteria:

| Evaluation Aspect            | Implementation Details                                                                                                                                                                                                                                                                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Idea**                     | A "Smart Camera" web app that doesn't just take photos but **bakes real-time data** (GPS coordinates, city name, compass heading) and visual filters directly into the pixel data using the HTML5 Canvas API.                                                                                                             |
| **Code Quality**             | • **Modular Architecture**: Logic (`hooks/`), UI (`components/`), and Styling (`App.css`) are strictly separated.<br>• **Typed Strictness**: Full TypeScript implementation with interfaces for all props/states.<br>• **Clean Code**: Consistent formatting, JSDoc comments, and no inline styles for layout.            |
| **Documentation**            | Comprehensive README (this file), inline code comments explaining complex logic (e.g., Haversine formula, Canvas RAF loop), and clear commit history.                                                                                                                                                                     |
| **Technical Sophistication** | • **Custom Hooks**: `useCamera` (stream management) and `useGeolocation` (GPS tracking + Reverse Geocoding).<br>• **Performance**: Uses `requestAnimationFrame` for 60fps rendering instead of `setInterval`.<br>• **Fallbacks**: Detects legacy iOS/WebKit to provide CSS filter fallbacks when Context 2D filters fail. |
| **Responsiveness**           | • **Adaptive UI**: Grid layout shifts from 2-column (desktop) to stacked (mobile).<br>• **Mobile Features**: "Switch Camera" button appears _only_ on actual mobile hardware (Regex UA detection).<br>• **Touch Controls**: Scrollable filter bar supports touch swipe on mobile.                                         |
| **Bonus Points**             | • **Reverse Geocoding**: Converts raw GPS lat/lon into actual city names (e.g., "Baden-Baden") via OpenStreetMap API.<br>• **Dark Mode**: System-wide theme toggling using CSS variables.<br>• **Compass Integration**: Draws a live rotating compass needle based on device heading.                                     |

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

**Try it:**

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

## **Assignment Compliance**

| Requirement        | Implementation                                                   |
| ------------------ | ---------------------------------------------------------------- |
| **HTML5 Features** | Camera (`getUserMedia`) + GPS (`navigator.geolocation`) + Canvas |
| **Code Quality**   | Clean TSX/CSS separation, uniform formatting                     |
| **Sophistication** | Haversine math + geocoding + RAF rendering (>1450 LOC)           |
| **Responsive**     | Mobile/desktop layouts + touch scrolling                         |
| **Non-trivial**    | GPS overlays baked into canvas snapshots                         |

## **Local Setup**

```bash
git clone https://github.com/senpaisgirl/websiteAssignment.git
npm install
npm start
```
