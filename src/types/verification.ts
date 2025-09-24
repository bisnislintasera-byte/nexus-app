import { FormVerification, VerificationStatus, PMPeriode } from './index';

export interface VerificationFilterState {
  tid: string;
  engineerId: string;
  status: VerificationStatus | 'all';
  pmPeriode: PMPeriode;
  dateRange?: {
    start: Date | null;
    end: Date | null;
  };
  searchQuery: string; // General search across all text fields
}

export interface VerificationTableProps {
  data: FormVerification[];
  loading: boolean;
  onViewDetails: (form: FormVerification) => void;
  pagination: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
  };
}

export interface FilterProps {
  filters: VerificationFilterState;
  onFilterChange: (filters: Partial<VerificationFilterState>) => void;
  pmPeriodeList: string[];
  loading?: boolean;
}

export interface PhotoGalleryProps {
  photos: {
    [key: string]: string;
  };
  details: {
    [key: string]: {
      status: 'ACCEPTED' | 'REJECTED' | 'PENDING';
      komentar: string;
    };
  };
  onReject: (fieldName: string) => void;
  onCommentChange: (fieldName: string, comment: string) => void;
  disabled?: boolean;
}

export interface ChecklistProps {
  data: FormVerification;
  className?: string;
}

export interface ActionButtonsProps {
  onApprove: () => void;
  onReject: () => void;
  onClose: () => void;
  isApproving?: boolean;
  isRejecting?: boolean;
  disabled?: boolean;
}

export type PhotoField = 
  | 'FOTO_MINI_PC_FULL'
  | 'FOTO_SN_MINI_PC'
  | 'FOTO_TID'
  | 'FOTO_DASHBOARD_VIMS'
  | 'FOTO_SIGNAL_MODEM'
  | 'FOTO_STORAGE_MINI'
  | 'FOTO_TEMUAN_RUSAK';

export const PHOTO_FIELD_LABELS: Record<PhotoField, string> = {
  FOTO_MINI_PC_FULL: 'Foto Mini PC Full',
  FOTO_SN_MINI_PC: 'Foto SN Mini PC',
  FOTO_TID: 'Foto TID',
  FOTO_DASHBOARD_VIMS: 'Foto Dashboard VIMS',
  FOTO_SIGNAL_MODEM: 'Foto Signal Modem',
  FOTO_STORAGE_MINI: 'Foto Storage Mini',
  FOTO_TEMUAN_RUSAK: 'Foto Temuan Rusak'
};