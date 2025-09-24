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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center text-lg sm:text-xl">
            {isFinalConfirmation ? (
              <AlertCircle className="mr-2 h-5 w-5 text-red-500" />
            ) : (
              <CheckCircle className="mr-2 h-5 w-5 text-blue-500" />
            )}
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600 mt-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <div className="flex items-start p-3 bg-blue-50 rounded-lg border border-blue-200">
            <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
            <p className="text-sm text-blue-800">
              <span className="font-medium">Perhatian:</span> Pastikan foto yang diunggah adalah fakta dan sesuai kondisi lapangan. 
              Tim verifikator berhak menolak verifikasi jika foto buram, hasil editan, atau tidak relevan.
            </p>
          </div>
        </div>
        <DialogFooter className="flex space-x-2 sm:space-x-3">
          <Button
            onClick={onClose}
            variant="outline"
            className="flex items-center"
            disabled={isConfirming}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Batal
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isConfirming}
            className={isFinalConfirmation ? "bg-red-600 hover:bg-red-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
          >
            {isConfirming ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-t-transparent"></div>
                {isFinalConfirmation ? 'Mengirim Ulang...' : 'Mengirim...'}
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                {isFinalConfirmation ? 'Kirim Ulang Form' : 'Kirim Form'}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}