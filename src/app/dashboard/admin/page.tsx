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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-blue-900">Total Pengguna</CardTitle>
              <div className="p-2 bg-blue-200/50 rounded-xl">
                <Users className="h-5 w-5 text-blue-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900">{stats.totalUsers}</div>
              <p className="text-sm text-blue-700 mt-1 font-medium">Pengguna terdaftar</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-green-900">Data Master</CardTitle>
              <div className="p-2 bg-green-200/50 rounded-xl">
                <Database className="h-5 w-5 text-green-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900">{stats.totalMasterData}</div>
              <p className="text-sm text-green-700 mt-1 font-medium">Entri data master</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-purple-900">Total Form</CardTitle>
              <div className="p-2 bg-purple-200/50 rounded-xl">
                <FileBarChart className="h-5 w-5 text-purple-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-900">{stats.totalForms}</div>
              <p className="text-sm text-purple-700 mt-1 font-medium">Form verifikasi</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-semibold text-amber-900">Form Pending</CardTitle>
              <div className="p-2 bg-amber-200/50 rounded-xl">
                <Clock className="h-5 w-5 text-amber-700" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-900">{stats.pendingForms}</div>
              <p className="text-sm text-amber-700 mt-1 font-medium">Menunggu verifikasi</p>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions - Responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          <Card className="lg:col-span-2 bg-white shadow-xl rounded-2xl overflow-hidden border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <div className="p-2 bg-blue-100 rounded-xl mr-3">
                  <ShieldCheck className="h-6 w-6 text-blue-600" />
                </div>
                Manajemen Sistem
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  onClick={() => router.push('/admin/users')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center group"
                >
                  <UserCog className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-semibold">Manajemen Pengguna</span>
                </Button>
                <Button 
                  onClick={() => router.push('/admin/master-data')}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 rounded-xl shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center group"
                >
                  <HardDrive className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-semibold">Data Master Aset</span>
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-200 text-gray-700 py-6 rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:bg-gray-50 flex items-center justify-center group"
                >
                  <BarChart3 className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-semibold">Laporan & Statistik</span>
                </Button>
                <Button 
                  variant="outline"
                  className="border-gray-200 text-gray-700 py-6 rounded-xl shadow-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:bg-gray-50 flex items-center justify-center group"
                >
                  <Settings className="mr-3 h-6 w-6 group-hover:scale-110 transition-transform duration-300" />
                  <span className="font-semibold">Pengaturan Sistem</span>
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border-0">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
                <div className="p-2 bg-purple-100 rounded-xl mr-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                Aktivitas Terbaru
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flow-root">
                <ul className="divide-y divide-gray-100">
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                        <UserCog className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          Pengguna baru ditambahkan
                        </p>
                        <p className="text-xs text-gray-600 truncate mt-1">
                          Engineer: John Doe
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-xs text-gray-500 font-medium">
                        2 jam lalu
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                        <HardDrive className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          Data master diperbarui
                        </p>
                        <p className="text-xs text-gray-600 truncate mt-1">
                          TID: TID005 - Jakarta Pusat
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-xs text-gray-500 font-medium">
                        1 hari lalu
                      </div>
                    </div>
                  </li>
                  <li className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-xl bg-purple-100 flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          Form verifikasi disetujui
                        </p>
                        <p className="text-xs text-gray-600 truncate mt-1">
                          VER002 - Semarang
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-xs text-gray-500 font-medium">
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
        <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border-0">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center">
              <div className="p-2 bg-gray-100 rounded-xl mr-3">
                <Settings className="h-6 w-6 text-gray-600" />
              </div>
              Informasi Sistem
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-6 bg-gray-50 rounded-xl border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-600">Versi Sistem</h3>
                <p className="mt-2 text-xl font-bold text-gray-900">v1.0.0</p>
              </div>
              <div className="p-6 bg-green-50 rounded-xl border border-green-100">
                <h3 className="text-sm font-semibold text-gray-600">Status Database</h3>
                <p className="mt-2 text-xl font-bold text-green-600">Online</p>
              </div>
              <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                <h3 className="text-sm font-semibold text-gray-600">Pengguna Aktif</h3>
                <p className="mt-2 text-xl font-bold text-blue-600">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}