import React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ZoomIn, Image, X, AlertCircle, CheckCircle } from 'lucide-react';
import { PhotoGalleryProps } from '@/types/verification';
import PhotoStatusIndicator from '@/components/ui/photo-status-indicator';
import { PHOTO_FIELD_LABELS, PhotoField } from '@/types/verification';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

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
      <div key={fieldName} className="group border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <Label className="text-sm text-gray-800 font-bold">{PHOTO_FIELD_LABELS[fieldName]}</Label>
        </div>
        <div className="relative overflow-hidden">
          <img 
            src={photoUrl} 
            alt={PHOTO_FIELD_LABELS[fieldName]} 
            className="w-full h-48 object-cover cursor-pointer transition-transform duration-300 group-hover:scale-105"
            onClick={() => setEnlargedImage(photoUrl)}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
            <Button 
              variant="secondary" 
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 hover:bg-white rounded-lg shadow-lg hover:shadow-xl"
              onClick={(e) => {
                e.stopPropagation();
                setEnlargedImage(photoUrl);
              }}
            >
              <ZoomIn className="h-4 w-4 mr-2" />
              Perbesar
            </Button>
          </div>
        </div>
        <div className="p-4 bg-white">
          <div className="flex items-center justify-between mb-4">
            <PhotoStatusIndicator 
              status={detail.status as 'ACCEPTED' | 'REJECTED' | 'PENDING'} 
              komentar={detail.komentar}
            />
            <Button
              size="sm"
              variant={detail.status === 'REJECTED' ? 'destructive' : 'outline'}
              onClick={() => onReject(fieldName)}
              disabled={disabled}
              className="font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              {detail.status === 'REJECTED' ? (
                <>
                  <CheckCircle className="mr-1.5 h-4 w-4" />
                  Terima
                </>
              ) : (
                <>
                  <X className="mr-1.5 h-4 w-4" />
                  Tolak
                </>
              )}
            </Button>
          </div>
          {detail.status === 'REJECTED' && (
            <div className="space-y-3">
              <Label className="text-xs text-gray-600 font-bold uppercase tracking-wide">
                Komentar Penolakan
              </Label>
              <Textarea
                value={detail.komentar}
                onChange={(e) => onCommentChange(fieldName, e.target.value)}
                placeholder="Masukkan alasan penolakan foto..."
                className="text-sm resize-none"
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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {Object.keys(PHOTO_FIELD_LABELS).map((fieldName) => 
          renderPhotoCard(fieldName as PhotoField)
        )}
      </div>

      {Object.keys(photos).filter(key => photos[key]).length === 0 && (
        <div className="text-center py-16">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
            <Image className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Tidak ada foto</h3>
          <p className="text-gray-500 text-lg">
            Engineer belum mengunggah foto dokumentasi untuk form ini.
          </p>
        </div>
      )}

      {/* Image Enlargement Modal */}
      <Dialog open={!!enlargedImage} onOpenChange={() => setEnlargedImage(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] p-0">
          <div className="relative">
            <img 
              src={enlargedImage || ''} 
              alt="Enlarged view" 
              className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
            />
            <Button
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-lg p-3 shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};