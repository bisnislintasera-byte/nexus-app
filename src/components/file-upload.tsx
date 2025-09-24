'use client';

import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import ConfirmPhotoModal from '@/components/ui/confirm-photo-modal';
import PhotoStatusIndicator from '@/components/ui/photo-status-indicator';
import { PhotoPreviewModal } from '@/components/ui/photo-preview-modal';
import { Button } from '@/components/ui/button';
import { useImageWatermark } from '@/hooks/useImageWatermark';
import { 
  X, 
  Loader2,
  Camera,
  AlertCircle
} from 'lucide-react';

interface FileUploadProps {
  onUploadSuccess: (url: string, fieldName: string) => void;
  fieldName: string;
  label: string;
  existingUrl?: string;
  isResubmit?: boolean;
  status?: 'ACCEPTED' | 'REJECTED' | 'PENDING';
  komentar?: string;
  disabled?: boolean;
}

export default function FileUpload({ 
  onUploadSuccess, 
  fieldName, 
  label,
  existingUrl,
  isResubmit = false,
  status,
  komentar,
  disabled = false
}: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl || null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [watermarkedPreview, setWatermarkedPreview] = useState<string | null>(null);
  const [processedFile, setProcessedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { addWatermark, isProcessing } = useImageWatermark();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.loading('Memproses foto...', { id: 'prepare-photo' });

    if (!file.type.startsWith('image/')) {
      toast.error('Format file tidak valid', { id: 'prepare-photo' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 10MB', { id: 'prepare-photo' });
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    if (previewUrl) {
      handleRemove();
    }

    setSelectedFile(file);
    toast.success('Foto siap diproses', { id: 'prepare-photo' });

    await processSelectedFile(file);
  };

  const processSelectedFile = async (file: File) => {
    setIsUploading(true);
    toast.loading('Menambahkan watermark...', { id: 'process-photo' });

    try {
      const result = await addWatermark(file, {
        fontSize: 16,
        padding: 12,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        textColor: '#FFFFFF'
      });

      if (!result || !result.previewUrl || !result.file) {
        throw new Error('Gagal memproses watermark');
      }

      setWatermarkedPreview(result.previewUrl);
      setProcessedFile(result.file);
      toast.success('Foto berhasil diproses', { id: 'process-photo' });
      setShowPreviewModal(true);
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Gagal memproses foto', { id: 'process-photo' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleConfirmUpload = async () => {
    if (!processedFile) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', processedFile);
      
      const response = await api.post('/form/upload-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const { url } = response.data;
      setPreviewUrl(url);
      onUploadSuccess(url, fieldName);
      toast.success(`${label} berhasil diunggah`);

      setSelectedFile(null);
      setWatermarkedPreview(null);
      setProcessedFile(null);
      setShowConfirmModal(false);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.detail || 'Gagal mengunggah foto');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setWatermarkedPreview(null);
    setProcessedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    onUploadSuccess('', fieldName);
  };

  const handleCloseModal = () => {
    setShowConfirmModal(false);
    setSelectedFile(null);
    setWatermarkedPreview(null);
    setProcessedFile(null);
  };

  if (isResubmit && status === 'ACCEPTED') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700 flex items-center">
          <Camera className="mr-2 h-4 w-4 text-gray-500" />
          {label}
        </label>
        <div className="flex items-center space-x-4">
          <div className="w-full p-3 bg-green-50 border border-green-200 rounded-md text-center text-green-800">
            Foto ini sudah diterima
          </div>
          {previewUrl && (
            <div className="relative">
              <div className="h-16 w-16 rounded-md overflow-hidden border">
                <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
              </div>
              <div className="absolute -top-2 -right-2">
                <PhotoStatusIndicator status="ACCEPTED" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-3 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <label className="text-sm font-semibold text-gray-800 flex items-center">
        <Camera className="mr-2 h-4 w-4 text-gray-500" />
        {label}
        {isResubmit && status === 'REJECTED' && (
          <span className="ml-3">
            <PhotoStatusIndicator status={status} komentar={komentar} />
          </span>
        )}
      </label>

      <div className="flex items-center space-x-6">
        <div className="flex-1">
          {/* File input langsung pakai capture */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
            disabled={isUploading || disabled || (isResubmit && status !== 'REJECTED')}
          />

          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || disabled || (isResubmit && status !== 'REJECTED')}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
          >
            {isUploading || isProcessing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-medium">{isProcessing ? 'Memproses...' : 'Mengunggah...'}</span>
              </>
            ) : (
              <>
                <Camera className="h-5 w-5" />
                <span className="font-medium">Ambil Foto dengan Kamera</span>
              </>
            )}
          </Button>
        </div>

        {previewUrl && (
          <div className="relative">
            <div className="h-20 w-20 rounded-xl overflow-hidden border-2 border-gray-200 shadow-md">
              <img src={previewUrl} alt={label} className="h-full w-full object-cover" />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-all duration-200 hover:scale-110"
              aria-label={`Hapus foto ${label}`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Loader status */}
      {(isUploading || isProcessing) && (
        <div className="mt-3 p-3 bg-blue-50 border border-blue-200/50 rounded-xl text-sm text-blue-700 flex items-center">
          <Loader2 className="mr-3 h-4 w-4 animate-spin" />
          {isProcessing ? 'Memproses watermark...' : 'Mengunggah foto...'}
        </div>
      )}

      {/* Info */}
      {!previewUrl && !isUploading && (
        <div className="text-xs text-gray-600 flex items-center gap-2 font-medium">
          <AlertCircle className="h-3 w-3" />
          Kamera akan terbuka saat klik tombol
        </div>
      )}

      {/* Modal Preview Foto */}
      <PhotoPreviewModal
        isOpen={showPreviewModal}
        onClose={() => {
          setShowPreviewModal(false);
          setWatermarkedPreview(null);
          setProcessedFile(null);
        }}
        previewUrl={watermarkedPreview || ''}
        onConfirm={() => {
          setShowPreviewModal(false);
          setShowConfirmModal(true);
        }}
        onRetake={() => {
          setShowPreviewModal(false);
          setWatermarkedPreview(null);
          setProcessedFile(null);
          fileInputRef.current?.click();
        }}
        label={label}
      />

      {/* Modal Konfirmasi Final */}
      <ConfirmPhotoModal
        isOpen={showConfirmModal}
        onClose={handleCloseModal}
        onConfirm={handleConfirmUpload}
        title={`Konfirmasi Upload ${label}`}
        description="Pastikan foto sesuai kondisi lapangan. Tim verifikator berhak menolak jika buram atau tidak relevan."
      />
    </div>
  );
}
