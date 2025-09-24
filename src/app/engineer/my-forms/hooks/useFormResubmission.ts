import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { FormVerification } from '@/types';

interface RejectedPhotoDetail {
  status: string;
  komentar: string;
  current_url: string;
}

interface RejectedPhotosResponse {
  rejected_photos: {
    [key: string]: RejectedPhotoDetail;
  };
}

export function useFormResubmission() {
  const router = useRouter();
  const [resubmittingId, setResubmittingId] = useState<string | null>(null);

  // Fungsi untuk mendapatkan daftar foto yang perlu diresubmit
  const getRejectedPhotos = async (formId: string) => {
    try {
      const response = await api.get(`/form/rejected-photos/${formId}`, {
        timeout: 10000 // 10 second timeout
      });
      return response.data as RejectedPhotosResponse;
    } catch (error: any) {
      console.error('Error fetching rejected photos:', error);
      if (error.code === 'ECONNABORTED') {
        throw new Error('Koneksi timeout. Silakan coba lagi.');
      }
      if (error.response) {
        // Server merespons dengan status error
        if (error.response.status === 404) {
          throw new Error('Data form tidak ditemukan');
        }
        throw new Error(error.response.data.detail || 'Terjadi kesalahan pada server');
      }
      if (error.request) {
        // Tidak ada respons dari server
        throw new Error('Tidak dapat terhubung ke server. Periksa koneksi internet Anda.');
      }
      throw new Error('Gagal mendapatkan data foto yang perlu diresubmit');
    }
  };

  // Fungsi untuk validasi lokasi
  const validateLocation = async (formId: string): Promise<{ isValid: boolean; distance?: number }> => {
    try {
      setResubmittingId(formId);
      
      // 1. Dapatkan lokasi saat ini
      const position = await getCurrentPosition();
      
      // 2. Validasi dengan backend
      const response = await api.post(`/form/${formId}/validate-location`, {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      });

      return response.data;
    } catch (error) {
      console.error('Error validating location:', error);
      if (error instanceof GeolocationPositionError) {
        throw new Error('Tidak dapat mendapatkan lokasi. Mohon aktifkan GPS.');
      }
      throw new Error('Gagal memvalidasi lokasi');
    } finally {
      setResubmittingId(null);
    }
  };

  // Fungsi untuk memulai proses resubmit
  const initiateResubmit = async (formId: string) => {
    try {
      setResubmittingId(formId);
      
      // 1. Cek foto yang perlu diresubmit
      const rejectedPhotos = await getRejectedPhotos(formId);
      if (!rejectedPhotos?.rejected_photos || Object.keys(rejectedPhotos.rejected_photos).length === 0) {
        toast.error('Tidak ada foto yang perlu diresubmit');
        setResubmittingId(null);
        return;
      }

      // 2. Jika ada foto yang perlu diresubmit, arahkan ke form resubmit
      router.push(`/engineer/form?resubmit=${formId}`);
      
    } catch (error) {
      console.error('Error initiating resubmit:', error);
      toast.error(error instanceof Error ? error.message : 'Gagal memulai proses resubmit');
      setResubmittingId(null);
    }
  };

  // Helper function untuk mendapatkan lokasi
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation tidak didukung oleh browser ini'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 15000, // Increased timeout to 15 seconds
        maximumAge: 0
      });
    });
  };

  return {
    initiateResubmit,
    resubmittingId
  };
}