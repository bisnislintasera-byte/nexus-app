import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import type { VerificationStatus } from '@/types';

export interface StatusBadgeProps {
  status: VerificationStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case 'PENDING':
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 shadow-sm">
          <Clock className="mr-2 h-3.5 w-3.5" />
          Menunggu Verifikasi
        </span>
      );
    case 'APPROVED':
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-50 text-green-800 border border-green-200 shadow-sm">
          <CheckCircle className="mr-2 h-3.5 w-3.5" />
          Disetujui
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-red-50 text-red-800 border border-red-200 shadow-sm">
          <XCircle className="mr-2 h-3.5 w-3.5" />
          Ditolak
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-gray-50 text-gray-800 border border-gray-200 shadow-sm">
          Unknown
        </span>
      );
  }
};