import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { FormVerificationCreate } from '@/types';

interface UsePhotoManagementReturn {
  photoUrls: Record<string, string>;
  handlePhotoUpload: (url: string, fieldName: string) => void;
  validatePhotos: (data: FormVerificationCreate, isResubmit: boolean, rejectedPhotos: Record<string, { status: string }>) => string[];
}

export const usePhotoManagement = (
  setValue: UseFormSetValue<FormVerificationCreate>
): UsePhotoManagementReturn => {
  const [photoUrls, setPhotoUrls] = useState<Record<string, string>>({});

  const handlePhotoUpload = (url: string, fieldName: string) => {
    setPhotoUrls(prev => ({ ...prev, [fieldName]: url }));
    setValue(fieldName as keyof FormVerificationCreate, url);
    console.log(`Photo uploaded: ${fieldName} = ${url}`);
  };

  const validatePhotos = (
    data: FormVerificationCreate, 
    isResubmit: boolean,
    rejectedPhotos: Record<string, { status: string }>
  ): string[] => {
    let requiredPhotos;
    if (isResubmit) {
      requiredPhotos = Object.keys(rejectedPhotos).filter(
        field => rejectedPhotos[field].status === 'REJECTED'
      );
    } else {
      requiredPhotos = [
        'FOTO_MINI_PC_FULL',
        'FOTO_SN_MINI_PC',
        'FOTO_TID',
        'FOTO_DASHBOARD_VIMS',
        'FOTO_SIGNAL_MODEM',
        'FOTO_STORAGE_MINI',
        'FOTO_TEMUAN_RUSAK'
      ];
    }
    
    return requiredPhotos.filter(photoField => !data[photoField as keyof FormVerificationCreate]);
  };

  return {
    photoUrls,
    handlePhotoUpload,
    validatePhotos
  };
};