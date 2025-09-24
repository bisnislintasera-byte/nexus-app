import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface LocationAlertProps {
  isOpen: boolean;
  onClose: () => void;
  distance: number;
}

export function LocationAlert({ isOpen, onClose, distance }: LocationAlertProps) {
  const formattedDistance = distance >= 1000 
    ? `${(distance / 1000).toFixed(2)} kilometer` 
    : `${Math.round(distance)} meter`;

  if (!isOpen) return null;

  return (
    <Card className="bg-red-50 border-red-200 mb-4">
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h3 className="font-medium text-red-900">Lokasi Terlalu Jauh</h3>
            <p className="text-sm text-red-700 mt-1">
              Jarak Anda dengan lokasi TID adalah <strong>{formattedDistance}</strong>.
              Anda harus berada dalam radius 100 meter untuk melanjutkan.
            </p>
            <div className="mt-3">
              <p className="text-sm text-red-600 font-medium">Silakan periksa:</p>
              <ul className="mt-1 text-sm text-red-600 list-disc pl-5 space-y-1">
                <li>GPS/Lokasi sudah diaktifkan</li>
                <li>Anda berada di lokasi TID yang benar</li>
                <li>Refresh halaman jika sudah berada di lokasi yang tepat</li>
              </ul>
            </div>
            <div className="mt-3 flex justify-end">
              <Button 
                variant="outline"
                size="sm"
                onClick={onClose}
                className="text-red-600 border-red-200 hover:bg-red-100"
              >
                Tutup Peringatan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}