'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  AlertCircle, 
  Camera, 
  X 
} from 'lucide-react';
import { deviceApi } from '@/lib/device-api';
import { cn } from '@/lib/utils';
import { useIsClient } from '@/hooks/useIsClient';

interface SnapshotModalProps {
  tid: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({ 
  tid, 
  isOpen, 
  onClose 
}) => {
  const isClient = useIsClient();

  const [loading, setLoading] = React.useState(false);
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && tid) {
      fetchSnapshot();
    }
    // Clean up when modal closes
    return () => {
      if (imageSrc) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [isOpen, tid]);

  // Return null on the server to avoid hydration issues
  if (!isClient) {
    return null;
  }

  const fetchSnapshot = async () => {
    if (!tid) return;
    
    setLoading(true);
    setError(null);
    setImageSrc(null);
    
    try {
      // Simulate 10-15 second delay as per requirements
      await new Promise(resolve => setTimeout(resolve, 10000 + Math.random() * 5000));
      
      const blob = await deviceApi.getSnapshot(tid);
      const imageUrl = URL.createObjectURL(blob);
      setImageSrc(imageUrl);
    } catch (err: any) {
      setError(err.detail || 'Failed to fetch snapshot');
      console.error('Error fetching snapshot:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 sm:p-6"
        aria-label="Device Snapshot"
      >
        <DialogHeader className="p-6 pb-4 flex flex-row items-start justify-between border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-xl font-semibold">
            Device Snapshot for TID: {tid}
          </DialogTitle>
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full hover:bg-secondary dark:hover:bg-gray-700/50"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 pt-0 flex items-center justify-center">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-lg font-medium">Fetching snapshot...</p>
              <p className="text-muted-foreground">This may take 10-15 seconds</p>
            </div>
          )}
          
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <h3 className="text-lg font-medium mb-2">Failed to fetch snapshot</h3>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={fetchSnapshot} className="mt-2">
                Retry
              </Button>
            </div>
          )}
          
          {!loading && !error && imageSrc && (
            <div className="w-full flex justify-center">
              <img 
                src={imageSrc} 
                alt={`Snapshot for TID ${tid}`}
                className="max-w-full max-h-[70vh] rounded-xl shadow-md object-contain"
                onError={() => setError('Failed to load image')}
              />
            </div>
          )}
          
          {!loading && !error && !imageSrc && !tid && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Camera className="h-12 w-12 text-muted mb-4" />
              <h3 className="text-lg font-medium mb-2">No TID provided</h3>
              <p className="text-muted-foreground">Please provide a valid TID to fetch snapshot</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};