import React from 'react';
import type { LocationData } from '../hooks/useGeolocation';

interface LocationPanelProps {
  isDarkMode: boolean;
  location: LocationData | null;
  error: string | null;
  isWatching: boolean;
  startWatching: () => Promise<void>;
  stopWatching: () => void;
}

/**
 * UI panel showing live GPS status, coords, city, compass, landmark distances
 * - Auto-hides when GPS disabled
 * - Responsive design (mobile stacking)
 * - Error handling with retry
 */
const LocationPanel: React.FC<LocationPanelProps> = ({
  isDarkMode,
  location,      // From App
  error,         // From App  
  isWatching,    // From App
  startWatching, // From App
  stopWatching   // From App
}) => {

  //Error state with retry button
  if (error) {
    return (
        <div className={`location-panel ${isDarkMode ? 'dark' : ''}`}>
            <h3>GPS Location</h3>
            <div className="error-message">
                Location access: <strong>{error}</strong>
            </div>
            <button 
                className="btn-location retry" 
                onClick={startWatching}
                aria-label="Retry GPS access"
            >
                Retry GPS
            </button>
        </div>
    )
  }

  return (
    <div className={`location-panel ${isDarkMode ? 'dark' : ''}`}>
      <h3>Live Location Tracking</h3>
      
      {/* GPS OFF → Start button */}
      {!isWatching ? (
        <button 
          className="btn-location start" 
          onClick={startWatching}
          aria-label="Enable GPS tracking"
        >
          Start GPS
        </button>
      ) : (
        /* GPS ON → Live data */
        <>
          {/* Primary location info */}
          <div className="location-coords">
            <div className="city-display">
               <strong>{location?.cityName || 'Resolving...'}</strong>
            </div>
            <div className="coords">
               {location?.latitude?.toFixed(6)}°N, {location?.longitude?.toFixed(6)}°E
            </div>
            <div className="accuracy">
               {location?.accuracy?.toFixed(0)}m accuracy
            </div>
            {location?.heading && (
              <div className="heading">
                 {location.heading.toFixed(0)}° heading
              </div>
            )}
          </div>

          {/* Stop button */}
          <button 
            className="btn-location stop" 
            onClick={stopWatching}
            aria-label="Stop GPS tracking"
          >
            Stop GPS
          </button>
        </>
      )}
    </div>
  );
};

export default LocationPanel;
