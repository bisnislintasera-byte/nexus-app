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
      "flex items-start gap-3 p-4 rounded-xl text-sm shadow-sm",
      status === 'REJECTED' ? 'bg-red-50 border border-red-200/50' : 'bg-amber-50 border border-amber-200/50',
      className
    )}>
      {status === 'REJECTED' ? (
        <div className="p-1 bg-red-100 rounded-lg flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>
      ) : (
        <div className="p-1 bg-amber-100 rounded-lg flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-amber-600" />
        </div>
      )}
      <div className="flex-1">
        <p className={cn(
          "font-semibold mb-2",
          status === 'REJECTED' ? 'text-red-800' : 'text-amber-800'
        )}>
          {status === 'REJECTED' ? 'Foto Ditolak' : 'Perlu Perbaikan'}
        </p>
        <p className={cn(
          "text-sm leading-relaxed",
          status === 'REJECTED' ? 'text-red-700' : 'text-amber-700'
        )}>
          {comment}
        </p>
      </div>
    </div>
  );
}