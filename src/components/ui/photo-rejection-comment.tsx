import React from 'react';
import { AlertCircle } from 'lucide-react';

interface PhotoRejectionCommentProps {
  komentar: string;
}

const PhotoRejectionComment: React.FC<PhotoRejectionCommentProps> = ({ komentar }) => {
  if (!komentar) return null;

  return (
    <div className="mt-2 p-3 bg-red-50 rounded-lg border border-red-200">
      <div className="flex items-start">
        <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
        <p className="text-red-800 text-sm">{komentar}</p>
      </div>
    </div>
  );
};

export default PhotoRejectionComment;