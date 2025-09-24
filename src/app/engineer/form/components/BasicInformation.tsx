import React from 'react';
import { Control, Controller } from 'react-hook-form';
import Select from 'react-select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileText, AlertCircle, MapPin } from 'lucide-react';
import { MasterData, FormVerificationCreate } from '@/types';
import { isWithinRadius, formatDistance } from '@/lib/distance';

interface BasicInformationProps {
  control: Control<FormVerificationCreate>;
  errors: any;
  masterData: MasterData[];
  isLoading: boolean;
  isResubmit: boolean;
  currentLocation: { latitude: string; longitude: string } | null;
  onLocationInvalid: (distance: number) => void;
  isLocationValid: boolean;
  startContinuousTracking: (targetLocation: { latitude: number; longitude: number }) => void;
  stopContinuousTracking: () => void;
}

export const BasicInformation: React.FC<BasicInformationProps> = ({
  control,
  errors,
  masterData,
  isLoading,
  isResubmit,
  currentLocation,
  onLocationInvalid,
  startContinuousTracking,
  stopContinuousTracking
}) => {
  // Track the last notification time to prevent spam
  const lastNotificationRef = React.useRef<number>(0);
  const NOTIFICATION_COOLDOWN = 10000; // 10 seconds between notifications

  React.useEffect(() => {
    const currentTID = control._getWatch('TID');
    if (currentTID && currentLocation) {
      const now = Date.now();
      if (now - lastNotificationRef.current > NOTIFICATION_COOLDOWN) {
        validateDistance(currentTID);
        lastNotificationRef.current = now;
      }
    }
  }, [currentLocation]);
  const validateDistance = (selectedTID: string | null) => {
    if (!currentLocation || !selectedTID) return null;

    const selectedLocation = masterData.find(data => data.TID === selectedTID);
    if (!selectedLocation?.latitude || !selectedLocation?.longitude) {
      console.warn('Selected location is missing coordinates:', selectedLocation);
      return null;
    }

    console.log('Validating distance:', {
      selectedLat: selectedLocation.latitude,
      selectedLng: selectedLocation.longitude,
      currentLat: currentLocation.latitude,
      currentLng: currentLocation.longitude
    });

    const result = isWithinRadius(
      parseFloat(selectedLocation.latitude),
      parseFloat(selectedLocation.longitude),
      parseFloat(currentLocation.latitude),
      parseFloat(currentLocation.longitude)
    );

    console.log('Distance validation result:', result);

    if (!result.isValid) {
      onLocationInvalid(result.distance);
    }

    return result;
  };
  return (
    <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <FileText className="mr-2 h-5 w-5 text-blue-600" />
          Informasi Dasar
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-2">
          <Label htmlFor="TID" className="text-gray-700 font-medium">
            Terminal ID (TID) <span className="text-red-500">*</span>
          </Label>
          <Controller
            name="TID"
            control={control}
            rules={{ required: 'TID wajib dipilih' }}
            render={({ field }) => (
              <Select
                {...field}
                options={masterData
                  .sort((a, b) => a.TID.localeCompare(b.TID))
                  .map((data) => ({
                    value: data.TID,
                    label: `${data.TID} - ${data.LOKASI}`,
                  }))
                }
                isDisabled={isLoading || isResubmit}
                placeholder="Cari atau pilih TID..."
                onChange={(option) => {
                  field.onChange(option?.value);
                  if (option?.value) {
                    const selectedLocation = masterData.find(data => data.TID === option.value);
                    if (selectedLocation?.latitude && selectedLocation?.longitude) {
                      validateDistance(option.value);
                      // Start continuous location tracking
                      startContinuousTracking({
                        latitude: parseFloat(selectedLocation.latitude),
                        longitude: parseFloat(selectedLocation.longitude)
                      });
                    }
                  } else {
                    stopContinuousTracking();
                  }
                }}
                value={
                  field.value
                    ? {
                        value: field.value,
                        label:
                          masterData.find((d) => d.TID === field.value)?.LOKASI
                            ? `${field.value} - ${masterData.find((d) => d.TID === field.value)?.LOKASI}`
                            : field.value,
                      }
                    : null
                }
                className="text-sm"
              />
            )}
          />
          {errors.TID && (
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="mr-1 h-4 w-4" />
              {errors.TID.message}
            </p>
          )}
        </div>

        {/* Snapshot Master Data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          {[
            { field: 'KANWIL', label: 'Kanwil' },
            { field: 'KC_SUPERVISI', label: 'KC Supervisi' },
            { field: 'LOKASI', label: 'Lokasi' },
            { field: 'PROJECT', label: 'Project' },
            { field: 'PIC_AREA', label: 'PIC Area' },
            { field: 'NO_PC', label: 'No PC' },
            { field: 'SN_MINI_PC', label: 'SN Mini PC', fullWidth: true }
          ].map(({ field, label, fullWidth }) => (
            <div key={field} className={fullWidth ? 'sm:col-span-2' : ''}>
              <Label className="text-xs text-gray-500">{label}</Label>
              <Controller
                name={field as keyof FormVerificationCreate}
                control={control}
                render={({ field: { value } }) => (
                  <Input
                    value={typeof value === 'boolean' ? String(value) : value || ''}
                    readOnly
                    className="bg-gray-100 border-0"
                  />
                )}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};