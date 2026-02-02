# Webcam Wizard

**HTML5 Webcam App** with **real-time Canvas filters**, **GPS location overlays**, and **geostamped snapshots**. Built for university assignment demonstrating advanced HTML5 APIs.

[![LOC](https://img.shields.io/badge/LOC-1700%2B-blue.svg)](https://github.com/yourusername/websiteAssignment)
[![HTML5](https://img.shields.io/badge/HTML5-Camera%20%2B%20GPS-green.svg)](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API)
[![GitHub Pages](https://img.shields.io/badge/Deployed-GitHub%20Pages-brightgreen.svg)](https://yourusername.github.io/websiteAssignment)

## **Features** (All HTML5 Native)

### **Webcam Processing**
- **15+ Canvas Filters**: Grayscale, invert, blur, sepia, brightness, contrast, saturate, hue-rotate, sharpen (SVG convolution), vintage
- **Live Preview**: 60fps `requestAnimationFrame`
- **Intensity Sliders**: 0-200% strength per filter

### **GPS Location Awareness** 
- **Live Coordinates**: Lat/Lon/accuracy/altitude/compass
- **City Overlay**: "Cologne" stamped on photos (Nominatim reverse geocoding)

### **Snapshots**
- **Geostamped PNGs**: City name + GPS overlays **burned in**
- **EXIF Metadata**: Full GPS (lat/lon/heading/time) + city
- **Gallery**: Max 10, individual downloads

### **UI/UX**
- **Responsive**: Mobile dropdown, desktop scrollable filters
- **Dark Mode**: CSS custom properties
- **Smooth Animations**: CSS transitions + RAF

## **Tech Stack** (Pure HTML5/JS)
- HTML5: getUserMedia + Geolocation API + Canvas2D
- CSS3: Filters + Grid + Custom Properties + Backdrop Blur
- JS/TS: React Hooks + RAF + Haversine Math
- APIs: Nominatim (free geocoding)
- LOC: 1700+ (well-commented)


## 🚀 **Live Demo**
[![Demo](https://img.shields.io/badge/Live-Demo-brightgreen.svg?logo=github)](https://yourusername.github.io/websiteAssignment)

**Try it:**
1. **HTTPS required** (GitHub Pages)
2. **Start Camera** → Apply filters
3. **Enable GPS** → See "Cologne" overlay!
4. **Snapshot** → Download geostamped PNG

## **Mobile Perfect**
- Touch scroll filters (desktop arrows)
- Dropdown filters (<480px)
- GPS + compass work on phones
- Responsive canvas sizing


## **Project Structure**
src/
├── App.tsx # Main layout & orchestration \\
├── hooks/\\
│ ├── useCamera.tsx # getUserMedia + stream mgmt\\
│ └── useGeolocation.tsx # GPS + reverse geocoding + landmarks\\
├── components/\\
│ ├── CanvasRenderer.tsx # RAF + filters + GPS overlays\\
│ ├── FilterControls.tsx # Scrollable buttons + mobile dropdown\\
│ ├── LocationPanel.tsx # Live GPS status + controls\\
│ └── SnapshotGallery.tsx # Geostamped PNG gallery\\
├── App.css # 100% custom (no frameworks)\\
└── index.tsx # React root\\


## **Assignment Compliance**
| Requirement | Implementation |
|-------------|----------------|
| **HTML5 Features** | Camera (`getUserMedia`) + GPS (`navigator.geolocation`) + Canvas |
| **Code Quality** | Clean TSX/CSS separation, uniform formatting |
| **Sophistication** | Haversine math + geocoding + RAF rendering (>1700 LOC) |
| **Responsive** | Mobile/desktop layouts + touch scrolling |
| **Non-trivial** | GPS overlays baked into canvas snapshots |

## **Local Setup**
```bash
npm install
npm start  # http://localhost:3000



