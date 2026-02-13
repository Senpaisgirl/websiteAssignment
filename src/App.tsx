import React, { useEffect, useState } from 'react';
import { useCamera } from './hooks/useCamera';
import CanvasRenderer from './components/CanvasRenderer';
import FilterControls from './components/FilterControls';
import SnapshotGallery from './components/SnapshotGallery';
import { useGeolocation } from './hooks/useGeolocation';
import LocationPanel from './components/LocationPanel';
import './App.css';

function App() {
  const { videoRef, startCamera, stopCamera, switchCamera, isActive, error, facingMode } = useCamera();
  const [activeFilter, setActiveFilter] = useState('none');
  const [filterIntensity, setFilterIntensity] = useState(1);
  const [snapshots, setSnapshots] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { location, isWatching, error: gpsError, startWatching, stopWatching } = useGeolocation();


  /** check device to only show camera switch button on mobile devices */
  useEffect(() => {
    // Regex to detect mobile devices by User Agent
    const checkDevice = () => {
      const userAgent = navigator.userAgent || '';

      const mobileKeywords = [
        'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'iemobile', 
        'opera mini', 'mobile', 'kindle', 'silk', 'fennec', 'maemo', 'palm', 
        'symbian', 'vodafone', 'windows ce', 'xiino'
      ];
      const mobileRegex = new RegExp(mobileKeywords.join('|'), 'i');
      
      const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // It's mobile if the User Agent matches OR it's a touch device
      setIsMobile(mobileRegex.test(userAgent) || isTouchDevice);
    };

    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  /**
   * Adds new snapshot to gallery (max 10)
   * - Prepends new photo
   * - Removes oldest if >10 (memory cleanup)
   * - Revokes old data URLs (prevent leaks)
   */
  const handleSnapshots = (dataURL: string) => {
    setSnapshots((prev) => {
      const next = [dataURL, ...prev];
      if (next.length > 10) {
        const removed = next.pop();
        if (removed) URL.revokeObjectURL(removed);
      }
      return next;
    });
  };

  const handleStartCamera = async () => {
    setIsLoading(true);
    try {
      await startCamera(facingMode);
    } finally {
      setIsLoading(false);
    }
  };

  const clearAllSnapshots = () => {
    snapshots.forEach((u) => URL.revokeObjectURL(u));
    setSnapshots([]);
  };

  // Toggle dark mode on body
  useEffect(() => {
    document.body.classList.toggle('dark-mode', isDarkMode);
  }, [isDarkMode]);

  return (
    <div className='app'>
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }}>
        <defs>
          <filter id="sharpen" x="-50%" y="-50%" width="200%" height="200%">
            <feConvolveMatrix order="3 3" kernelMatrix="0 -1 0 -1 5 -1 0 -1 0" />
          </filter>
        </defs>
      </svg>
      <header className='header'>
        <h1>Webcam Wizard</h1>
        <button 
          className="btn-toggle" 
          onClick={() => setIsDarkMode(!isDarkMode)}
          style={{ position: 'absolute', top: 20, right: 20 }}
        >
          {isDarkMode ? '☀️' : '🌙'}
        </button>
      </header>

      <FilterControls
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        filterIntensity={filterIntensity}
        onIntensityChange={setFilterIntensity}
      />

      <main className='main-content'>
        <div className='content-grid'>
          <div className='camera-section'>
            <video
              ref={videoRef}
              style={{ display: 'none' }}
              autoPlay
              muted
              playsInline
            />
            
            {!isActive ?  (
              <button className='btn-start' onClick={handleStartCamera}>
                {isLoading ? 'Starting...' : 'Start Camera'}
              </button>
            ) : (
              <>
                <CanvasRenderer
                  videoRef={videoRef}
                  activeFilter={activeFilter}
                  filterIntensity={filterIntensity}
                  location={location}
                  onSnapshot={handleSnapshots}
                  onStop={stopCamera}
                />
                { isMobile && (
                  <button className='btn-switch' onClick={switchCamera}>
                    Switch to {facingMode === 'user' ? 'Back' : 'Front'} Camera
                  </button>
                )}
              </>
            )}
            { error && <div className='error'>{error}</div> }
          </div>
          <LocationPanel 
            isDarkMode={isDarkMode}
            location={location}
            isWatching={isWatching}
            error={gpsError}
            startWatching={startWatching}
            stopWatching={stopWatching}
          />
        </div>
        { snapshots.length > 0 && (
          <SnapshotGallery
            snapshots={snapshots}
            onClear={clearAllSnapshots}
          />
        )}
      </main>
    </div>
  )
}

export default App;