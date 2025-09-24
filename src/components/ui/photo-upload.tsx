'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Camera, X, Image as ImageIcon, RotateCw } from 'lucide-react';
import Image from 'next/image';

interface PhotoUploadProps {
  label: string;
  required?: boolean;
  value?: string;
  onChange: (value: string | null) => void;
  onError?: (error: string) => void;
  maxSize?: number; // in MB
  aspectRatio?: number; // width/height
  className?: string;
}

export function PhotoUpload({
  label,
  required,
  value,
  onChange,
  onError,
  maxSize = 5, // default 5MB
  aspectRatio,
  className,
}: PhotoUploadProps) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    try {
      setLoading(true);

      // Validate file size
      if (file.size > maxSize * 1024 * 1024) {
        throw new Error(`File size must be less than ${maxSize}MB`);
      }

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // If aspectRatio is specified, validate image dimensions
      if (aspectRatio) {
        const img = document.createElement('img');
        await new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
          img.src = URL.createObjectURL(file);
        });

        const currentRatio = img.width / img.height;
        const tolerance = 0.1; // 10% tolerance

        if (Math.abs(currentRatio - aspectRatio) > tolerance) {
          throw new Error(`Image aspect ratio must be approximately ${aspectRatio}`);
        }
      }

      // Here you would typically upload the file to your server
      // For now, we'll just use the preview URL
      onChange(preview);

    } catch (error: any) {
      onError?.(error.message);
      setPreview(null);
      onChange(null);
    } finally {
      setLoading(false);
    }
  }, [maxSize, aspectRatio, onChange, onError, preview]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.startsWith('image/')) {
        const file = items[i].getAsFile();
        if (file) {
          handleFileSelect(file);
          break;
        }
      }
    }
  }, [handleFileSelect]);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </span>
        {preview && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setPreview(null);
              onChange(null);
            }}
          >
            <X className="h-4 w-4 mr-1" />
            Remove
          </Button>
        )}
      </div>

      {preview ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              className="w-full p-0 h-auto aspect-[4/3] relative overflow-hidden"
            >
              <Image
                src={preview}
                alt={label}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl p-0">
            <div className="relative w-full h-[80vh]">
              <Image
                src={preview}
                alt={label}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </DialogContent>
        </Dialog>
      ) : (
        <Card
          className="relative border-dashed p-4"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onPaste={handlePaste}
        >
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
          <div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <Camera className="h-8 w-8" />
            <div className="text-center">
              <p className="font-medium">Click to take photo</p>
              <p className="text-sm">or drag and drop</p>
            </div>
          </div>
        </Card>
      )}

      {loading && (
        <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
          <RotateCw className="h-4 w-4 animate-spin" />
          Processing image...
        </div>
      )}
    </div>
  );
}