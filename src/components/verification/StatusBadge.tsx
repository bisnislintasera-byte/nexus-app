import React from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import type { VerificationStatus } from '@/types';

export interface StatusBadgeProps {
  status: VerificationStatus;
  className?: string;
}

export const StatusBadge = ({ status, className = '' }: StatusBadgeProps) => {
  const baseClasses = "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border transition-all duration-200 hover:scale-105";
  
  switch (status) {
    case 'PENDING':
      return (
        <span className={`${baseClasses} bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100 ${className}`}>
          <Clock className="mr-1.5 h-3.5 w-3.5" />
          Menunggu Verifikasi
        </span>
      );
    case 'APPROVED':
      return (
        <span className={`${baseClasses} bg-green-50 text-green-800 border-green-200 hover:bg-green-100 ${className}`}>
          <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
          Disetujui
        </span>
      );
    case 'REJECTED':
      return (
        <span className={`${baseClasses} bg-red-50 text-red-800 border-red-200 hover:bg-red-100 ${className}`}>
          <XCircle className="mr-1.5 h-3.5 w-3.5" />
          Ditolak
        </span>
      );
    default:
      return (
        <span className={`${baseClasses} bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100 ${className}`}>
          <XCircle className="mr-1.5 h-3.5 w-3.5" />
          Unknown
        </span>
      );
  }
};