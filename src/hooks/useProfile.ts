import { useState, useCallback } from 'react';
import api from '@/lib/api';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  kanwil?: string;
  last_login?: string;
  created_at: string;
}

export interface UserStats {
  total_forms_created: number;
  total_forms_verified: number;
  verification_rate: number;
  average_verification_time: number;
}

export const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      setLoading(true);
      setError(null);

      const [profileResponse, statsResponse] = await Promise.all([
        api.get<UserProfile>(`/users/${userId}/profile`),
        api.get<UserStats>(`/users/${userId}/stats`)
      ]);

      setProfile(profileResponse.data);
      setStats(statsResponse.data);

      return {
        profile: profileResponse.data,
        stats: statsResponse.data
      };
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to fetch profile data';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (
    userId: string,
    data: Partial<UserProfile>
  ) => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.patch<UserProfile>(
        `/users/${userId}/profile`,
        data
      );

      setProfile(response.data);
      return response.data;
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    profile,
    stats,
    fetchProfile,
    updateProfile
  };
};