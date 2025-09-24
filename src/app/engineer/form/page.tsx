'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { MasterData, FormVerificationCreate } from '@/types';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/BackButton';
import { DeviceStatusModal } from '@/components/ui/DeviceStatusModal';
import { SnapshotModal } from '@/components/ui/SnapshotModal';
import { AlertCircle, CheckCircle, Loader2, Cpu, Camera } from 'lucide-react';
import api from '@/lib/api';

// Components
import { BasicInformation } from './components/BasicInformation';
import { LocationSection } from './components/LocationSection';
import { ChecklistVerification } from './components/ChecklistVerification';
import { PhotoDocumentation } from './components/PhotoDocumentation';
import { SimCardRecommendation } from './components/SimCardRecommendation';
import { MaintenancePeriod } from './components/MaintenancePeriod';
import ConfirmPhotoModal from '@/components/ui/confirm-photo-modal';

// Hooks
import { useLocationTracking } from './hooks/useLocationTracking';
import { usePhotoManagement } from './hooks/usePhotoManagement';
import { useFormSubmission } from './hooks/useFormSubmission';
import { usePageLifecycle } from './hooks/usePageLifecycle';

// === Utility: Hitung jarak (haversine) ===
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // radius bumi dalam meter
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

const DEFAULT_FORM_VALUES: FormVerificationCreate = {
  TID: '',
  KANWIL: '',
  KC_SUPERVISI: '',
  LOKASI: '',
  PROJECT: '',
  PIC_AREA: '',
  NO_PC: '',
  SN_MINI_PC: '',
  STATUS_SIGNAL_MODEM: false,
  STATUS_DASHBOARD: false,
  STATUS_CAMERA: false,
  STATUS_NVR: false,
  STATUS_KABEL_LAN: false,
  STATUS_HDMI: false,
  STATUS_ADAPTOR: false,
  STATUS_HARDISK: false,
  STATUS_MODEM: false,
  REKOMENDASI_SIMCARD: '',
  REKOMENDASI_CATATAN: '',
  PM_PERIODE: 'PM1',
  ID_ENGINEER: '',
  FOTO_MINI_PC_FULL: '',
  FOTO_SN_MINI_PC: '',
  FOTO_TID: '',
  FOTO_DASHBOARD_VIMS: '',
  FOTO_SIGNAL_MODEM: '',
  FOTO_STORAGE_MINI: '',
  FOTO_TEMUAN_RUSAK: '',
};

function FormPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [masterData, setMasterData] = useState<MasterData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFinalConfirmModal, setShowFinalConfirmModal] = useState(false);
  const [isResubmit] = useState(() => Boolean(searchParams.get('resubmit')));
  const [rejectedPhotos, setRejectedPhotos] = useState<Record<string, { status: string; komentar: string }>>({});
  const [pmPeriodeList, setPmPeriodeList] = useState<string[]>(['PM1', 'PM2', 'PM3', 'PM4', 'PM5', 'PM6', 'PM7']);
  const [currentDistance, setCurrentDistance] = useState<number | null>(null);
  const [isFormDisabled, setIsFormDisabled] = useState(true); // default disable semua kecuali TID
  const [showLocationWarning, setShowLocationWarning] = useState(false);
  const [showDeviceStatusModal, setShowDeviceStatusModal] = useState(false);
  const [showSnapshotModal, setShowSnapshotModal] = useState(false);

  const form = useForm<FormVerificationCreate>({
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const { 
    location, 
    locationError, 
    getLocation, 
    isLocating,
    startContinuousTracking,
    stopContinuousTracking,
    isLocationValid 
  } = useLocationTracking();

  const { photoUrls, handlePhotoUpload, validatePhotos } = usePhotoManagement(form.setValue);
  const { setValue, control, handleSubmit: rhfHandleSubmit, watch, formState: { errors } } = form;
  const { isSubmitting, handleSubmit: submitForm } = useFormSubmission(form);


  // Setup page lifecycle hooks
  usePageLifecycle(() => {
    stopContinuousTracking();
  });

  // Auto-fill master data & cek lokasi saat TID berubah
  const tidValue = watch('TID');
  useEffect(() => {
    if (tidValue) {
      const selectedData = masterData.find(data => data.TID === tidValue);
      if (selectedData) {
        setValue('KANWIL', selectedData.KANWIL);
        setValue('KC_SUPERVISI', selectedData.KC_SUPERVISI);
        setValue('LOKASI', selectedData.LOKASI);
        setValue('PROJECT', selectedData.PROJECT);
        setValue('PIC_AREA', selectedData.PIC_AREA);
        setValue('NO_PC', selectedData.NO_PC);
        setValue('SN_MINI_PC', selectedData.SN_MINI_PC);
      }

      // Cek jarak lokasi
      if (
        selectedData &&
        selectedData.latitude &&
        selectedData.longitude &&
        location
      ) {
        const distance = calculateDistance(
          Number(location.latitude),
          Number(location.longitude),
          Number(selectedData.latitude),
          Number(selectedData.longitude)
        );
        setCurrentDistance(distance);

        if (distance > 100) { 
          setIsFormDisabled(true);
          setShowLocationWarning(true);
        } else {
          setIsFormDisabled(false);
          setShowLocationWarning(false);
        }
      }
    }
  }, [tidValue, masterData, setValue, location]);

  // Load initial data
  useEffect(() => {
    loadMasterData();
    loadPMPeriodeSettings();
    getLocation();

    const formId = searchParams.get('resubmit');
    if (formId) {
      loadFormData(formId);
    }
  }, []);

  const loadFormData = async (formId: string) => {
    try {
      const response = await api.get(`/form/${formId}`);
      const formData = response.data;

      Object.keys(formData).forEach((key) => {
        if (key in form.getValues()) {
          setValue(key as keyof FormVerificationCreate, formData[key]);
        }
      });

      const rejectedResponse = await api.get(`/form/rejected-photos/${formId}`);
      setRejectedPhotos(rejectedResponse.data.rejected_photos || {});
    } catch (error) {
      console.error('Error loading form data:', error);
      toast.error('Gagal memuat data form');
      router.push('/engineer/my-forms');
    }
  };

  const loadMasterData = async () => {
    setIsLoading(true);
    try {
      const response = await api.get<MasterData[]>('/master-data/');
      setMasterData(response.data);
    } catch (error) {
      toast.error('Gagal memuat data master');
    } finally {
      setIsLoading(false);
    }
  };

  const loadPMPeriodeSettings = async () => {
    try {
      const response = await api.get('/pm-settings/');
      setPmPeriodeList(response.data.periode_list);
    } catch (error) {
      console.error('Error loading PM Periode settings:', error);
      toast.error('Gagal memuat pengaturan periode PM');
    }
  };

  const handleFinalSubmit = (data: FormVerificationCreate) => {
    if (!location) {
      toast.error('Lokasi geografis wajib didapatkan secara otomatis sebelum submit form');
      return;
    }

    if (isFormDisabled) {
      toast.error('Lokasi Anda tidak valid, form tidak bisa dikirim');
      return;
    }

    const missingPhotos = validatePhotos(data, isResubmit, rejectedPhotos);
    if (missingPhotos.length > 0) {
      toast.error(`Harap lengkapi semua foto: ${missingPhotos.join(', ')}`);
      return;
    }

    setShowFinalConfirmModal(true);
  };

  const handleConfirmSubmit = async (data: FormVerificationCreate) => {
    try {
      const formId = searchParams.get('resubmit');

      if (isResubmit && formId && location) {
        const resubmitData = {
          resubmit_request: {
            foto_urls: photoUrls,
            geo_timestamp: new Date().toISOString(),
          },
          current_location: {
            latitude: location.latitude,
            longitude: location.longitude,
          },
        };

        await api.post(`/form/resubmit/${formId}`, resubmitData);
        toast.success('Form berhasil dikirim ulang!');
        router.push('/engineer/my-forms');
      } else {
        await submitForm(data, isResubmit, formId || undefined, photoUrls);
      }
    } catch (error: any) {
      console.error('Form submission error:', error);
      toast.error(error.response?.data?.detail || 'Gagal mengirim form');
      setShowFinalConfirmModal(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <BackButton variant="ghost" />
          {/* Device Status and Snapshot buttons only appear if TID is valid */}
          {tidValue && tidValue.trim() && (
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowDeviceStatusModal(true)}
                className="flex items-center gap-2 whitespace-nowrap"
                aria-label="Device Status"
              >
                <Cpu className="h-4 w-4" />
                <span>Device Status</span>
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowSnapshotModal(true)}
                className="flex items-center gap-2 whitespace-nowrap"
                aria-label="Snapshot"
              >
                <Camera className="h-4 w-4" />
                <span>Snapshot</span>
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="mb-10">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          {isResubmit ? 'Resubmit Verifikasi Nexus' : 'Verifikasi Nexus'}
        </h1>
        <p className="text-gray-600 mt-4 text-lg leading-relaxed">
          {isResubmit
            ? 'Lengkapi form verifikasi dengan foto yang perlu diresubmit'
            : 'Lengkapi form verifikasi dengan data yang akurat'}
        </p>
      </div>

      {/* Modal Warning Lokasi */}
      {showLocationWarning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full border border-red-200">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-2xl bg-red-100 mb-4">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-red-700 mb-4">Lokasi Tidak Valid</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
              Jarak Anda {currentDistance ? `${Math.round(currentDistance)} meter` : '-'} dari titik TID.
              Maksimal jarak yang diizinkan adalah 100 meter.
            </p>
              <Button 
                onClick={() => setShowLocationWarning(false)} 
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 font-semibold py-3"
              >
              Tutup
            </Button>
            </div>
          </div>
        </div>
      )}

      <form onSubmit={rhfHandleSubmit(handleFinalSubmit)} className="space-y-10">
        {/* TID tetap aktif */}
        <BasicInformation
          control={control}
          errors={errors}
          masterData={masterData}
          isLoading={isLoading}
          isResubmit={isResubmit}
          currentLocation={location}
          onLocationInvalid={(distance) => setCurrentDistance(distance)}
          isLocationValid={isLocationValid}
          startContinuousTracking={startContinuousTracking}
          stopContinuousTracking={stopContinuousTracking}
        />

        {/* Semua field lain disable dulu sampai lokasi valid */}
        <div className={isFormDisabled ? 'opacity-40 pointer-events-none transition-opacity duration-500' : 'transition-opacity duration-500'}>
          <LocationSection
            control={control}
            setValue={setValue}
            location={location}
            locationError={locationError}
            isLocating={isLocating}
            onRetryLocation={getLocation}
          />

          <ChecklistVerification control={control} isResubmit={isResubmit} />

          <PhotoDocumentation
            isResubmit={isResubmit}
            photoUrls={photoUrls}
            rejectedPhotos={rejectedPhotos}
            onPhotoUpload={handlePhotoUpload}
            disabled={isFormDisabled}
          />

          <SimCardRecommendation control={control} errors={errors} isResubmit={isResubmit} />

          <MaintenancePeriod control={control} errors={errors} pmPeriodeList={pmPeriodeList} isResubmit={isResubmit} />
        </div>

        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            disabled={isSubmitting || isFormDisabled}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-8 py-4 rounded-xl shadow-xl flex items-center justify-center transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 font-semibold text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                Mengirim Form...
              </>
            ) : (
              <>
                <CheckCircle className="mr-3 h-5 w-5" />
                Kirim Form Verifikasi
              </>
            )}
          </Button>
        </div>
      </form>

      <ConfirmPhotoModal
        isOpen={showFinalConfirmModal}
        onClose={() => setShowFinalConfirmModal(false)}
        onConfirm={rhfHandleSubmit(handleConfirmSubmit)}
        title={isResubmit ? 'Konfirmasi Akhir Pengiriman Ulang Form' : 'Konfirmasi Akhir Pengiriman Form'}
        description={
          isResubmit
            ? 'Pastikan foto yang diunggah adalah fakta dan sesuai kondisi lapangan. Tim verifikator berhak menolak verifikasi jika foto buram, hasil editan, atau tidak relevan. Ini adalah konfirmasi akhir sebelum form dikirim ulang.'
            : 'Pastikan foto yang diunggah adalah fakta dan sesuai kondisi lapangan. Tim verifikator berhak menolak verifikasi jika foto buram, hasil editan, atau tidak relevan. Ini adalah konfirmasi akhir sebelum form dikirim.'
        }
        isFinalConfirmation={true}
      />
      
      <DeviceStatusModal
        tid={tidValue}
        isOpen={showDeviceStatusModal}
        onClose={() => setShowDeviceStatusModal(false)}
      />
      
      <SnapshotModal
        tid={tidValue}
        isOpen={showSnapshotModal}
        onClose={() => setShowSnapshotModal(false)}
      />
    </div>
  );
}

function FormPageWrapper() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <FormPage />
    </Suspense>
  );
}

export default FormPageWrapper;
