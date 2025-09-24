// src/lib/device-api.ts
const BASE_URL = 'https://api-unified.lintasera.pro';
const BEARER_TOKEN = 'supersecrettoken';

// Type definitions for API responses
export interface DeviceStatusResponse {
  status: string;
  timestamp: number;
  device_info: {
    tid: string;
    ip: string;
    packet_loss: string;
    average_ping: string;
  };
  uptime: {
    seconds: number;
    formatted: string;
  };
  cpu: {
    usage_percent: number;
    load_1m: number;
    load_5m: number;
    load_15m: number;
    cores: number;
  };
  memory: {
    total_gb: number;
    used_gb: number;
    available_gb: number;
    free_gb: number;
    usage_percent: number;
  };
  storage: Array<{
    device: string;
    mountpoint: string;
    size_gb: number;
    used_gb: number;
    available_gb: number;
    usage_percent: number;
  }>;
  signal: {
    signalbar: string;
    rssi: string;
    network_type: string;
    connection_info: {
      connection_time?: string;
      execution_time?: string;
      error?: string;
    };
  };
  summary: {
    cpu_usage: string;
    memory_usage: string;
    storage_count: number;
    total_storage_gb: number;
    used_storage_gb: number;
    signal_strength: string;
    signal_rssi: string;
  };
}

export interface SnapshotResponse {
  // This will be binary image data
  data: Blob;
}

export interface ErrorResponse {
  detail: string;
}

// API service functions
export const deviceApi = {
  /**
   * Get device status information by TID
   */
  getDeviceStatus: async (tid: string): Promise<DeviceStatusResponse> => {
    const response = await fetch(`${BASE_URL}/system-status/${tid}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({
        detail: `HTTP Error: ${response.status}`
      }));
      
      throw {
        status: response.status,
        ...errorData
      };
    }

    return response.json();
  },

  /**
   * Get snapshot image by TID
   */
  getSnapshot: async (tid: string): Promise<Blob> => {
    const response = await fetch(`${BASE_URL}/snapshot/${tid}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${BEARER_TOKEN}`,
      },
    });

    if (!response.ok) {
      const errorData: ErrorResponse = await response.json().catch(() => ({
        detail: `HTTP Error: ${response.status}`
      }));
      
      throw {
        status: response.status,
        ...errorData
      };
    }

    return response.blob();
  }
};