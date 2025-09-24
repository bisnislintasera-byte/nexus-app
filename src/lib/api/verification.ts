import api from '@/lib/api';
import type { FormVerification, PaginatedResponse } from '@/types';
import type { VerificationFilterState } from '@/types/verification';

interface GetVerificationsParams {
  page?: number;
  limit?: number;
  filters: VerificationFilterState;
}

interface RejectFormRequest {
  comment_verifikasi: string;
  foto_verifikasi_details: Record<string, {
    status: 'ACCEPTED' | 'REJECTED';
    komentar: string;
  }>;
}

export const verificationApi = {
  // Get list of verifications with filters
  getVerifications: async ({ page = 1, limit = 10, filters }: GetVerificationsParams): Promise<PaginatedResponse<FormVerification>> => {
    const queryParams = new URLSearchParams();
    queryParams.set('skip', ((page - 1) * limit).toString());
    queryParams.set('limit', limit.toString());

    // Only add status filter if it's not 'all'
    if (filters.status !== 'all') {
      queryParams.set('status', filters.status);
    }

    // Add other filters
    if (filters.tid) {
      queryParams.set('tid', filters.tid);
    }

    if (filters.engineerId) {
      queryParams.set('engineer_id', filters.engineerId);
    }

    if (filters.pmPeriode && filters.pmPeriode !== 'ALL') {
      queryParams.set('pm_periode', filters.pmPeriode);
    }

    if (filters.dateRange?.start && filters.dateRange?.end) {
      queryParams.set('date_from', filters.dateRange.start.toISOString());
      queryParams.set('date_to', filters.dateRange.end.toISOString());
    }

    if (filters.searchQuery) {
      queryParams.set('search', filters.searchQuery);
    }

    // Match the exact FastAPI endpoint structure
    const response = await api.get<PaginatedResponse<FormVerification>>(`/verification?${queryParams.toString()}`);
    return response.data;
  },

  // Get a single verification by ID
  getVerification: async (id: string): Promise<FormVerification> => {
    const response = await api.get<FormVerification>(`/verification/${id}`);
    return response.data;
  },

  // Approve a form
  approveForm: async (id: string): Promise<FormVerification> => {
    const response = await api.post<FormVerification>(`/verification/${id}/approve`);
    return response.data;
  },

  // Reject a form
  rejectForm: async (id: string, data: RejectFormRequest): Promise<FormVerification> => {
    const response = await api.post<FormVerification>(`/verification/${id}/reject`, data);
    return response.data;
  },

  // Get verification stats
  getStats: async () => {
    const response = await api.get('/verification/stats');
    return response.data;
  },

  // Get audit logs for a specific form
  getFormAuditLogs: async (id: string, page = 1, limit = 10) => {
    const response = await api.get(`/verification/logs/form/${id}`, {
      params: {
        skip: (page - 1) * limit,
        limit,
      },
    });
    return response.data;
  },

  // Get settings including PM periods
  getSettings: async () => {
    const response = await api.get<{ periode_list: string[] }>('/pm-settings');
    return response.data;
  },

  // Update photo status
  updatePhotoStatus: async (
    id: string, 
    updates: Record<string, {
      status: 'ACCEPTED' | 'REJECTED';
      komentar: string;
    }>
  ) => {
    const response = await api.post(`/verification/${id}/update-photo-status`, updates);
    return response.data;
  },
};