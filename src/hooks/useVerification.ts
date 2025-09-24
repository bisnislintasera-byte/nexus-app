import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { verificationApi } from '@/lib/api/verification';
import type { FormVerification, VerificationStatus, PMPeriode } from '@/types';
import type { VerificationFilterState } from '@/types/verification';
import useSWR from 'swr';

interface UseVerificationOptions {
  initialFilters?: Partial<VerificationFilterState>;
  pageSize?: number;
}

interface VerificationStats {
  pendingForms: number;
  approvedForms: number;
  rejectedForms: number;
  todayVerified: number;
}

const defaultFilters: VerificationFilterState = {
  tid: '',
  engineerId: '',
  status: 'PENDING',
  pmPeriode: 'ALL',
  searchQuery: '',
  dateRange: {
    start: null,
    end: null,
  },
};

export const useVerification = ({
  initialFilters = {},
  pageSize = 10,
}: UseVerificationOptions = {}) => {
  // State
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<VerificationFilterState>({
    ...defaultFilters,
    ...initialFilters,
  });

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [filters]);

  // Create cache key based on all parameters
  const cacheKey = JSON.stringify({
    page,
    pageSize,
    filters,
  });

  // Fetch data using SWR
  const { data, error, isLoading, mutate } = useSWR(
    ['verifications', cacheKey],
    () => verificationApi.getVerifications({ page, limit: pageSize, filters }),
    {
      revalidateOnFocus: false,
    }
  );

  // Fetch stats using SWR
  const { data: stats, mutate: mutateStats } = useSWR<VerificationStats>(
    'verification-stats',
    () => verificationApi.getStats(),
    {
      revalidateOnFocus: false,
    }
  );

  // Filter update handler
  const updateFilters = useCallback((newFilters: Partial<VerificationFilterState>) => {
    setFilters((current) => ({
      ...current,
      ...newFilters,
    }));
  }, []);

  // Page change handler
  const onPageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  // Page size change handler
  const onPageSizeChange = useCallback((newSize: number) => {
    setPage(1); // Reset to first page when changing page size
    pageSize = newSize;
  }, []);

  // Approve form
  const approveForm = useCallback(async (id: string) => {
    try {
      await verificationApi.approveForm(id);
      // Revalidate data and stats
      await Promise.all([mutate(), mutateStats()]);
      toast.success('Form berhasil disetujui');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Gagal menyetujui form');
      return false;
    }
  }, [mutate, mutateStats]);

  // Reject form
  const rejectForm = useCallback(async (
    id: string,
    comment: string,
    photoDetails: Record<string, { status: 'ACCEPTED' | 'REJECTED'; komentar: string; }>
  ) => {
    try {
      await verificationApi.rejectForm(id, {
        comment_verifikasi: comment,
        foto_verifikasi_details: photoDetails,
      });
      // Revalidate data and stats
      await Promise.all([mutate(), mutateStats()]);
      toast.success('Form berhasil ditolak');
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Gagal menolak form');
      return false;
    }
  }, [mutate, mutateStats]);

  return {
    // Data
    forms: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages: data?.totalPages ?? 0,
    currentPage: page,
    pageSize,
    isLoading,
    error,
    stats,

    // Actions
    filters,
    updateFilters,
    onPageChange,
    onPageSizeChange,
    approveForm,
    rejectForm,
    refresh: mutate,
  };
};

export const useVerificationForm = (formId?: string) => {
  const [loading, setLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const router = useRouter();

  const handleUpdatePhotoStatus = async (
    photoField: string,
    newStatus: 'ACCEPTED' | 'REJECTED',
    comment: string = ''
  ) => {
    if (!formId) return;
    setLoading(true);
    try {
      await verificationApi.updatePhotoStatus(formId, {
        [photoField]: {
          status: newStatus,
          komentar: comment
        }
      });
      toast.success('Status foto berhasil diperbarui');
      router.refresh();
      return true;
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Gagal memperbarui status foto');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!formId) return;
    setIsApproving(true);
    try {
      await verificationApi.approveForm(formId);
      toast.success('Form berhasil disetujui');
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Gagal menyetujui form');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async (comment: string, photoRejections?: Record<string, { status: string; komentar: string }>) => {
    if (!formId) return;
    setIsRejecting(true);
    try {
      await verificationApi.rejectForm(formId, {
        comment_verifikasi: comment,
        foto_verifikasi_details: photoRejections as Record<string, { status: 'ACCEPTED' | 'REJECTED'; komentar: string; }>
      });
      toast.success('Form berhasil ditolak');
      router.refresh();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Gagal menolak form');
    } finally {
      setIsRejecting(false);
    }
  };

  return {
    loading,
    isApproving,
    isRejecting,
    handleApprove,
    handleReject,
    handleUpdatePhotoStatus
  };
};

export const useMasterData = () => {
  const [pmPeriodeList, setPmPeriodeList] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchMasterData = useCallback(async () => {
    try {
      const pmResponse = await verificationApi.getSettings();
      setPmPeriodeList(pmResponse.periode_list);
    } catch (error: any) {
      setError('Failed to load master data');
      console.error('Error loading master data:', error);
    }
  }, []);

  useEffect(() => {
    fetchMasterData();
  }, [fetchMasterData]);

  return {
    pmPeriodeList,
    error,
    refetch: fetchMasterData
  };
};