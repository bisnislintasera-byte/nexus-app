import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';

interface LocationState {
  latitude: string;
  longitude: string;
  isLocationValid: boolean;
}

interface UseLocationTrackingReturn {
  location: LocationState | null;
  locationError: string | null;
  getLocation: (relaxedMode?: boolean) => void;
  isLocating: boolean;
  startContinuousTracking: (targetLocation: { latitude: number; longitude: number }) => void;
  stopContinuousTracking: () => void;
  isLocationValid: boolean;
}

export const useLocationTracking = (): UseLocationTrackingReturn => {
  const [location, setLocation] = useState<LocationState | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [isLocationValid, setIsLocationValid] = useState(false);
  const locationRequested = useRef(false);
  const watchId = useRef<number | null>(null);
  const targetLocation = useRef<{ latitude: number; longitude: number } | null>(null);

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  };

  const getLocation = (relaxedMode = false) => {
    if (locationRequested.current) return;
    
    locationRequested.current = true;
    setLocationError(null);
    setIsLocating(true);
    
    if (!navigator.geolocation) {
      const errorMsg = 'Geolocation tidak didukung oleh browser Anda. Harap gunakan browser yang mendukung geolocation.';
      setLocationError(errorMsg);
      toast.error(errorMsg);
      setIsLocating(false);
      return;
    }

    toast.loading(
      relaxedMode 
        ? 'Mendapatkan lokasi dengan pengaturan cepat...' 
        : 'Mendapatkan lokasi... (Mencoba metode terbaik)', 
      { id: 'location-loading' }
    );

    const strategies = [
      {
        name: 'jaringan cepat',
        enableHighAccuracy: false,
        timeout: relaxedMode ? 5000 : 8000,
        maximumAge: relaxedMode ? 1800000 : 900000
      },
      {
        name: 'keseimbangan akurasi',
        enableHighAccuracy: true,
        timeout: relaxedMode ? 10000 : 15000,
        maximumAge: relaxedMode ? 900000 : 600000
      },
      {
        name: 'GPS presisi tinggi',
        enableHighAccuracy: true,
        timeout: relaxedMode ? 20000 : 30000,
        maximumAge: 1800000
      },
      {
        name: 'mode darurat',
        enableHighAccuracy: false,
        timeout: 45000,
        maximumAge: 3600000
      }
    ];

    let strategyIndex = 0;
    
    const tryNextStrategy = () => {
      if (strategyIndex >= strategies.length) {
        const errorMsg = 'Gagal mendapatkan lokasi setelah beberapa percobaan. Pastikan GPS/lokasi diaktifkan dan coba lagi.';
        setLocationError(errorMsg);
        toast.error(errorMsg, { 
          id: 'location-loading',
          duration: 15000
        });
        setIsLocating(false);
        return;
      }

      const options = strategies[strategyIndex];
      const strategyName = options.name;

      if (strategyIndex > 0) {
        toast.loading(`Mencoba mendapatkan lokasi dengan ${strategyName}... (Percobaan ${strategyIndex + 1}/${strategies.length})`, { 
          id: 'location-loading' 
        });
      }

      const delay = strategyIndex > 0 ? 1000 : 0;
      setTimeout(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            
            if (isNaN(latitude) || isNaN(longitude) || Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
              strategyIndex++;
              tryNextStrategy();
              return;
            }
            
            // Calculate distance and validity against target location
            const isValid = !targetLocation.current || calculateDistance(
              latitude,
              longitude,
              targetLocation.current.latitude,
              targetLocation.current.longitude
            ) <= 100;

            setLocation({
              latitude: latitude.toString(),
              longitude: longitude.toString(),
              isLocationValid: isValid
            });
            
            const successMsg = relaxedMode 
              ? `Lokasi berhasil didapatkan (${strategyName})` 
              : `Lokasi berhasil didapatkan secara otomatis (${strategyName})`;
            toast.success(successMsg, { id: 'location-loading' });
            setIsLocating(false);
          },
          (error) => {
            console.warn(`Strategy ${strategyIndex + 1} (${strategyName}) failed:`, error);
            strategyIndex++;
            tryNextStrategy();
          },
          options
        );
      }, delay);
    };

    tryNextStrategy();
  };

  const startContinuousTracking = (newTargetLocation: { latitude: number; longitude: number }) => {
    targetLocation.current = newTargetLocation;
    
    // Stop any existing watch
    stopContinuousTracking();

    if (!navigator.geolocation) {
      setLocationError('Geolocation tidak didukung oleh browser Anda');
      return;
    }

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        const currentLat = position.coords.latitude;
        const currentLon = position.coords.longitude;

        if (targetLocation.current) {
          const distance = calculateDistance(
            currentLat,
            currentLon,
            targetLocation.current.latitude,
            targetLocation.current.longitude
          );

          const isValid = distance <= 100; // 100 meters radius
          
          // Only show notification when status changes
          if (isValid !== isLocationValid) {
            if (isValid) {
              toast.success('Lokasi valid, Anda dapat mengisi form sekarang', {
                duration: 3000,
                id: 'location-status-toast'
              });
            } else {
              toast.error('Anda berada di luar radius yang diizinkan', {
                duration: 3000,
                id: 'location-status-toast'
              });
            }
          }
          
          setIsLocationValid(isValid);
        }

        setLocation({
          latitude: currentLat.toString(),
          longitude: currentLon.toString(),
          isLocationValid: isLocationValid
        });
      },
      (error) => {
        setLocationError(`Error tracking location: ${error.message}`);
        setIsLocationValid(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000
      }
    );
  };

  const stopContinuousTracking = () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopContinuousTracking();
    };
  }, []);

  return {
    location,
    locationError,
    getLocation,
    isLocating,
    startContinuousTracking,
    stopContinuousTracking,
    isLocationValid
  };
};