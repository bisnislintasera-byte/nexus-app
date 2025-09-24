import React from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

interface PhotoStatusIndicatorProps {
  status: 'ACCEPTED' | 'REJECTED' | 'PENDING';
  komentar?: string;
}

const PhotoStatusIndicator: React.FC<PhotoStatusIndicatorProps> = ({ status, komentar }) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'ACCEPTED':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200/50',
          text: 'Diterima'
        };
      case 'REJECTED':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200/50',
          text: 'Ditolak'
        };
      case 'PENDING':
      default:
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200/50',
          text: 'Menunggu'
        };
    }
  };

  const { icon: Icon, color, bgColor, borderColor, text } = getStatusConfig();

  return (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm ${bgColor} ${borderColor} border ${color}`}>
      <Icon className="mr-1.5 h-3.5 w-3.5" />
      <span className="font-medium">{text}</span>
      {komentar && (
        <span className="ml-1.5 font-bold" title={komentar}>
          *
        </span>
      )}
    </div>
  );
};

export default PhotoStatusIndicator;