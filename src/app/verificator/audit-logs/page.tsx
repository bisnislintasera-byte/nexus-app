'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/BackButton';
import { 
  FileText, 
  Clock, 
  User,
  Eye,
  XCircle,
  CheckCircle,
  Loader2
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
    setCurrentPage(1); // Reset to first page when filters change
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

  const getActionColor = (action: string) => {
    switch (action) {
      case 'APPROVE_FORM':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'REJECT_FORM':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'CREATE_FORM':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Riwayat Verifikasi</h1>
          <p className="text-gray-600 mt-2">Audit log semua aktivitas verifikasi</p>
        </div>
        <BackButton variant="outline" />
      </div>

      <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center text-lg sm:text-xl">
            <FileText className="mr-2 h-5 w-5 text-blue-600" />
            Log Aktivitas
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {logs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada log</h3>
              <p className="mt-1 text-sm text-gray-500">
                Belum ada aktivitas verifikasi yang tercatat.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {logs.map((log) => (
                <div key={log.id} className="px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      {getActionIcon(log.action)}
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {log.action.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            {log.details}
                          </p>
                        </div>
                        <div className="mt-2 sm:mt-0 flex flex-col items-end">
                          <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getActionColor(log.action)}`}>
                            <span>{log.user_id}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {new Date(log.timestamp).toLocaleString('id-ID')}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {logs.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Menampilkan halaman <span className="font-medium">{currentPage}</span> dari <span className="font-medium">{totalPages}</span>
          </div>
          <div className="flex space-x-2">
            <Button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              variant="outline"
            >
              Sebelumnya
            </Button>
            <Button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              variant="outline"
            >
              Selanjutnya
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}