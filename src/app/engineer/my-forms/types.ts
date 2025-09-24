// Status verifikasi yang mungkin untuk sebuah form
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface MyForm {
  id_verifikasi: string;
  TID: string;
  KANWIL: string;
  KC_SUPERVISI: string;
  LOKASI: string;
  PROJECT: string;
  PIC_AREA: string;
  NO_PC: string;
  SN_MINI_PC: string;
  
  // Checklist items
  STATUS_SIGNAL_MODEM: boolean;
  STATUS_DASHBOARD: boolean;
  STATUS_CAMERA: boolean;
  STATUS_NVR: boolean;
  STATUS_KABEL_LAN: boolean;
  STATUS_HDMI: boolean;
  STATUS_ADAPTOR: boolean;
  STATUS_HARDISK: boolean;
  STATUS_MODEM: boolean;
  REKOMENDASI_SIMCARD?: 'Telkomsel' | 'Smartfren' | 'XL' | 'Indosat';
  REKOMENDASI_CATATAN?: string;

  // Photo URLs
  FOTO_MINI_PC_FULL: string;
  FOTO_SN_MINI_PC: string;
  FOTO_TID: string;
  FOTO_DASHBOARD_VIMS: string;
  FOTO_SIGNAL_MODEM: string;
  FOTO_STORAGE_MINI: string;
  FOTO_TEMUAN_RUSAK: string;

  // Verification details
  foto_verifikasi_details?: {
    [key: string]: {
      status: string;
      komentar?: string;
    };
  };

  // Location data
  latitude?: string;
  longitude?: string;
  geo_timestamp?: string;

  // Form metadata
  PM_PERIODE: string;
  ID_ENGINEER: string;
  status_verifikasi: VerificationStatus;
  comment_verifikasi?: string;
  verify_by?: string;
  created_at: string;
  updated_at: string;
}

// Interface untuk filter options
export interface FilterOptions {
  status?: VerificationStatus;
  pmPeriode?: string;
  date?: {
    start: Date;
    end: Date;
  };
}

// Interface untuk sort options
export interface SortOptions {
  field: keyof MyForm;
  direction: 'asc' | 'desc';
}