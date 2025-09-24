'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import * as XLSX from 'xlsx';

// Custom API Client
import apiClient from '@/lib/api';
import { verificationApi } from '@/lib/api/verification';

// Components
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/BackButton';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Download,
  Filter,
  Loader2,
  XCircle,
  CheckCircle,
  FileText,
  ShieldCheck,
} from 'lucide-react';

// Components
import { VerificationTable } from '@/components/verification/VerificationTable';
import { VerificationFilters } from '@/components/verification/VerificationFilters';
import { PhotoGallery } from '@/components/verification/PhotoGallery';

// Hooks
import { 
  useVerification, 
  useVerificationForm, 
  useMasterData 
} from '@/hooks/useVerification';

// Types
import type { FormVerification } from '@/types';
import type { PhotoGalleryProps } from '@/types/verification';

type PhotoDetail = PhotoGalleryProps['details'][string];

// Components
import ErrorBoundary from '@/components/ErrorBoundary';
import { SuspenseLoader } from '@/components/SuspenseLoader';

function VerificationPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status');

  // Local State
  const [selectedForm, setSelectedForm] = useState<FormVerification | null>(null);
  const [approvalComment, setApprovalComment] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [exporting, setExporting] = useState(false);
  const [photoDetails, setPhotoDetails] = useState<Record<string, PhotoDetail>>({});

  // Custom Hooks
  const { pmPeriodeList } = useMasterData();

  const {
    forms,
    total: totalItems,
    totalPages,
    isLoading: loading,
    filters,
    stats,
    updateFilters,
    onPageChange,
    onPageSizeChange,
    refresh: refetch
  } = useVerification({
    initialFilters: {
      status: (statusParam as 'PENDING' | 'APPROVED' | 'REJECTED') || 'PENDING'
    },
    pageSize
  });

  const {
    isApproving,
    isRejecting,
    handleApprove,
    handleReject
  } = useVerificationForm(selectedForm?.id_verifikasi);

  // Event Handlers
  const handleViewDetails = (form: FormVerification) => {
    setSelectedForm(form);
    initializePhotoDetails(form);
  };

  const initializePhotoDetails = (form: FormVerification) => {
    if (form.foto_verifikasi_details) {
      setPhotoDetails(form.foto_verifikasi_details);
    } else {
      const defaultDetails: Record<string, PhotoDetail> = {};
      const photoFields = [
        'FOTO_MINI_PC_FULL',
        'FOTO_SN_MINI_PC',
        'FOTO_TID',
        'FOTO_DASHBOARD_VIMS',
        'FOTO_SIGNAL_MODEM',
        'FOTO_STORAGE_MINI',
        'FOTO_TEMUAN_RUSAK'
      ];
      
      photoFields.forEach(field => {
        defaultDetails[field] = { status: 'ACCEPTED', komentar: '' };
      });
      setPhotoDetails(defaultDetails);
    }
  };

  const handleRejectPhoto = async (fieldName: string) => {
    const currentStatus = photoDetails[fieldName]?.status || 'ACCEPTED';
    const newStatus = currentStatus === 'REJECTED' ? 'ACCEPTED' : 'REJECTED';
    const comment = photoDetails[fieldName]?.komentar || '';
    
    try {
      await verificationApi.updatePhotoStatus(selectedForm?.id_verifikasi || '', {
        [fieldName]: {
          status: newStatus,
          komentar: comment
        }
      });
      
      setPhotoDetails(prev => ({
        ...prev,
        [fieldName]: {
          ...prev[fieldName],
          status: newStatus
        }
      }));
      
      toast.success('Status foto berhasil diperbarui');
    } catch (error) {
      toast.error('Gagal mengubah status foto');
    }
  };

  const handlePhotoCommentChange = (fieldName: string, comment: string) => {
    setPhotoDetails(prev => ({
      ...prev,
      [fieldName]: {
        ...prev[fieldName],
        komentar: comment
      }
    }));
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    updateFilters(newFilters);
    setCurrentPage(1);
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const allForms: FormVerification[] = [];
      let currentPage = 1;
      let hasMore = true;
      
      while (hasMore && allForms.length < 10000) {
        const skip = (currentPage - 1) * 100;
        const endpoint = filters.status === 'APPROVED' 
          ? '/verification/approved' 
          : filters.status === 'REJECTED'
            ? '/verification/rejected'
            : '/verification';
            
        const response = await apiClient.get<{ data: FormVerification[]; total: number }>(
          `${endpoint}?skip=${skip}&limit=100`
        );
        
        allForms.push(...response.data.data);
        currentPage++;
        hasMore = allForms.length < response.data.total;
      }
      
      const exportData = allForms.map(form => ({
        'ID Verifikasi': form.id_verifikasi,
        'TID': form.TID,
        'KC Supervisi': form.KC_SUPERVISI,
        'Lokasi': form.LOKASI,
        'Project': form.PROJECT,
        'PIC Area': form.PIC_AREA,
        'Status': form.status_verifikasi,
        'PM Periode': form.PM_PERIODE,
        'Engineer': form.ID_ENGINEER,
        'Komentar': form.comment_verifikasi || '',
        'Verifikator': form.verify_by || '',
        'Tanggal Dibuat': form.created_at ? new Date(form.created_at).toLocaleString('id-ID') : '',
        'Tanggal Update': form.updated_at ? new Date(form.updated_at).toLocaleString('id-ID') : ''
      }));
      
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Form Verifikasi');
      
      const fileName = `form_verifikasi_${filters.status}_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast.success(`Berhasil mengekspor ${exportData.length} data`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Gagal mengekspor data');
    } finally {
      setExporting(false);
    }
  };

  const handleSubmitVerification = async (isApproved: boolean) => {
    if (isApproved) {
      await handleApprove();
    } else {
      await handleReject(approvalComment, photoDetails);
    }
    setSelectedForm(null);
    refetch();
  };

  // UI Components
  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <BackButton variant="outline" />
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Form Verifikasi
          </h1>
          <p className="text-gray-600 mt-2">
            Kelola dan verifikasi form verifikasi aset
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          variant="outline"
          className="flex items-center"
        >
          <Filter className="mr-2 h-4 w-4" />
          {isFilterExpanded ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
        </Button>
        <Button
          onClick={handleExport}
          disabled={exporting}
          variant="outline"
          className="flex items-center"
        >
          {exporting ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Download className="mr-2 h-4 w-4" />
          )}
          Export Excel
        </Button>
      </div>
    </div>
  );

  const renderFilters = () => (
    isFilterExpanded && (
      <Card className="mb-6">
        <CardContent className="p-4">
          <VerificationFilters
            filters={filters}
            onFilterChange={handleFilterChange}
            pmPeriodeList={pmPeriodeList}
            loading={loading}
          />
        </CardContent>
      </Card>
    )
  );

  const renderVerificationActions = () => (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Verifikasi Form
      </h3>
      <div className="space-y-4">
        <div>
          <Label htmlFor="comment" className="text-gray-700">
            Komentar Verifikasi (Opsional jika menolak foto secara individual)
          </Label>
          <Textarea
            id="comment"
            rows={4}
            value={approvalComment}
            onChange={(e) => setApprovalComment(e.target.value)}
            placeholder="Masukkan komentar verifikasi... (opsional jika menolak foto secara individual)"
            className="mt-1"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setSelectedForm(null)}
            className="w-full sm:w-auto"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Tutup Detail
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleSubmitVerification(false)}
            disabled={isRejecting}
            className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
          >
            {isRejecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menolak Form...
              </>
            ) : (
              <>
                <XCircle className="mr-2 h-4 w-4" />
                Tolak Form
              </>
            )}
          </Button>
          <Button
            onClick={() => handleSubmitVerification(true)}
            disabled={isApproving}
            className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
          >
            {isApproving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyetujui Form...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                Setujui Form
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  const renderFormDetail = () => (
    <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center text-xl">
            <FileText className="mr-2 h-5 w-5 text-blue-600" />
            Detail Form Verifikasi
          </CardTitle>
          <Button
            onClick={() => setSelectedForm(null)}
            variant="ghost"
            size="sm"
          >
            <XCircle className="h-5 w-5" />
          </Button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          TID: {selectedForm?.TID} | Lokasi: {selectedForm?.LOKASI}
        </p>
      </CardHeader>

      <CardContent className="p-6">
        <PhotoGallery
          photos={{
            FOTO_MINI_PC_FULL: selectedForm?.FOTO_MINI_PC_FULL || '',
            FOTO_SN_MINI_PC: selectedForm?.FOTO_SN_MINI_PC || '',
            FOTO_TID: selectedForm?.FOTO_TID || '',
            FOTO_DASHBOARD_VIMS: selectedForm?.FOTO_DASHBOARD_VIMS || '',
            FOTO_SIGNAL_MODEM: selectedForm?.FOTO_SIGNAL_MODEM || '',
            FOTO_STORAGE_MINI: selectedForm?.FOTO_STORAGE_MINI || '',
            FOTO_TEMUAN_RUSAK: selectedForm?.FOTO_TEMUAN_RUSAK || ''
          }}
          details={photoDetails}
          onReject={handleRejectPhoto}
          onCommentChange={handlePhotoCommentChange}
          disabled={selectedForm?.status_verifikasi !== 'PENDING'}
        />

        {selectedForm?.status_verifikasi === 'PENDING' && renderVerificationActions()}
      </CardContent>
    </Card>
  );

  const renderFormList = () => (
    <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="flex items-center text-xl">
          <ShieldCheck className="mr-2 h-5 w-5 text-blue-600" />
          Daftar Form Verifikasi
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <VerificationTable
          data={forms}
          loading={loading}
          onViewDetails={handleViewDetails}
          pagination={{
            currentPage,
            totalPages: Math.ceil(totalItems / pageSize),
            pageSize,
            totalItems,
            onPageChange: setCurrentPage,
            onPageSizeChange: setPageSize
          }}
        />
      </CardContent>
    </Card>
  );

  // Main Render
  return (
    <div className="container mx-auto py-4 sm:py-8 px-4">
      {renderHeader()}
      <ErrorBoundary>
        <Suspense fallback={<SuspenseLoader />}>
          {renderFilters()}
          {selectedForm ? renderFormDetail() : renderFormList()}
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<SuspenseLoader />}>
        <VerificationPageContent />
      </Suspense>
    </ErrorBoundary>
  );
}