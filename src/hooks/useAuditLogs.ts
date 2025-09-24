import { useState, useCallback } from 'react';
import api from '@/lib/api';

export interface AuditLog {
  id: number;
  user_id: string;
  user_name: string;
  user_role: string;
  action: string;
  timestamp: string;
  details: string;
  metadata?: Record<string, any>;
}

export interface AuditLogFilters {
  startDate?: Date;
  endDate?: Date;
  actionType?: string;
  userId?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  skip: number;
  limit: number;
}

export const useAuditLogs = () => {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = useCallback(async (
    page: number,
    limit: number,
    filters?: AuditLogFilters
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        skip: ((page - 1) * limit).toString(),
        limit: limit.toString(),
      });

      if (filters?.startDate) {
        params.append('start_date', filters.startDate.toISOString());
      }
      if (filters?.endDate) {
        params.append('end_date', filters.endDate.toISOString());
      }
      if (filters?.actionType) {
        params.append('action_type', filters.actionType);
      }
      if (filters?.userId) {
        params.append('user_id', filters.userId);
      }

      const response = await api.get<PaginatedResponse<AuditLog>>(`/audit/logs?${params}`);
      setLogs(response.data.items);
      setTotal(response.data.total);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch audit logs';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserActivity = useCallback(async (
    userId: string,
    page: number,
    limit: number
  ) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        skip: ((page - 1) * limit).toString(),
        limit: limit.toString(),
      });

      const response = await api.get<AuditLog[]>(`/audit/profile/activity/${userId}?${params}`);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch user activity';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    logs,
    total,
    loading,
    error,
    fetchLogs,
    fetchUserActivity
  };
};