import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertCircle, Camera, Image } from 'lucide-react';
import FileUpload from '@/components/file-upload';
import { RejectedPhotoIndicator } from './RejectedPhotoIndicator';

interface PhotoDocumentationProps {
  isResubmit: boolean;
  photoUrls: Record<string, string>;
  rejectedPhotos: Record<string, { status: string; komentar: string }>;
  onPhotoUpload: (url: string, fieldName: string) => void;
  disabled?: boolean;
}

const photoFields = [
  { name: 'FOTO_MINI_PC_FULL', label: 'Foto Mini PC Full' },
  { name: 'FOTO_SN_MINI_PC', label: 'Foto SN Mini PC' },
  { name: 'FOTO_TID', label: 'Foto TID' },
  { name: 'FOTO_DASHBOARD_VIMS', label: 'Foto Dashboard VIMS' },
  { name: 'FOTO_SIGNAL_MODEM', label: 'Foto Signal Modem' },
  { name: 'FOTO_STORAGE_MINI', label: 'Foto Storage Mini' },
  { name: 'FOTO_TEMUAN_RUSAK', label: 'Foto Temuan Rusak' },
];

export const PhotoDocumentation: React.FC<PhotoDocumentationProps> = ({
  isResubmit,
  photoUrls,
  rejectedPhotos,
  onPhotoUpload,
  disabled
}) => {
  return (
    <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b">
        <CardTitle className="flex items-center text-lg sm:text-xl">
          <Camera className="mr-2 h-5 w-5 text-amber-600" />
          Dokumentasi Foto
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="mb-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 mr-2 flex-shrink-0" />
            <div>
              {isResubmit ? (
                <>
                  <p className="text-sm font-medium text-amber-800">Foto yang Perlu Diperbaiki</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Silakan unggah ulang foto yang ditolak sesuai dengan catatan dari verifikator.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-medium text-amber-800">Dokumentasi Foto Baru</p>
                  <p className="text-xs text-amber-700 mt-1">
                    Ambil foto sesuai dengan ketentuan untuk setiap item yang diperlukan.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {photoFields.map((field) => (
            <div key={field.name} className="space-y-3">
              {isResubmit && rejectedPhotos[field.name] && (
                <RejectedPhotoIndicator
                  status={rejectedPhotos[field.name].status}
                  comment={rejectedPhotos[field.name].komentar}
                />
              )}
              <FileUpload
                fieldName={field.name}
                label={field.label}
                onUploadSuccess={onPhotoUpload}
                existingUrl={photoUrls[field.name]}
                isResubmit={isResubmit}
                status={isResubmit ? (rejectedPhotos[field.name]?.status as 'ACCEPTED' | 'REJECTED' | 'PENDING') : undefined}
                komentar={rejectedPhotos[field.name]?.komentar || ''}
                disabled={disabled}
              />
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start">
            <Image className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              <span className="font-medium">Petunjuk:</span> Unggah foto dokumentasi untuk setiap item yang diperlukan. 
              Foto akan secara otomatis diberi watermark dengan timestamp saat pengambilan foto.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};