'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText,
  Clock,
  User,
  Eye,
  XCircle,
  CheckCircle,
  Loader2
} from 'lucide-react';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

interface ProfileActivityProps {
  userId: string;
  userName: string;
}

export function ProfileActivity({ userId, userName }: ProfileActivityProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const { logs, total, loading, error, fetchUserActivity } = useAuditLogs();
  const logsPerPage = 5;

  useEffect(() => {
    fetchUserActivity(userId, currentPage, logsPerPage);
  }, [userId, currentPage, fetchUserActivity]);

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
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Memuat aktivitas...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <XCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={() => fetchUserActivity(userId, currentPage, logsPerPage)}
              variant="outline"
              className="mt-4"
            >
              Coba Lagi
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b bg-muted/40">
        <CardTitle className="text-lg font-medium flex items-center">
          <User className="mr-2 h-5 w-5" />
          Aktivitas {userName}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-600">Belum ada aktivitas</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {logs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-muted/50 transition-colors">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(log.action)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {log.action.replace('_', ' ')}
                    </p>
                    <p className="text-sm text-gray-500 mt-0.5">
                      {log.details}
                    </p>
                    <div className="flex items-center mt-1 space-x-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${getActionColor(log.action)}`}>
                        {log.action}
                      </span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(log.timestamp), 'dd MMM yyyy HH:mm', { locale: id })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      {logs.length > 0 && total > logsPerPage && (
        <div className="flex items-center justify-between p-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
          >
            Sebelumnya
          </Button>
          <span className="text-sm text-gray-600">
            Halaman {currentPage} dari {Math.ceil(total / logsPerPage)}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={currentPage >= Math.ceil(total / logsPerPage) || loading}
          >
            Selanjutnya
          </Button>
        </div>
      )}
    </Card>
  );
}