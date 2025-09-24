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
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-yellow-50 text-yellow-700 border border-yellow-200 shadow-sm">
          <Clock className="mr-1.5 h-3 w-3" />
          Menunggu Verifikasi
        </span>
      );
    case 'APPROVED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200 shadow-sm">
          <CheckCircle className="mr-1.5 h-3 w-3" />
          Disetujui
        </span>
      );
    case 'REJECTED':
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-200 shadow-sm">
          <XCircle className="mr-1.5 h-3 w-3" />
          Ditolak
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200 shadow-sm">
          Unknown
        </span>
      );
  }
};