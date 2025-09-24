'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { MapPin } from 'lucide-react';

interface LocationWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
  distance: number | null;
}

export function LocationWarningModal({
  isOpen,
  onClose,
  distance
}: LocationWarningModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-red-600">
            <MapPin className="mr-2 h-5 w-5" />
            Lokasi Tidak Sesuai
          </DialogTitle>
          <DialogDescription className="pt-4 space-y-3">
            <p>
              Anda berada terlalu jauh dari lokasi TID yang dipilih.
              {distance && (
                <span className="font-medium block mt-1">
                  Jarak saat ini: {Math.round(distance)} meter (maksimum 100 meter)
                </span>
              )}
            </p>
            <p className="text-sm">
              Harap pindah ke lokasi TID yang sesuai untuk dapat mengisi form verifikasi.
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end">
          <Button onClick={onClose} variant="outline">
            Tutup
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}