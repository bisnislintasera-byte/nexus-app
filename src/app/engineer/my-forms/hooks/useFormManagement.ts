import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { FormVerification } from '@/types';

export type FormStatus = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface EnhancedFormVerification extends FormVerification {
  photoStatus: string;
  periode: string;
  status: FormStatus;
}

export function useFormManagement() {
  const [forms, setForms] = useState<EnhancedFormVerification[]>([]);
  const [filteredForms, setFilteredForms] = useState<EnhancedFormVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<FormStatus>("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    fetchForms();
  }, []);

  const fetchForms = async () => {
    try {
      setLoading(true);
      const response = await api.get<EnhancedFormVerification[]>('/form/mine');
      setForms(response.data);
      setFilteredForms(response.data);
      setTotalItems(response.data.length);
    } catch (error) {
      console.error("Error fetching forms:", error);
      toast.error("Gagal memuat data form");
    } finally {
      setLoading(false);
    }
  };

  const getStatusCounts = () => {
    const counts = {
      all: forms.length,
      pending: forms.filter(form => form.status === 'PENDING').length,
      approved: forms.filter(form => form.status === 'APPROVED').length,
      rejected: forms.filter(form => form.status === 'REJECTED').length,
    };
    return counts;
  };

  const handleFilter = (status: FormStatus) => {
    setFilterStatus(status);
    
    const filtered = forms.filter(form => {
      const statusMatch = status === "ALL" || form.status_verifikasi === status;
      return statusMatch;
    });
    
    setFilteredForms(filtered);
    setTotalItems(filtered.length);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const totalPages = Math.ceil(totalItems / pageSize);

  return {
    forms,
    filteredForms,
    loading,
    filterStatus,
    handleFilter,
    refreshForms: fetchForms,
    statusCounts: getStatusCounts(),
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    totalPages,
    totalItems
  };
}