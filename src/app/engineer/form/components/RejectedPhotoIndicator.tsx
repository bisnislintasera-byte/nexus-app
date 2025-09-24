import React from 'react';
import { AlertCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RejectedPhotoIndicatorProps {
  status: string;
  comment: string;
  className?: string;
}

export function RejectedPhotoIndicator({ status, comment, className }: RejectedPhotoIndicatorProps) {
  return (
    <div className={cn(
      "flex items-start gap-2 p-3 rounded-lg text-sm",
      status === 'REJECTED' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200',
      className
    )}>
      {status === 'REJECTED' ? (
        <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
      ) : (
        <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
      )}
      <div className="flex-1">
        <p className={cn(
          "font-medium mb-1",
          status === 'REJECTED' ? 'text-red-700' : 'text-yellow-700'
        )}>
          {status === 'REJECTED' ? 'Foto Ditolak' : 'Perlu Perbaikan'}
        </p>
        <p className={cn(
          "text-sm",
          status === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'
        )}>
          {comment}
        </p>
      </div>
    </div>
  );
}