'use client';

import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { MapPin, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LocationValidationProps {
  targetLat?: string;
  targetLng?: string;
  maxDistance?: number; // dalam meter
  onLocationValidated: (isValid: boolean, coords: { lat: number; lng: number }) => void;
  className?: string;
}

interface Position {
  lat: number;
  lng: number;
  accuracy: number;
}

export default function LocationValidation({
  targetLat,
  targetLng,
  maxDistance = 100, // default 100 meter
  onLocationValidated,
  className
}: LocationValidationProps) {
  const [currentPosition, setCurrentPosition] = useState<Position | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [distance, setDistance] = useState<number | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  // Function to calculate distance between two points
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // Function to validate location
  const validateLocation = async () => {
    setLoading(true);
    setError(null);

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      });

      const currentPos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      };

      setCurrentPosition(currentPos);

      if (targetLat && targetLng) {
        const dist = calculateDistance(
          currentPos.lat,
          currentPos.lng,
          parseFloat(targetLat),
          parseFloat(targetLng)
        );

        setDistance(dist);
        const valid = dist <= maxDistance;
        setIsValid(valid);
        onLocationValidated(valid, { lat: currentPos.lat, lng: currentPos.lng });
      } else {
        // If no target coordinates, just return current position
        setIsValid(true);
        onLocationValidated(true, { lat: currentPos.lat, lng: currentPos.lng });
      }
    } catch (err) {
      if (err instanceof GeolocationPositionError) {
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setError('Akses lokasi ditolak. Mohon izinkan akses lokasi di browser Anda.');
            break;
          case err.POSITION_UNAVAILABLE:
            setError('Informasi lokasi tidak tersedia. Pastikan GPS Anda aktif.');
            break;
          case err.TIMEOUT:
            setError('Waktu permintaan lokasi habis. Silakan coba lagi.');
            break;
          default:
            setError('Terjadi kesalahan saat mengakses lokasi.');
        }
      } else {
        setError('Terjadi kesalahan saat memvalidasi lokasi.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear state when target coordinates change
    setCurrentPosition(null);
    setDistance(null);
    setIsValid(null);
    setError(null);
  }, [targetLat, targetLng]);

  return (
    <div className={cn('space-y-4', className)}>
      {error ? (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : isValid !== null ? (
        <Alert variant={isValid ? 'default' : 'destructive'}>
          <div className="flex items-start space-x-3">
            {isValid ? (
              <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            )}
            <div className="flex-1">
              <AlertTitle>
                {isValid ? 'Lokasi Valid' : 'Lokasi Tidak Valid'}
              </AlertTitle>
              <AlertDescription className="mt-1">
                {currentPosition && (
                  <div className="text-sm space-y-1">
                    <p>Koordinat Anda: {currentPosition.lat}, {currentPosition.lng}</p>
                    <p>Akurasi: ±{Math.round(currentPosition.accuracy)} meter</p>
                    {distance && (
                      <p>Jarak dari target: {Math.round(distance)} meter</p>
                    )}
                  </div>
                )}
                {!isValid && distance && (
                  <p className="mt-2 text-sm font-medium">
                    Anda harus berada dalam radius {maxDistance} meter dari lokasi target.
                  </p>
                )}
              </AlertDescription>
            </div>
          </div>
        </Alert>
      ) : null}

      <Button
        variant="outline"
        className="w-full"
        onClick={validateLocation}
        disabled={loading}
      >
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <MapPin className="mr-2 h-4 w-4" />
        )}
        {loading ? 'Memvalidasi Lokasi...' : 'Validasi Lokasi'}
      </Button>
    </div>
  );
}