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
          bgColor: 'bg-green-100',
          borderColor: 'border-green-200',
          text: 'Diterima'
        };
      case 'REJECTED':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-100',
          borderColor: 'border-red-200',
          text: 'Ditolak'
        };
      case 'PENDING':
      default:
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100',
          borderColor: 'border-yellow-200',
          text: 'Menunggu'
        };
    }
  };

  const { icon: Icon, color, bgColor, borderColor, text } = getStatusConfig();

  return (
    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${bgColor} ${borderColor} border ${color}`}>
      <Icon className="mr-1 h-3 w-3" />
      <span>{text}</span>
      {komentar && (
        <span className="ml-1" title={komentar}>
          *
        </span>
      )}
    </div>
  );
};

export default PhotoStatusIndicator;