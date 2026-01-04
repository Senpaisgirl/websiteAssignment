import React, { useState } from 'react';
import { useCamera } from './hooks/useCamera';
import CanvasRenderer from './components/CanvasRenderer';
import FilterControls from './components/FilterControls';
import SnapshotGallery from './components/SnapshotGallery';
import './App.css';

function App() {
  const { videoRef, startCamera, stopCamera, isActive, error } = useCamera();
  const [activeFilter, setActiveFilter] = useState('none');
  const [snapshots, setSnapshots] = useState<string[]>([]);

  const handleSnapshots = (dataURL: string) => {
    setSnapshots(prev => [dataURL, ...prev.slice(0, 9)]) //max 10 pictures
  };

  return (
    <div className='app'>
      <header className='header'>
        <h1>Webcam Wizard</h1>
        <p>HTML5 Camera + Canvas Effects</p>
      </header>

      <FilterControls
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
      />

      <main className='main-content'>
        <div className='camera-section'>
          <video
            ref={videoRef}
            style={{ display: 'none' }}
            autoPlay
            muted
            playsInline
          />
          
          {!isActive ?  (
            <button className='btn-start' onClick={startCamera}>
              Start Camera
            </button>
          ) : (
            <>
              <CanvasRenderer
                videoRef={videoRef}
                activeFilter={activeFilter}
                onSnapshot={handleSnapshots}
              />
              <button className='btn-stop' onClick={stopCamera}>
                Stop Kamera
              </button>
            </>
          )}
          { error && <div className='error'>{error}</div> }
        </div>

        { snapshots.length > 0 && (
          <SnapshotGallery snapshots={snapshots} />
        )}
      </main>
    </div>
  )
}

export default App;