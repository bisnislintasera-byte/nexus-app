import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Camera, RotateCcw } from 'lucide-react';

interface PhotoPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  previewUrl: string;
  onConfirm: () => void;
  onRetake: () => void;
  label: string;
}

export function PhotoPreviewModal({
  isOpen,
  onClose,
  previewUrl,
  onConfirm,
  onRetake,
  label
}: PhotoPreviewModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Preview Foto {label}</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-gray-200">
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-contain bg-gray-50"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onRetake}
              className="flex-1 flex items-center justify-center gap-3 py-3 font-semibold"
            >
              <RotateCcw className="h-5 w-5" />
              Foto Ulang
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              className="flex-1 flex items-center justify-center gap-3 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 font-semibold shadow-lg hover:shadow-xl"
            >
              <Camera className="h-5 w-5" />
              Gunakan Foto Ini
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}