import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PhotoRejectionCommentProps {
  komentar: string;
}

const PhotoRejectionComment: React.FC<PhotoRejectionCommentProps> = ({ komentar }) => {
  if (!komentar) return null;

  return (
    <div className="p-4 bg-red-50 rounded-xl border border-red-200/50 shadow-sm">
      <div className="flex items-start">
        <div className="p-1 bg-red-100 rounded-lg mr-3 flex-shrink-0">
          <AlertCircle className="h-5 w-5 text-red-600" />
        </div>
        <p className="text-red-900 text-sm leading-relaxed font-medium">{komentar}</p>
      </div>
    </div>
  );
};

export default PhotoRejectionComment;