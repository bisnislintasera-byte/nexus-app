'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Eye,
  ShieldCheck,
  AlertTriangle,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import api from '@/lib/api';


export default function VerificatorDashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [stats, setStats] = useState({
    pendingForms: 0,
    approvedForms: 0,
    rejectedForms: 0,
    todayVerified: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek apakah user sudah login dan memiliki role VERIFIKATOR
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'VERIFIKATOR') {
      router.push('/auth/login');
      return;
    }
    
    setUserRole(role);
    loadDashboardStats();
  }, [router]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/verification/stats');
      const stats = response.data;
      
      setStats({
        pendingForms: stats.pendingForms,
        approvedForms: stats.approvedForms,
        rejectedForms: stats.rejectedForms,
        todayVerified: stats.todayVerified
      });
    } catch (error) {
      console.error('Failed to load dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!userRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-4 sm:py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Dashboard Verifikator
            </h1>
            <p className="text-gray-600 mt-2">
              Selamat datang di pusat verifikasi dan manajemen form aset
            </p>
          </div>
          <Button 
            onClick={() => router.push('/verificator/pending-forms')}
            className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white px-6 py-2.5 rounded-lg shadow-lg flex items-center gap-2 transition-all duration-200 hover:scale-105"
          >
            <Eye className="h-5 w-5" />
            Form Menunggu Verifikasi
            {stats.pendingForms > 0 && (
              <span className="inline-flex items-center justify-center px-2.5 py-1 ml-2 text-xs font-medium bg-white bg-opacity-20 rounded-full">
                {stats.pendingForms}
              </span>
            )}
          </Button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Statistik Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">Pending</CardTitle>
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-8">
                  <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
                </div>
              ) : (
                <>
                  <div className="text-xl sm:text-2xl font-bold text-yellow-900">{stats.pendingForms}</div>
                  <p className="text-xs sm:text-sm text-yellow-700 mt-1">Form menunggu verifikasi</p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Disetujui</CardTitle>
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-8">
                  <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                </div>
              ) : (
                <>
                  <div className="text-xl sm:text-2xl font-bold text-green-900">{stats.approvedForms}</div>
                  <p className="text-xs sm:text-sm text-green-700 mt-1">Form yang telah disetujui</p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-800">Ditolak</CardTitle>
              <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-8">
                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                </div>
              ) : (
                <>
                  <div className="text-xl sm:text-2xl font-bold text-red-900">{stats.rejectedForms}</div>
                  <p className="text-xs sm:text-sm text-red-700 mt-1">Form yang ditolak</p>
                </>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Hari Ini</CardTitle>
              <ShieldCheck className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-8">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                </div>
              ) : (
                <>
                  <div className="text-xl sm:text-2xl font-bold text-blue-900">{stats.todayVerified}</div>
                  <p className="text-xs sm:text-sm text-blue-700 mt-1">Form diverifikasi hari ini</p>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
          <Card className="lg:col-span-2 bg-white shadow rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <ShieldCheck className="mr-2 h-5 w-5 text-green-600" />
                Aksi Verifikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  onClick={() => router.push('/verificator/pending-forms')}
                  className="group relative bg-white border-2 border-indigo-100 hover:border-indigo-200 text-gray-700 py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-blue-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <div className="relative flex items-center justify-center gap-3">
                    <Eye className="h-5 w-5 text-indigo-600" />
                    <span className="font-medium">Verifikasi Form Pending</span>
                    {stats.pendingForms > 0 && (
                      <span className="px-2 py-1 text-xs font-semibold bg-indigo-100 text-indigo-700 rounded-full">
                        {stats.pendingForms} form
                      </span>
                    )}
                  </div>
                </Button>
                
                <Button 
                  onClick={() => router.push('/verificator/pending-forms')}
                  className="group relative bg-white border-2 border-emerald-100 hover:border-emerald-200 text-gray-700 py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-50 to-green-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <div className="relative flex items-center justify-center gap-3">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium">Form Disetujui</span>
                    {stats.approvedForms > 0 && (
                      <span className="px-2 py-1 text-xs font-semibold bg-emerald-100 text-emerald-700 rounded-full">
                        {stats.approvedForms} form
                      </span>
                    )}
                  </div>
                </Button>
                
                <Button 
                  onClick={() => router.push('/verificator/pending-forms')}
                  className="group relative bg-white border-2 border-red-100 hover:border-red-200 text-gray-700 py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-red-50 to-orange-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <div className="relative flex items-center justify-center gap-3">
                    <XCircle className="h-5 w-5 text-red-600" />
                    <span className="font-medium">Form Ditolak</span>
                    {stats.rejectedForms > 0 && (
                      <span className="px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                        {stats.rejectedForms} form
                      </span>
                    )}
                  </div>
                </Button>
                
                <Button 
                  onClick={() => router.push('/verificator/audit-logs')}
                  className="group relative bg-white border-2 border-gray-100 hover:border-gray-200 text-gray-700 py-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <div className="relative flex items-center justify-center gap-3">
                    <FileText className="h-5 w-5 text-gray-600" />
                    <span className="font-medium">Riwayat Verifikasi</span>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-orange-600" />
                Panduan Verifikasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-blue-800">1</span>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Periksa kelengkapan data form</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-blue-800">2</span>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Verifikasi foto dokumentasi</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-blue-800">3</span>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Periksa lokasi geografis</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-blue-800">4</span>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">Setujui atau tolak form dengan alasan yang jelas</p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        </div>
      </div>
    );
}