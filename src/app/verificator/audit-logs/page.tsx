'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { BackButton } from '@/components/ui/BackButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  FileText, 
  Clock, 
  User,
  Eye,
  XCircle,
  CheckCircle,
  Loader2,
  Search,
  Filter,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { useAuditLogs, type AuditLogFilters } from '@/hooks/useAuditLogs';
import { AuditLogFilters as AuditFilters } from '@/components/audit/AuditLogFilters';

interface AuditLog {
  id: number;
  user_id: string;
  action: string;
  timestamp: string;
  details: string;
}

export default function AuditLogsPage() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<AuditLogFilters>({});
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const { logs, total, loading, error, fetchLogs } = useAuditLogs();
  const logsPerPage = 10;

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'VERIFIKATOR') {
      router.push('/auth/login');
      return;
    }

    fetchLogs(currentPage, logsPerPage, filters);
  }, [router, currentPage, filters, fetchLogs]);

  const handleFilterChange = (newFilters: AuditLogFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  useEffect(() => {
    setTotalPages(Math.ceil(total / logsPerPage));
  }, [total]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'APPROVE_FORM':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'REJECT_FORM':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'CREATE_FORM':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <Eye className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionBadge = (action: string) => {
    const baseClasses = "inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm border";
    switch (action) {
      case 'APPROVE_FORM':
        return (
          <span className={`${baseClasses} bg-green-50 text-green-800 border-green-200`}>
            <CheckCircle className="mr-1.5 h-3.5 w-3.5" />
            Approve
          </span>
        );
      case 'REJECT_FORM':
        return (
          <span className={`${baseClasses} bg-red-50 text-red-800 border-red-200`}>
            <XCircle className="mr-1.5 h-3.5 w-3.5" />
            Reject
          </span>
        );
      case 'CREATE_FORM':
        return (
          <span className={`${baseClasses} bg-blue-50 text-blue-800 border-blue-200`}>
            <FileText className="mr-1.5 h-3.5 w-3.5" />
            Create
          </span>
        );
      default:
        return (
          <span className={`${baseClasses} bg-gray-50 text-gray-800 border-gray-200`}>
            <Eye className="mr-1.5 h-3.5 w-3.5" />
            {action}
          </span>
        );
    }
  };

  // Filter logs based on search and action
  const filteredLogs = logs.filter(log => {
    const matchesSearch = !searchQuery || 
      log.user_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesAction = !actionFilter || log.action === actionFilter;
    
    return matchesSearch && matchesAction;
  });

  // Pagination for filtered results
  const totalFilteredPages = Math.ceil(filteredLogs.length / logsPerPage);
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          <BackButton variant="outline" />
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Riwayat Verifikasi
            </h1>
            <p className="text-gray-600 mt-2 text-lg">
              Audit log semua aktivitas verifikasi
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
            variant="outline"
            className="flex items-center shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6 shadow-lg border-0">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Cari berdasarkan user ID atau detail aktivitas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            
            {/* Action Filter */}
            <div className="w-full lg:w-48">
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Filter Aksi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Semua Aksi</SelectItem>
                  <SelectItem value="APPROVE_FORM">Approve Form</SelectItem>
                  <SelectItem value="REJECT_FORM">Reject Form</SelectItem>
                  <SelectItem value="CREATE_FORM">Create Form</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {isFilterExpanded && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <AuditFilters onFilterChange={handleFilterChange} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Audit Logs Table */}
      <Card className="shadow-xl border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100 sticky top-0 z-10">
          <CardTitle className="flex items-center text-xl font-bold">
            <div className="p-2 bg-blue-100 rounded-xl mr-3">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            Log Aktivitas
            <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium">
              {filteredLogs.length} log
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {paginatedLogs.length === 0 ? (
            <div className="text-center py-20">
              <div className="mx-auto h-16 w-16 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Tidak ada log yang ditemukan</h3>
              <p className="text-gray-500 text-lg">
                Belum ada aktivitas verifikasi yang tercatat atau tidak sesuai filter.
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
                        User & Aksi
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Detail
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Waktu
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginatedLogs.map((log, index) => (
                      <tr 
                        key={log.id}
                        className={`transition-colors duration-200 hover:bg-blue-50/50 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                        }`}
                      >
                        <td className="px-6 py-5">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center mr-4">
                              {getActionIcon(log.action)}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">{log.user_id}</p>
                              <div className="mt-2">
                                {getActionBadge(log.action)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <p className="text-sm text-gray-900 leading-relaxed max-w-md">
                            {log.details}
                          </p>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="mr-2 h-4 w-4" />
                            <div>
                              <p className="font-medium">{new Date(log.timestamp).toLocaleDateString('id-ID')}</p>
                              <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleTimeString('id-ID')}</p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden divide-y divide-gray-100">
                {paginatedLogs.map((log) => (
                  <div 
                    key={log.id}
                    className="p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start gap-4 mb-4">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        {getActionIcon(log.action)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-sm font-bold text-gray-900">{log.user_id}</p>
                          {getActionBadge(log.action)}
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                          {log.details}
                        </p>
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>{new Date(log.timestamp).toLocaleString('id-ID')}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                  <div className="text-sm text-gray-600 font-medium">
                    Menampilkan {((currentPage - 1) * logsPerPage) + 1}-{Math.min(currentPage * logsPerPage, filteredLogs.length)} dari {filteredLogs.length} log
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
    </div>
  );
}