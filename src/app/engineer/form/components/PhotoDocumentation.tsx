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
    <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border-0">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-100">
        <CardTitle className="flex items-center text-xl font-bold">
          <div className="p-2 bg-amber-100 rounded-xl mr-3">
            <Camera className="h-6 w-6 text-amber-600" />
          </div>
          Dokumentasi Foto
        </CardTitle>
      </CardHeader>
      <CardContent className="p-8">
        <div className="mb-6 p-4 bg-amber-50 rounded-xl border border-amber-200/50">
          <div className="flex items-start">
            <div className="p-1 bg-amber-100 rounded-lg mr-3 flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              {isResubmit ? (
                <>
                  <p className="text-sm font-semibold text-amber-900">Foto yang Perlu Diperbaiki</p>
                  <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                    Silakan unggah ulang foto yang ditolak sesuai dengan catatan dari verifikator.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm font-semibold text-amber-900">Dokumentasi Foto Baru</p>
                  <p className="text-sm text-amber-800 mt-1 leading-relaxed">
                    Ambil foto sesuai dengan ketentuan untuk setiap item yang diperlukan.
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {photoFields.map((field) => (
            <div key={field.name} className="space-y-4">
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
        <div className="mt-8 p-5 bg-blue-50 rounded-xl border border-blue-200/50">
          <div className="flex items-start">
            <div className="p-1 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
              <Image className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm text-blue-900 leading-relaxed">
              <span className="font-medium">Petunjuk:</span> Unggah foto dokumentasi untuk setiap item yang diperlukan. 
              Foto akan secara otomatis diberi watermark dengan timestamp saat pengambilan foto.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};