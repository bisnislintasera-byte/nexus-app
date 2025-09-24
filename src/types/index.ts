export interface User {
  id: number;
  nama: string;
  user_id: string;
  username: string;
  role: 'ENGINEER' | 'VERIFIKATOR' | 'ADMIN';
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
  role: 'ENGINEER' | 'VERIFIKATOR' | 'ADMIN';
  user_id: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface MasterData {
  TID: string;
  KANWIL: string;
  KC_SUPERVISI: string;
  LOKASI: string;
  PROJECT: string;
  PIC_AREA: string;
  NO_PC: string;
  SN_MINI_PC: string;
  latitude: string;
  longitude: string;
}

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type PhotoStatus = 'ACCEPTED' | 'REJECTED' | 'PENDING';
export type PMPeriode = 'PM1' | 'PM2' | 'PM3' | 'PM4' | 'PM5' | 'PM6' | 'PM7' | 'ALL';
export type SimcardRecommendation = 'TELKOMSEL' | 'SMARTFREN' | 'XL' | 'INDOSAT';

export interface PhotoVerificationDetail {
  status: PhotoStatus;
  komentar: string;
}

export interface FormVerification {
  id: number;
  id_verifikasi: string;
  TID: string;
  KANWIL: string;
  KC_SUPERVISI: string;
  LOKASI: string;
  PROJECT: string;
  PIC_AREA: string;
  NO_PC: string;
  SN_MINI_PC: string;
  STATUS_SIGNAL_MODEM: boolean;
  STATUS_DASHBOARD: boolean;
  STATUS_CAMERA: boolean;
  STATUS_NVR: boolean;
  STATUS_KABEL_LAN: boolean;
  STATUS_HDMI: boolean;
  STATUS_ADAPTOR: boolean;
  STATUS_HARDISK: boolean;
  STATUS_MODEM: boolean;
  REKOMENDASI_SIMCARD: SimcardRecommendation;
  REKOMENDASI_CATATAN: string;
  FOTO_MINI_PC_FULL: string;
  FOTO_SN_MINI_PC: string;
  FOTO_TID: string;
  FOTO_DASHBOARD_VIMS: string;
  FOTO_SIGNAL_MODEM: string;
  FOTO_STORAGE_MINI: string;
  FOTO_TEMUAN_RUSAK: string;
  latitude: string | null;
  longitude: string | null;
  geo_timestamp: string | null;
  PM_PERIODE: PMPeriode;
  ID_ENGINEER: string;
  status_verifikasi: VerificationStatus;
  comment_verifikasi: string | null;
  verify_by: string | null;
  created_at: string;
  updated_at: string | null;
  foto_verifikasi_details: Record<string, PhotoVerificationDetail> | null;
}

export interface FormVerificationCreate {
  TID: string;
  KANWIL: string;
  KC_SUPERVISI: string;
  LOKASI: string;
  PROJECT: string;
  PIC_AREA: string;
  NO_PC: string;
  SN_MINI_PC: string;
  STATUS_SIGNAL_MODEM: boolean;
  STATUS_DASHBOARD: boolean;
  STATUS_CAMERA: boolean;
  STATUS_NVR: boolean;
  STATUS_KABEL_LAN: boolean;
  STATUS_HDMI: boolean;
  STATUS_ADAPTOR: boolean;
  STATUS_HARDISK: boolean;
  STATUS_MODEM: boolean;
  REKOMENDASI_SIMCARD: string;   // ✅ diperbaiki jadi string
  REKOMENDASI_CATATAN: string;   // ✅ ditambahkan
  FOTO_MINI_PC_FULL?: string;
  FOTO_SN_MINI_PC?: string;
  FOTO_TID?: string;
  FOTO_DASHBOARD_VIMS?: string;
  FOTO_SIGNAL_MODEM?: string;
  FOTO_STORAGE_MINI?: string;
  FOTO_TEMUAN_RUSAK?: string;
  latitude?: string;
  longitude?: string;
  geo_timestamp?: string;
  PM_PERIODE: 'PM1' | 'PM2' | 'PM3';
  ID_ENGINEER: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
