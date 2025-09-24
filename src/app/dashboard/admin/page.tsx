'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Database, 
  BarChart3, 
  ShieldCheck,
  UserCog,
  HardDrive,
  FileBarChart,
  Settings,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ArrowLeft
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface AdminStats {
  totalUsers: number;
  totalMasterData: number;
  totalForms: number;
  pendingForms: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalMasterData: 0,
    totalForms: 0,
    pendingForms: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek apakah user sudah login dan memiliki role ADMIN
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'ADMIN') {
      router.push('/auth/login');
      return;
    }
    
    setUserRole(role);
    loadStats();
  }, [router]);

  const loadStats = async () => {
    try {
      const response = await api.get<AdminStats>('/users/admin/stats');
      setStats(response.data);
    } catch (error) {
      toast.error('Failed to load dashboard statistics');
      console.error('Error loading stats:', error);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => router.back()}
              variant="outline"
              size="sm"
              className="flex items-center"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard Administrator</h1>
              <p className="text-gray-600 mt-2">Kelola sistem verifikasi aset</p>
            </div>
          </div>
          <Button 
            variant="outline"
            className="flex items-center whitespace-nowrap"
          >
            <Settings className="mr-2 h-4 w-4" />
            Pengaturan Sistem
          </Button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Statistik Cards - Responsive grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">Total Pengguna</CardTitle>
              <Users className="h-6 w-6 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-900">{stats.totalUsers}</div>
              <p className="text-xs text-blue-700 mt-1">Pengguna terdaftar</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-800">Data Master</CardTitle>
              <Database className="h-6 w-6 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-900">{stats.totalMasterData}</div>
              <p className="text-xs text-green-700 mt-1">Entri data master</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-purple-800">Total Form</CardTitle>
              <FileBarChart className="h-6 w-6 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-900">{stats.totalForms}</div>
              <p className="text-xs text-purple-700 mt-1">Form verifikasi</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm hover:shadow-md transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">Form Pending</CardTitle>
              <Clock className="h-6 w-6 text-yellow-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-900">{stats.pendingForms}</div>
              <p className="text-xs text-yellow-700 mt-1">Menunggu verifikasi</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions - Responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2 bg-white shadow rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <ShieldCheck className="mr-2 h-5 w-5 text-blue-600" />
                Manajemen Sistem
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  onClick={() => router.push('/admin/users')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-lg shadow transition-all hover:scale-[1.02] flex items-center justify-center"
                >
                  <UserCog className="mr-2 h-5 w-5" />
                  Manajemen Pengguna
                </Button>
                <Button 
                  onClick={() => router.push('/admin/master-data')}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-lg shadow transition-all hover:scale-[1.02] flex items-center justify-center"
                >
                  <HardDrive className="mr-2 h-5 w-5" />
                  Data Master Aset
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-300 text-gray-700 py-4 rounded-lg shadow transition-all hover:scale-[1.02] flex items-center justify-center"
                >
                  <BarChart3 className="mr-2 h-5 w-5" />
                  Laporan & Statistik
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-300 text-gray-700 py-4 rounded-lg shadow transition-all hover:scale-[1.02] flex items-center justify-center"
                >
                  <Settings className="mr-2 h-5 w-5" />
                  Pengaturan Sistem
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-purple-600" />
                Aktivitas Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  <li className="py-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <UserCog className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Pengguna baru ditambahkan
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          Engineer: John Doe
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-xs text-gray-500">
                        2 jam lalu
                      </div>
                    </div>
                  </li>
                  <li className="py-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                        <HardDrive className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Data master diperbarui
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          TID: TID005 - Jakarta Pusat
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-xs text-gray-500">
                        1 hari lalu
                      </div>
                    </div>
                  </li>
                  <li className="py-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          Form verifikasi disetujui
                        </p>
                        <p className="text-sm text-gray-500 truncate">
                          VER002 - Semarang
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-xs text-gray-500">
                        2 hari lalu
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* System Information - Responsive grid */}
        <Card className="bg-white shadow rounded-xl overflow-hidden">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-gray-800 flex items-center">
              <Settings className="mr-2 h-5 w-5 text-gray-600" />
              Informasi Sistem
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Versi Sistem</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">v1.0.0</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Status Database</h3>
                <p className="mt-1 text-lg font-semibold text-green-600">Online</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500">Pengguna Aktif</h3>
                <p className="mt-1 text-lg font-semibold text-gray-900">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}