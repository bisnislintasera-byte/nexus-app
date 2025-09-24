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
      <div key={fieldName} className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="p-2 bg-gray-50 border-b border-gray-200">
          <Label className="text-sm text-gray-700">{PHOTO_FIELD_LABELS[fieldName]}</Label>
        </div>
        <div className="relative">
          <img 
            src={photoUrl} 
            alt={PHOTO_FIELD_LABELS[fieldName]} 
            className="w-full h-40 object-cover cursor-pointer"
            onClick={() => setEnlargedImage(photoUrl)}
          />
          <Button 
            variant="ghost" 
            size="sm"
            className="absolute top-2 right-2 bg-white bg-opacity-80 hover:bg-opacity-100"
            onClick={() => setEnlargedImage(photoUrl)}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
        <div className="p-2 bg-gray-50 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <PhotoStatusIndicator 
              status={detail.status as 'ACCEPTED' | 'REJECTED' | 'PENDING'} 
              komentar={detail.komentar}
            />
            <Button
              size="sm"
              variant={detail.status === 'REJECTED' ? 'destructive' : 'outline'}
              onClick={() => onReject(fieldName)}
              disabled={disabled}
            >
              {detail.status === 'REJECTED' ? 'Batal Tolak' : 'Tolak'}
            </Button>
          </div>
          {detail.status === 'REJECTED' && (
            <div className="mt-2">
              <Label className="text-xs text-gray-500">Komentar Penolakan</Label>
              <Textarea
                value={detail.komentar}
                onChange={(e) => onCommentChange(fieldName, e.target.value)}
                placeholder="Masukkan komentar penolakan..."
                className="mt-1 text-xs"
                rows={2}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 [&>*:last-child]:col-span-1 sm:[&>*:last-child]:col-span-2 md:[&>*:last-child]:col-span-3">
        {Object.keys(PHOTO_FIELD_LABELS).map((fieldName) => 
          renderPhotoCard(fieldName as PhotoField)
        )}
      </div>

      {enlargedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={enlargedImage} 
              alt="Enlarged view" 
              className="max-w-full max-h-full object-contain"
            />
            <Button
              onClick={(e) => {
                e.stopPropagation();
                setEnlargedImage(null);
              }}
              className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 text-gray-800 rounded-full p-2"
            >
              <Image className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}

      {Object.keys(photos).length === 0 && (
        <div className="text-center py-8">
          <Image className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada foto</h3>
          <p className="mt-1 text-sm text-gray-500">
            Engineer belum mengunggah foto dokumentasi untuk form ini.
          </p>
        </div>
      )}
    </div>
  );
};