import React, { useEffect } from 'react';
import { Control, UseFormSetValue } from 'react-hook-form';
import { MapPin, Satellite, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FormVerificationCreate } from '@/types';

interface LocationSectionProps {
  control: Control<FormVerificationCreate>;
  setValue: UseFormSetValue<FormVerificationCreate>;
  location: { latitude: string; longitude: string; isLocationValid?: boolean } | null;
  locationError: string | null;
  isLocating: boolean;
  onRetryLocation: (relaxedMode: boolean) => void;
  onDistanceCheck?: (distance: number) => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  control,
  setValue,
  location,
  locationError,
  isLocating,
  onRetryLocation,
  onDistanceCheck
}) => {
  useEffect(() => {
    if (location) {
      setValue('latitude', location.latitude);
      setValue('longitude', location.longitude);

      // Get target location from form values
      const formValues = control._formValues;
      const targetLat = formValues?.LOKASI?.split(',')[0];
      const targetLon = formValues?.LOKASI?.split(',')[1];
      
      console.log('Target location:', { targetLat, targetLon, formValues: formValues?.LOKASI });
      
      if (targetLat && targetLon && onDistanceCheck) {
        // Calculate distance between current and target location
        const distance = calculateDistance(
          parseFloat(location.latitude),
          parseFloat(location.longitude),
          parseFloat(targetLat),
          parseFloat(targetLon)
        );
        onDistanceCheck(distance);
      }
    }
  }, [location, setValue, control._formValues, onDistanceCheck]);

  // Haversine formula to calculate distance between two points
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
  return (
    <div className="space-y-2">
      <Label className="text-gray-700 font-medium">
        Lokasi Geografis <span className="text-red-500">*</span>
      </Label>
      <p className="text-xs text-gray-500 mt-1">
        Lokasi akan didapatkan secara otomatis. Pastikan GPS/lokasi diaktifkan pada perangkat Anda.
      </p>
      {locationError && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertCircle className="mr-1 h-4 w-4" />
          {locationError}
        </p>
      )}
      {locationError && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onRetryLocation(true)}
          className="mt-2 text-xs"
          disabled={isLocating}
        >
          <Satellite className="mr-1 h-3 w-3" />
          {isLocating ? 'Mendapatkan Lokasi...' : 'Coba Lagi (Mode Cepat)'}
        </Button>
      )}
      {location && (
        <div className="mt-2 p-3 bg-green-50 rounded-lg border border-green-200">
          <div className="flex items-center text-green-800">
            <MapPin className="mr-2 h-4 w-4" />
            <span className="text-sm font-medium">Lokasi berhasil didapatkan</span>
          </div>
          <div className="mt-2 text-xs text-green-700">
            <p>Latitude: {location.latitude}</p>
            <p>Longitude: {location.longitude}</p>
            {control._formValues?.LOKASI && (
              <p className="mt-1 font-medium">
                Jarak dari lokasi ITD: {Math.round(calculateDistance(
                  parseFloat(location.latitude),
                  parseFloat(location.longitude),
                  parseFloat(control._formValues.LOKASI.split(',')[0]),
                  parseFloat(control._formValues.LOKASI.split(',')[1])
                ))} meter
              </p>
            )}
          </div>
        </div>
      )}
      <input 
        type="hidden" 
        {...control.register('latitude')} 
        value={location?.latitude || ''} 
      />
      <input 
        type="hidden" 
        {...control.register('longitude')} 
        value={location?.longitude || ''} 
      />
    </div>
  );
};