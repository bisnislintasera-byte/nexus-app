import React from 'react';
import { XCircle } from 'lucide-react';
import { Button } from './button';

interface LocationMismatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  distance: number | null;
  tid?: string;
}

export function LocationMismatchModal({ isOpen, onClose, distance, tid }: LocationMismatchModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
        <div className="flex flex-col items-center text-center">
          <XCircle className="h-12 w-12 text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Lokasi Tidak Sesuai
          </h3>
          <p className="text-gray-600 mb-4">
            {tid ? `Lokasi Anda terlalu jauh dari TID ${tid}.` : 'Tolong sesuaikan posisi Anda dengan lokasi ITD.'}
            {distance && (
              <span className="block mt-2 font-medium text-red-600">
                Jarak Anda saat ini: {Math.round(distance)} meter
                <br/>
                <span className="text-sm">(maksimal jarak yang diizinkan: 100 meter)</span>
              </span>
            )}
          </p>
          <Button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white w-full"
          >
            Kembali
          </Button>
        </div>
      </div>
    </div>
  );
}