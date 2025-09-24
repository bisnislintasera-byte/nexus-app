import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ZoomIn, Image } from 'lucide-react';
import { PhotoGalleryProps } from '@/types/verification';
import PhotoStatusIndicator from '@/components/ui/photo-status-indicator';
import { PHOTO_FIELD_LABELS, PhotoField } from '@/types/verification';

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  details,
  onReject,
  onCommentChange,
  disabled = false
}) => {
  const [enlargedImage, setEnlargedImage] = React.useState<string | null>(null);

  const renderPhotoCard = (fieldName: PhotoField) => {
    const photoUrl = photos[fieldName];
    if (!photoUrl) return null;

    const detail = details[fieldName] || { status: 'ACCEPTED', komentar: '' };

    return (
      <div key={fieldName} className="border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300">
        <div className="p-3 bg-gray-50 border-b border-gray-200">
          <Label className="text-sm text-gray-800 font-semibold">{PHOTO_FIELD_LABELS[fieldName]}</Label>
        </div>
        <div className="relative">
          <img 
            src={photoUrl} 
            alt={PHOTO_FIELD_LABELS[fieldName]} 
            className="w-full h-48 object-cover cursor-pointer hover:scale-105 transition-transform duration-300"
            onClick={() => setEnlargedImage(photoUrl)}
          />
          <Button 
            variant="ghost" 
            size="sm"
            className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
            onClick={() => setEnlargedImage(photoUrl)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-4 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <PhotoStatusIndicator 
              status={detail.status as 'ACCEPTED' | 'REJECTED' | 'PENDING'} 
              komentar={detail.komentar}
            />
            <Button
              size="sm"
              variant={detail.status === 'REJECTED' ? 'destructive' : 'outline'}
              onClick={() => onReject(fieldName)}
              disabled={disabled}
              className="font-semibold"
            >
              {detail.status === 'REJECTED' ? 'Batal Tolak' : 'Tolak'}
            </Button>
          </div>
          {detail.status === 'REJECTED' && (
            <div className="mt-3">
              <Label className="text-xs text-gray-600 font-semibold uppercase tracking-wide">Komentar Penolakan</Label>
              <Textarea
                value={detail.komentar}
                onChange={(e) => onCommentChange(fieldName, e.target.value)}
                placeholder="Masukkan komentar penolakan..."
                className="mt-2 text-sm"
                rows={3}
                disabled={disabled}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 [&>*:last-child]:col-span-1 sm:[&>*:last-child]:col-span-2 md:[&>*:last-child]:col-span-3">
        {Object.keys(PHOTO_FIELD_LABELS).map((fieldName) => 
          renderPhotoCard(fieldName as PhotoField)
        )}
      </div>

      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-5xl max-h-full">
            <img 
              src={enlargedImage} 
              alt="Enlarged view" 
              className="max-w-full max-h-full object-contain rounded-xl shadow-2xl"
            />
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setEnlargedImage(null);
              }}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-xl p-3 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}

      {Object.keys(photos).length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
            <Image className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Tidak ada foto</h3>
          <p className="text-gray-500">
            Engineer belum mengunggah foto dokumentasi untuk form ini.
          </p>
        </div>
      )}
    </div>
  );
};