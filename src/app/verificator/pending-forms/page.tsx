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
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Download,
  Filter,
  Loader2,
  XCircle,
  CheckCircle,
  FileText,
  ShieldCheck,
  Search,
  Eye,
  MoreVertical,
  User,
  Calendar,
  MapPin,
  Clock,
  AlertCircle,
  Image as ImageIcon,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

// Components
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
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

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

  const getStatusBadge = (status: string) => {
    const baseClasses = "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border";
    switch (status) {
      case 'PENDING':
        return (
          <span className={`${baseClasses} bg-amber-50 text-amber-800 border-amber-200`}>
            <Clock className="mr-1.5 h-3.5 w-3.5" />
            Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className={`${baseClasses} bg-green-50 text-green-800 border-green-200`}>
            <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
            Disetujui
          </span>
        );
      case 'REJECTED':
        return (
          <span className={`${baseClasses} bg-red-50 text-red-800 border-red-200`}>
            <XCircle className="mr-1.5 h-3.5 w-3.5" />
            Ditolak
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-50 text-gray-800 border-gray-200`}>
            Unknown
          </span>
        );
    }
  };

  // Filter forms based on search and status
  const filteredForms = forms.filter(form => {
    const matchesSearch = !searchQuery || 
      form.TID.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.LOKASI.toLowerCase().includes(searchQuery.toLowerCase()) ||
      form.ID_ENGINEER.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'ALL' || form.status_verifikasi === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Pagination for filtered results
  const totalFilteredPages = Math.ceil(filteredForms.length / pageSize);
  const paginatedForms = filteredForms.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // UI Components
  const renderHeader = () => (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
      <div className="flex items-center gap-4">
        <BackButton variant="outline" />
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Form Verifikasi
          </h1>
          <p className="text-gray-600 mt-2 text-lg">
            Kelola dan verifikasi form verifikasi aset
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
          variant="outline"
          className="flex items-center shadow-md hover:shadow-lg transition-all duration-300"
        >
          <Filter className="mr-2 h-4 w-4" />
          {isFilterExpanded ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
        </Button>
        <Button
          onClick={handleExport}
          disabled={exporting}
          variant="outline"
          className="flex items-center shadow-md hover:shadow-lg transition-all duration-300"
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

  const renderSearchAndFilters = () => (
    <Card className="mb-6 shadow-lg border-0">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Cari berdasarkan TID, lokasi, atau engineer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11"
            />
          </div>
          
          {/* Status Filter */}
          <div className="w-full lg:w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Semua Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="APPROVED">Disetujui</SelectItem>
                <SelectItem value="REJECTED">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {isFilterExpanded && (
          <div className="mt-6 pt-6 border-t border-gray-200">
            <VerificationFilters
              filters={filters}
              onFilterChange={handleFilterChange}
              pmPeriodeList={pmPeriodeList}
              loading={loading}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderTable = () => (
    <Card className="shadow-xl border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 sticky top-0 z-10">
        <CardTitle className="flex items-center text-xl font-bold">
          <div className="p-2 bg-blue-100 rounded-xl mr-3">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
          </div>
          Daftar Form Verifikasi
          <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
            {filteredForms.length} form
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : paginatedForms.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
              <FileText className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Tidak ada form yang ditemukan</h3>
            <p className="text-gray-500 text-lg">
              Tidak ada data yang sesuai dengan filter yang dipilih.
            </p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200 sticky top-0">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      TID & Lokasi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Engineer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      PM Periode
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginatedForms.map((form, index) => (
                    <tr 
                      key={form.id_verifikasi}
                      className={`transition-colors duration-200 hover:bg-blue-50/50 cursor-pointer ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                      }`}
                      onClick={() => handleViewDetails(form)}
                    >
                      <td className="px-6 py-5">
                        <div>
                          <p className="text-sm font-bold text-blue-600">{form.TID}</p>
                          <p className="text-sm text-gray-600 mt-1">{form.LOKASI}</p>
                          <p className="text-xs text-gray-500 mt-1">{form.KC_SUPERVISI}</p>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                            <User className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{form.ID_ENGINEER}</p>
                            <p className="text-xs text-gray-500">{form.PIC_AREA}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        {getStatusBadge(form.status_verifikasi)}
                      </td>
                      <td className="px-6 py-5">
                        <span className="px-3 py-1.5 rounded-lg bg-purple-100 text-purple-800 font-medium text-sm border border-purple-200">
                          {form.PM_PERIODE}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="mr-2 h-4 w-4" />
                          <div>
                            <p className="font-medium">{new Date(form.created_at).toLocaleDateString('id-ID')}</p>
                            <p className="text-xs text-gray-500">{new Date(form.created_at).toLocaleTimeString('id-ID')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(form);
                            }}
                            variant="outline"
                            size="sm"
                            className="flex items-center shadow-md hover:shadow-lg transition-all duration-300"
                          >
                            <Eye className="mr-1.5 h-4 w-4" />
                            Detail
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-100">
              {paginatedForms.map((form) => (
                <div 
                  key={form.id_verifikasi}
                  className="p-6 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                  onClick={() => handleViewDetails(form)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-lg font-bold text-blue-600">{form.TID}</p>
                      <p className="text-sm text-gray-600 mt-1">{form.LOKASI}</p>
                    </div>
                    {getStatusBadge(form.status_verifikasi)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Engineer</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{form.ID_ENGINEER}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">PM Periode</p>
                      <p className="text-sm font-medium text-gray-900 mt-1">{form.PM_PERIODE}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>{new Date(form.created_at).toLocaleDateString('id-ID')}</span>
                    </div>
                    <Button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(form);
                      }}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <Eye className="mr-1.5 h-4 w-4" />
                      Detail
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="text-sm text-gray-600 font-medium">
                  Menampilkan {((currentPage - 1) * pageSize) + 1}-{Math.min(currentPage * pageSize, filteredForms.length)} dari {filteredForms.length} data
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center"
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" />
                    Sebelumnya
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalFilteredPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-8 h-8 p-0"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(Math.min(totalFilteredPages, currentPage + 1))}
                    disabled={currentPage === totalFilteredPages}
                    className="flex items-center"
                  >
                    Selanjutnya
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );

  const renderFormDetail = () => (
    <Dialog open={!!selectedForm} onOpenChange={() => setSelectedForm(null)}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="p-6 pb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
                Detail Form Verifikasi
              </DialogTitle>
              <p className="text-gray-600">
                TID: <span className="font-semibold text-blue-600">{selectedForm?.TID}</span> | 
                Lokasi: <span className="font-semibold">{selectedForm?.LOKASI}</span>
              </p>
            </div>
            <Button
              onClick={() => setSelectedForm(null)}
              variant="ghost"
              size="sm"
              className="rounded-lg"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6">
          {/* Basic Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="border border-gray-200">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-gray-600" />
                  Informasi Dasar
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {[
                    { label: 'Kanwil', value: selectedForm?.KANWIL },
                    { label: 'KC Supervisi', value: selectedForm?.KC_SUPERVISI },
                    { label: 'Project', value: selectedForm?.PROJECT },
                    { label: 'PIC Area', value: selectedForm?.PIC_AREA },
                    { label: 'No PC', value: selectedForm?.NO_PC },
                    { label: 'SN Mini PC', value: selectedForm?.SN_MINI_PC }
                  ].map((item) => (
                    <div key={item.label} className="flex justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <span className="text-sm text-gray-600 font-medium">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-900 text-right max-w-[60%] truncate">
                        {item.value || 'N/A'}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg flex items-center">
                  <ShieldCheck className="mr-2 h-5 w-5 text-gray-600" />
                  Detail Verifikasi
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">Status</span>
                    <div>{getStatusBadge(selectedForm?.status_verifikasi || '')}</div>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">PM Periode</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedForm?.PM_PERIODE}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 font-medium">Engineer</span>
                    <span className="text-sm font-semibold text-gray-900">{selectedForm?.ID_ENGINEER}</span>
                  </div>
                  {selectedForm?.latitude && selectedForm?.longitude && (
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600 font-medium">Koordinat</span>
                      <span className="text-xs font-mono text-gray-900">
                        {selectedForm.latitude}, {selectedForm.longitude}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between py-2">
                    <span className="text-sm text-gray-600 font-medium">Dibuat</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {selectedForm?.created_at ? new Date(selectedForm.created_at).toLocaleString('id-ID') : 'N/A'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Photo Gallery */}
          <Card className="border border-gray-200 mb-8">
            <CardHeader className="bg-gray-50 border-b">
              <CardTitle className="text-lg flex items-center">
                <ImageIcon className="mr-2 h-5 w-5 text-gray-600" />
                Dokumentasi Foto
              </CardTitle>
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
            </CardContent>
          </Card>

          {/* Verification Actions */}
          {selectedForm?.status_verifikasi === 'PENDING' && (
            <Card className="border border-gray-200">
              <CardHeader className="bg-gray-50 border-b">
                <CardTitle className="text-lg flex items-center">
                  <CheckCircle className="mr-2 h-5 w-5 text-gray-600" />
                  Verifikasi Form
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="comment" className="text-gray-800 font-semibold text-sm mb-2 block">
                      Komentar Verifikasi (Opsional)
                    </Label>
                    <Textarea
                      id="comment"
                      rows={4}
                      value={approvalComment}
                      onChange={(e) => setApprovalComment(e.target.value)}
                      placeholder="Masukkan komentar verifikasi..."
                      className="w-full"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setSelectedForm(null)}
                      className="w-full sm:w-auto flex items-center justify-center"
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Tutup Detail
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleSubmitVerification(false)}
                      disabled={isRejecting}
                      className="w-full sm:w-auto flex items-center justify-center"
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
                      className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 flex items-center justify-center"
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
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );

  // Main Render
  return (
    <div className="container mx-auto py-8 px-4">
      {renderHeader()}
      <ErrorBoundary>
        <Suspense fallback={<SuspenseLoader />}>
          {renderSearchAndFilters()}
          {renderTable()}
          {renderFormDetail()}
        </Suspense>
      </ErrorBoundary>

      {/* Image Enlargement Modal */}
      {enlargedImage && (
        <Dialog open={!!enlargedImage} onOpenChange={() => setEnlargedImage(null)}>
          <DialogContent className="max-w-5xl max-h-[90vh] p-0">
            <div className="relative">
              <img 
                src={enlargedImage} 
                alt="Enlarged view" 
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
              <Button
                onClick={() => setEnlargedImage(null)}
                className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 rounded-lg p-2 shadow-lg"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
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