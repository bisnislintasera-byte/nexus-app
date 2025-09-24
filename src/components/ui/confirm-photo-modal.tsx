'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

interface ConfirmPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  isFinalConfirmation?: boolean;
}

export default function ConfirmPhotoModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  description,
  isFinalConfirmation = false
}: ConfirmPhotoModalProps) {
  const [isConfirming, setIsConfirming] = useState(false);

  const handleConfirm = async () => {
    setIsConfirming(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setIsConfirming(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-bold">
            {isFinalConfirmation ? (
              <div className="p-2 bg-red-100 rounded-xl mr-3">
                <AlertCircle className="h-6 w-6 text-red-600" />
              </div>
            ) : (
              <div className="p-2 bg-blue-100 rounded-xl mr-3">
                <CheckCircle className="h-6 w-6 text-blue-600" />
              </div>
            )}
            {title}
          </DialogTitle>
          <DialogDescription className="text-base text-gray-700 mt-3 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-6">
          <div className="flex items-start p-4 bg-blue-50 rounded-xl border border-blue-200/50">
            <div className="p-1 bg-blue-100 rounded-lg mr-3 flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm text-blue-900 leading-relaxed">
              <span className="font-medium">Perhatian:</span> Pastikan foto yang diunggah adalah fakta dan sesuai kondisi lapangan. 
              Tim verifikator berhak menolak verifikasi jika foto buram, hasil editan, atau tidak relevan.
            </p>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex items-center justify-center w-full sm:w-auto"
            disabled={isConfirming}
          >
            <XCircle className="mr-2 h-5 w-5" />
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isConfirming}
            className={`flex items-center justify-center w-full sm:w-auto font-semibold ${
              isFinalConfirmation 
                ? "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-xl" 
                : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl"
            }`}
          >
            {isConfirming ? (
              <>
                <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                {isFinalConfirmation ? 'Mengirim Ulang...' : 'Mengirim...'}
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-5 w-5" />
                {isFinalConfirmation ? 'Kirim Ulang Form' : 'Kirim Form'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}