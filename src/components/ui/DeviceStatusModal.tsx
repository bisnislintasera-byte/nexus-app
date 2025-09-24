'use client';

import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Cpu, 
  HardDrive, 
  MemoryStick, 
  Wifi, 
  Clock, 
  Server, 
  Network, 
  HardHat,
  Loader2,
  AlertCircle,
  X
} from 'lucide-react';
import { deviceApi, DeviceStatusResponse } from '@/lib/device-api';
import { cn } from '@/lib/utils';
import { useIsClient } from '@/hooks/useIsClient';

interface DeviceStatusModalProps {
  tid: string | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceStatusModal: React.FC<DeviceStatusModalProps> = ({ 
  tid, 
  isOpen, 
  onClose 
}) => {
  const isClient = useIsClient();
  const [loading, setLoading] = React.useState(false);
  const [data, setData] = React.useState<DeviceStatusResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen && tid) {
      fetchDeviceStatus();
    }
  }, [isOpen, tid]);

  // Return null on the server to avoid hydration issues
  if (!isClient) {
    return null;
  }

  const fetchDeviceStatus = async () => {
    if (!tid) return;
    
    setLoading(true);
    setError(null);
    setData(null);
    
    try {
      // Simulate 10-15 second delay as per requirements
      await new Promise(resolve => setTimeout(resolve, 10000 + Math.random() * 5000));
      
      const response = await deviceApi.getDeviceStatus(tid);
      setData(response);
    } catch (err: any) {
      setError(err.detail || 'Failed to fetch device status');
      console.error('Error fetching device status:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderDeviceInfo = () => {
    if (!data?.device_info) return null;
    
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
            <Server className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Device Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">TID</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{data.device_info.tid}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Packet Loss</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{data.device_info.packet_loss}</p>
            </div>
            <div className="col-span-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Average Ping</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{data.device_info.average_ping}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderCpuSection = () => {
    if (!data?.cpu) return null;
    
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
            <Cpu className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            CPU Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Usage</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{data.cpu.usage_percent}%</span>
              </div>
              <Progress value={data.cpu.usage_percent} className="h-2" />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Load 1m</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{data.cpu.load_1m}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Load 5m</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{data.cpu.load_5m}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Load 15m</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{data.cpu.load_15m}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">Cores:</p>
              <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                {data.cpu.cores}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMemorySection = () => {
    if (!data?.memory) return null;
    
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
            <MemoryStick className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Memory Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Usage</span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{data.memory.usage_percent}%</span>
              </div>
              <Progress value={data.memory.usage_percent} className="h-2" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{data.memory.total_gb} GB</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Used</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{data.memory.used_gb} GB</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Available</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{data.memory.available_gb} GB</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Free</p>
                <p className="font-medium text-gray-900 dark:text-gray-100">{data.memory.free_gb} GB</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderStorageSection = () => {
    if (!data?.storage) return null;
    
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
            <HardDrive className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Storage Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.storage.map((storage, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-3 bg-gray-50 dark:bg-gray-750">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium text-gray-900 dark:text-gray-100">{storage.mountpoint}</span>
                  <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                    {storage.device}
                  </Badge>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Usage</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{storage.usage_percent}%</span>
                </div>
                <Progress value={storage.usage_percent} className="h-2" />
                <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Size:</p>
                    <p className="text-gray-900 dark:text-gray-100">{storage.size_gb} GB</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Used:</p>
                    <p className="text-gray-900 dark:text-gray-100">{storage.used_gb} GB</p>
                  </div>
                  <div>
                    <p className="text-gray-500 dark:text-gray-400">Avail:</p>
                    <p className="text-gray-900 dark:text-gray-100">{storage.available_gb} GB</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSignalSection = () => {
    if (!data?.signal) return null;
    
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
            <Wifi className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Signal Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Signal Strength</p>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <div 
                      key={i} 
                      className={cn(
                        "w-2 h-4 mr-0.5 rounded-sm", 
                        i < parseInt(data.signal.signalbar) 
                          ? "bg-green-500" 
                          : "bg-gray-300 dark:bg-gray-600"
                      )}
                    />
                  ))}
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">{data.signal.signalbar}/5</span>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">RSSI</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{data.signal.rssi} dBm</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Network Type</p>
              <Badge variant="outline" className="border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
                {data.signal.network_type}
              </Badge>
            </div>
          </div>
          
          {data.signal.connection_info?.error && (
            <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-700 dark:text-red-300 font-medium">Connection Error</span>
              </div>
              <p className="text-red-600 dark:text-red-400 text-sm mt-1">
                {data.signal.connection_info.error}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderSummary = () => {
    if (!data?.summary) return null;
    
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
            <HardHat className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">CPU Usage</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{data.summary.cpu_usage}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Memory Usage</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{data.summary.memory_usage}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Storage Count</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{data.summary.storage_count}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Total Storage</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{data.summary.total_storage_gb} GB</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Used Storage</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{data.summary.used_storage_gb} GB</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Signal Strength</p>
              <p className="font-medium text-gray-900 dark:text-gray-100">{data.summary.signal_strength}/5</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderUptime = () => {
    if (!data?.uptime) return null;
    
    return (
      <Card className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg text-gray-900 dark:text-gray-100">
            <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
            Uptime
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-lg px-4 py-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300">
              {data.uptime.formatted}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 sm:p-6 bg-white dark:bg-gray-900"
        aria-label="Device Status Information"
      >
        <DialogHeader className="p-6 pb-4 flex flex-row items-start justify-between border-b border-gray-200 dark:border-gray-700">
          <DialogTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Device Status for TID: {tid}
          </DialogTitle>
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="p-6 pt-0">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 animate-spin text-gray-600 dark:text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Fetching device status...</p>
              <p className="text-gray-500 dark:text-gray-400">This may take 10-15 seconds</p>
            </div>
          )}
          
          {error && !loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-gray-100">Failed to fetch device status</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">{error}</p>
              <Button 
                onClick={fetchDeviceStatus} 
                className="mt-2 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-200"
              >
                Retry
              </Button>
            </div>
          )}
          
          {!loading && !error && data && (
            <div className="space-y-6 max-h-[calc(90vh-180px)] overflow-y-auto pr-2">
              {renderDeviceInfo()}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderCpuSection()}
                {renderMemorySection()}
              </div>
              {renderStorageSection()}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderSignalSection()}
                {renderUptime()}
              </div>
              {renderSummary()}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};