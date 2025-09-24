import { useState } from 'react';

interface WatermarkOptions {
  fontSize?: number;
  fontFamily?: string;
  padding?: number;
  backgroundColor?: string;
  textColor?: string;
}

export const useImageWatermark = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const addWatermark = async (
    file: File,
    options: WatermarkOptions = {}
  ): Promise<{ file: File; previewUrl: string }> => {
    setIsProcessing(true);
    try {
      // Default options (lebih jelas)
      const {
        fontSize = 20, // 🔧 Naikkan ukuran font
        fontFamily = 'Arial Black, Arial, sans-serif', // 🔧 Font bold
        padding = 12,
        backgroundColor = 'rgba(0, 0, 0, 0.7)', // 🔧 Lebih pekat
        textColor = '#FFFFFF'
      } = options;

      // Create canvas and load image
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context not supported');

      // Load image into canvas
      const image = await createImageBitmap(file);
      canvas.width = image.width;
      canvas.height = image.height;
      ctx.drawImage(image, 0, 0);

      // Get current location
      const location = await getCurrentPosition();

      // Format timestamp
      const now = new Date();
      const timestamp = now.toLocaleString('id-ID', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });

      // Format coordinates with 6 decimal places
      const coordinates = `${location.coords.latitude.toFixed(6)}, ${location.coords.longitude.toFixed(6)}`;

      // Prepare watermark text
      const timestampText = `Timestamp: ${timestamp}`;
      const coordsText = `Koordinat: ${coordinates}`;

      // Set text properties
      ctx.font = `${fontSize}px ${fontFamily}`;
      ctx.textBaseline = 'bottom';

      // 🔧 Tambah shadow biar teks makin jelas
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;

      // Calculate text dimensions
      const timestampWidth = ctx.measureText(timestampText).width;
      const coordsWidth = ctx.measureText(coordsText).width;
      const maxWidth = Math.max(timestampWidth, coordsWidth);
      const textHeight = fontSize * 2.6;

      // Draw background rectangle
      const rectX = canvas.width - maxWidth - (padding * 2);
      const rectY = canvas.height - textHeight - (padding * 2);
      const rectWidth = maxWidth + (padding * 2);
      const rectHeight = textHeight + (padding * 2);

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(rectX, rectY, rectWidth, rectHeight);

      // Draw text (lebih jelas)
      ctx.fillStyle = textColor;
      ctx.fillText(
        timestampText,
        canvas.width - timestampWidth - padding,
        canvas.height - fontSize - padding * 1.2
      );
      ctx.fillText(
        coordsText,
        canvas.width - coordsWidth - padding,
        canvas.height - padding * 0.8
      );

      // Convert canvas to blob and create preview URL
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
        }, file.type, 0.95);
      });

      const preview = URL.createObjectURL(blob);
      setPreviewUrl(preview);

      const watermarkedFile = new File([blob], file.name, {
        type: file.type,
        lastModified: now.getTime()
      });

      return {
        file: watermarkedFile,
        previewUrl: preview
      };
    } finally {
      setIsProcessing(false);
    }
  };

  return { addWatermark, isProcessing };
};

const getCurrentPosition = (): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      }
    );
  });
};
