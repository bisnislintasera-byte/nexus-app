import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { FormVerificationCreate } from '@/types';

interface UseFormSubmissionReturn {
  isSubmitting: boolean;
  handleSubmit: (data: FormVerificationCreate, isResubmit: boolean, formId?: string, photoUrls?: Record<string, string>) => Promise<void>;
}

export const useFormSubmission = (
  form: UseFormReturn<FormVerificationCreate>
): UseFormSubmissionReturn => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (
    data: FormVerificationCreate, 
    isResubmit: boolean, 
    formId?: string,
    photoUrls?: Record<string, string>
  ) => {
    setIsSubmitting(true);
    try {
      const userId = localStorage.getItem('userId') || 'eng001';
      data.ID_ENGINEER = userId;
      data.geo_timestamp = new Date().toISOString();

      if (photoUrls) {
        type PhotoFields = keyof Pick<FormVerificationCreate, 
          'FOTO_MINI_PC_FULL' | 
          'FOTO_SN_MINI_PC' | 
          'FOTO_TID' | 
          'FOTO_DASHBOARD_VIMS' | 
          'FOTO_SIGNAL_MODEM' | 
          'FOTO_STORAGE_MINI' | 
          'FOTO_TEMUAN_RUSAK'
        >;
        
        Object.keys(photoUrls).forEach(field => {
          if (Object.prototype.hasOwnProperty.call(data, field)) {
            const photoField = field as PhotoFields;
            data[photoField] = photoUrls[field];
          }
        });
      }

      console.log('Sending form data:', data);
      
      if (isResubmit && formId) {
        type PhotoFields = keyof Pick<FormVerificationCreate, 
          'FOTO_MINI_PC_FULL' | 
          'FOTO_SN_MINI_PC' | 
          'FOTO_TID' | 
          'FOTO_DASHBOARD_VIMS' | 
          'FOTO_SIGNAL_MODEM' | 
          'FOTO_STORAGE_MINI' | 
          'FOTO_TEMUAN_RUSAK'
        >;

        // Get existing photos that weren't changed
        const existingPhotos = Object.entries(data).reduce((acc: Record<string, string>, [key, value]) => {
          if (key.startsWith('FOTO_') && value && (!photoUrls || !photoUrls[key])) {
            acc[key] = value as string;
          }
          return acc;
        }, {});

        // Combine existing and new photos
        const allPhotoUrls = {
          ...existingPhotos,
          ...(photoUrls || {})
        };

        await api.post(`/form/resubmit/${formId}`, {
          foto_urls: allPhotoUrls,
          latitude: data.latitude,
          longitude: data.longitude,
          geo_timestamp: new Date().toISOString()
        });
        toast.success('Form berhasil dikirim ulang!');
      } else {
        await api.post('/form/submit', data);
        toast.success('Form berhasil dikirim!');
      }
      
      router.push('/engineer/my-forms');
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error.response?.data?.detail || 'Gagal mengirim form');
      throw error; // Re-throw to handle in component
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    handleSubmit
  };
};