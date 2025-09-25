import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface PhotoStatusIndicatorProps {
  status: 'ACCEPTED' | 'REJECTED' | 'PENDING';
  komentar?: string;
  className?: string;
}

const PhotoStatusIndicator: React.FC<PhotoStatusIndicatorProps> = ({ 
  status, 
  komentar, 
  className = '' 
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'ACCEPTED':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          text: 'Diterima',
          hoverColor: 'hover:bg-green-100'
        };
      case 'REJECTED':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          text: 'Ditolak',
          hoverColor: 'hover:bg-red-100'
        };
      case 'PENDING':
      default:
        return {
          icon: Clock,
          color: 'text-amber-600',
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          text: 'Menunggu',
          hoverColor: 'hover:bg-amber-100'
        };
    }
  };

  const { icon: Icon, color, bgColor, borderColor, text, hoverColor } = getStatusConfig();

  const statusElement = (
    <div className={`inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border transition-all duration-200 hover:scale-105 ${bgColor} ${borderColor} ${color} ${hoverColor} ${className}`}>
      <Icon className="mr-1.5 h-3.5 w-3.5" />
      <span className="font-bold">{text}</span>
      {komentar && (
        <AlertCircle className="ml-1.5 h-3 w-3 opacity-70" />
      )}
    </div>
  );

  if (komentar) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            {statusElement}
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-sm">{komentar}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return statusElement;
};

export default PhotoStatusIndicator;