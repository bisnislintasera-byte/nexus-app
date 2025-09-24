'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import * as Timeline from '@/components/ui/timeline';
import { 
  FileText, 
  CheckCircle, 
  XCircle,
  Image as ImageIcon,
  Clock,
  Camera,
  RotateCw,
  User,
  Filter,
  Calendar
} from 'lucide-react';
import { format, isToday, isYesterday, isSameDay } from 'date-fns';
import { id } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import PhotoPreview from '@/components/ui/photo-preview';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

interface VerificationLog {
  id: number;
  timestamp: string;
  action: string;
  user_id: string;
  user_name: string;
  user_role: string;
  details: string;
  status?: string;
  photo_changes?: {
    field: string;
    status?: string;
    comment?: string;
  }[];
  metadata?: Record<string, any>;
  duration?: number;
}

interface GroupedLogs {
  [date: string]: VerificationLog[];
}

interface VerificationHistoryProps {
  formId: string;
  className?: string;
}

export default function VerificationHistory({ formId, className = "" }: VerificationHistoryProps) {
  const [logs, setLogs] = useState<VerificationLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  
  const loadHistory = useCallback(async (pageNum: number = 1) => {
    try {
      if (pageNum === 1) setLoading(true);
      const limit = 20;
      const skip = (pageNum - 1) * limit;
      
      // Get both form logs and verification logs
      const [formLogsRes, verificationLogsRes] = await Promise.all([
        fetch(`/api/form/logs/${formId}?skip=${skip}&limit=${limit}`),
        fetch(`/api/verification/logs/form/${formId}?skip=${skip}&limit=${limit}`)
      ]);

      const formLogs = await formLogsRes.json();
      const verificationLogs = await verificationLogsRes.json();

      // Combine and sort logs by timestamp
      const newLogs = [...formLogs, ...verificationLogs]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

      if (pageNum === 1) {
        setLogs(newLogs);
      } else {
        setLogs(prevLogs => [...prevLogs, ...newLogs]);
      }

      setHasMore(newLogs.length === limit);
    } catch (error) {
      console.error('Failed to load history:', error);
    } finally {
      setLoading(false);
    }
  }, [formId]);

  useEffect(() => {
    loadHistory(1);
  }, [loadHistory, filter]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    const nextPage = page + 1;
    setPage(nextPage);
    loadHistory(nextPage);
  }, [hasMore, loading, page, loadHistory]);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'SUBMIT_FORM':
        return <FileText className="h-4 w-4 text-blue-600" />;
      case 'APPROVE_FORM':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'REJECT_FORM':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'UPDATE_PHOTO':
        return <Camera className="h-4 w-4 text-amber-600" />;
      case 'RESUBMIT_FORM':
        return <RotateCw className="h-4 w-4 text-purple-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActionBadgeStyle = (action: string) => {
    switch (action) {
      case 'SUBMIT_FORM':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'APPROVE_FORM':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'REJECT_FORM':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'UPDATE_PHOTO':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'RESUBMIT_FORM':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    if (isToday(date)) {
      return 'Hari ini';
    } else if (isYesterday(date)) {
      return 'Kemarin';
    }
    return format(date, "d MMMM yyyy", { locale: id });
  };

  // Group logs by date
  const groupedLogs = logs.reduce<GroupedLogs>((groups, log) => {
    const date = format(new Date(log.timestamp), 'yyyy-MM-dd');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {});

  if (loading && logs.length === 0) {
    return (
      <Card className={className}>
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="flex items-center justify-between text-lg">
            <div className="flex items-center">
              <Clock className="mr-2 h-5 w-5 text-gray-600" />
              Riwayat Verifikasi
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilter('all')}>
                  Semua Aktivitas
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('verification')}>
                  Verifikasi
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilter('photo')}>
                  Foto
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b sticky top-0 z-20">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center">
            <Clock className="mr-2 h-5 w-5 text-gray-600" />
            Riwayat Verifikasi
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setFilter('all')}>
                Semua Aktivitas
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('verification')}>
                Verifikasi
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter('photo')}>
                Foto
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {logs.length === 0 ? (
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Belum ada riwayat</h3>
            <p className="mt-1 text-sm text-gray-500">
              Form ini belum memiliki riwayat verifikasi.
            </p>
          </div>
        ) : (
          <Timeline.Root>
            {Object.entries(groupedLogs).map(([date, dayLogs]) => (
              <Timeline.Day key={date} date={new Date(date)}>
                {dayLogs.map((log) => (
                  <Timeline.Item
                    key={log.id}
                    icon={getActionIcon(log.action)}
                    time={new Date(log.timestamp)}
                  >
                    {/* Action and User */}
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className={getActionBadgeStyle(log.action)}>
                        {log.action.replace('_', ' ')}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-600">
                        <User className="h-4 w-4 mr-1" />
                        <span>{log.user_name || log.user_id}</span>
                      </div>
                    </div>

                    {/* Details */}
                    <p className="text-sm text-gray-700">{log.details}</p>

                    {/* Photo Changes */}
                    {log.photo_changes && log.photo_changes.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {log.photo_changes.map((change, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-sm">
                            <ImageIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                            <div className="flex-1">
                              <div className="flex items-start justify-between">
                                <div>
                                  <span className="font-medium">{change.field}</span>
                                  {change.status && (
                                    <span className={`ml-2 text-sm ${
                                      change.status === 'ACCEPTED' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                      {change.status}
                                    </span>
                                  )}
                                </div>
                                {/* Show preview if the field is a photo field */}
                                {change.field.startsWith('FOTO_') && (
                                  <PhotoPreview
                                    url={`/api/photos/${formId}/${change.field}`}
                                    alt={change.field}
                                  />
                                )}
                              </div>
                              {change.comment && (
                                <p className="text-gray-500 mt-0.5 text-sm">{change.comment}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Duration if available */}
                    {log.duration && (
                      <div className="mt-2 text-xs text-gray-500">
                        Durasi: {Math.round(log.duration / 60)} menit
                      </div>
                    )}
                  </Timeline.Item>
                ))}
              </Timeline.Day>
            ))}

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-4 text-center">
                <Button
                  variant="outline"
                  onClick={loadMore}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900" />
                  ) : (
                    'Muat Lebih Banyak'
                  )}
                </Button>
              </div>
            )}
          </Timeline.Root>
        )}
      </CardContent>
    </Card>
  );
}