'use client';

import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Camera, X, Loader2, AlertCircle } from 'lucide-react';

interface CameraUploadProps {
  onCapture: (file: File) => void;
  isUploading?: boolean;
  label: string;
  previewUrl?: string | null;
  onRemove?: () => void;
  disabled?: boolean;
  className?: string;
}

export function CameraUpload({
  onCapture,
  isUploading,
  label,
  previewUrl,
  onRemove,
  disabled,
  className = ''
}: CameraUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validasi tipe file
    if (!file.type.startsWith('image/')) {
      toast.error('Hanya file gambar yang diperbolehkan');
      return;
    }

    // Validasi ukuran file (maks 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Ukuran file maksimal 10MB');
      return;
    }

    onCapture(file);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            capture="environment"
            className="hidden"
            disabled={disabled || isUploading}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="w-full flex items-center justify-center gap-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Mengunggah...</span>
              </>
            ) : (
              <>
                <Camera className="h-5 w-5" />
                <span>{label}</span>
              </>
            )}
          </Button>
        </div>

        {previewUrl && (
          <div className="relative">
            <div className="h-16 w-16 rounded-md overflow-hidden border border-gray-200">
              <img
                src={previewUrl}
                alt={label}
                className="h-full w-full object-cover cursor-pointer"
                onClick={() => window.open(previewUrl, '_blank')}
              />
            </div>
            {onRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                aria-label="Hapus foto"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {!previewUrl && !isUploading && (
        <div className="flex items-center text-xs text-gray-500">
          <AlertCircle className="mr-1 h-3 w-3" />
          Klik untuk mengambil foto menggunakan kamera
        </div>
      )}
    </div>
  );
}