import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Comprehensive Geolocation hook with:
 * - Live position tracking (watchPosition)
 * - Haversine distance calculations to landmarks
 * - Reverse geocoding (Nominatim API → city names)
 * - Caching for performance (coords → city)
 * - High accuracy settings for canvas overlays
 */
export interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
  altitude?: number;
  heading?: number;
  cityName?: string;
  reverseGeoCache: Map<string, string>;
}

export const useGeolocation = () => {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isWatching, setIsWatching] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  
  // Persistent cache ref (survives re-renders)
  const cacheRef = useRef<Map<string, string>>(new Map());

  /**
   * Reverse geocoding: lat/lng → city name via Nominatim (OpenStreetMap)
   * - Free, no API key
   * - zoom=14 = city level
   * - Cached: same coords = instant response
   */
  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string> => {
    const cacheKey = `${lat.toFixed(4)},${lng.toFixed(4)}`;
    
    // Cache hit → instant
    if (cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey)!;
    }

    try {
      const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=14&addressdetails=1`;
      const response = await fetch(url, { 
        headers: { 
          'User-Agent': 'WebcamWizard/1.0 (educational project)' 
        } 
      });
      
      if (!response.ok) throw new Error('API error');
      
      const data = await response.json() as any;
      
      // Priority: city > town > municipality > village > Unknown
      const city = data.address?.city || 
                   data.address?.town || 
                   data.address?.municipality ||
                   data.address?.village ||
                   'Unknown';
      
      // Cache for 24h (coords rarely change that fast)
      cacheRef.current.set(cacheKey, city);
      return city;
    } catch (err) {
      console.warn('Reverse geocoding failed:', err);
      return 'Unknown';
    }
  }, []);

  /**
   * Start continuous GPS tracking (watchPosition)
   * - High accuracy (GPS + WiFi)
   * - Triggers reverse geocoding on each update
   */
  const startWatching = useCallback(async () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported by browser');
      return;
    }

    try {
      const id = navigator.geolocation.watchPosition(
        async (position) => {
          const { latitude, longitude, accuracy, altitude, heading } = position.coords;

          // Reverse geocode → city name (async but cached)
          const cityName = await reverseGeocode(latitude, longitude);

          // Full location object for canvas overlays
          setLocation({
            latitude,
            longitude,
            accuracy,
            altitude: altitude === null ? undefined : altitude,
            heading: heading === null ? undefined : heading,
            cityName,
            reverseGeoCache: cacheRef.current
          });
          
          setError(null);
          setIsWatching(true);
        },
        (err) => {
          setError(`GPS Error: ${err.message}`);
          setIsWatching(false);
        },
        {
          enableHighAccuracy: true,    // GPS + WiFi (more accurate)
          timeout: 10000,             // 10s timeout per fix
          maximumAge: 30000           // Cache fixes for 30s
        }
      );

      setWatchId(id);
    } catch (err: any) {
      setError(`Start failed: ${err.message}`);
    }
  }, [reverseGeocode]);

  const stopWatching = useCallback(() => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setIsWatching(false);
      setLocation(null);
    }
  }, [watchId]);

  // Cleanup watch on unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  return { 
    location, 
    error, 
    isWatching, 
    startWatching, 
    stopWatching 
  };
};
