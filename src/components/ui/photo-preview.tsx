'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { ImageIcon, ZoomIn } from 'lucide-react';
import Image from 'next/image';

interface PhotoPreviewProps {
  url: string;
  alt?: string;
  className?: string;
}

export default function PhotoPreview({ url, alt, className }: PhotoPreviewProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className={`relative group ${className}`}>
          <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200">
            <Image
              src={url}
              alt={alt || 'Preview'}
              fill
              className="object-cover"
              sizes="80px"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <div className="relative w-full h-[80vh]">
          <Image
            src={url}
            alt={alt || 'Full preview'}
            fill
            className="object-contain"
            sizes="(max-width: 768px) 100vw, 80vw"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}