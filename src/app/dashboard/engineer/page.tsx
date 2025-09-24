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
  PlusCircle,
  MapPin,
  Wrench,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import api from '@/lib/api';
import { FormVerification } from '@/types';

export default function EngineerDashboard() {
  const router = useRouter();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalForms: 0,
    pendingForms: 0,
    approvedForms: 0,
    rejectedForms: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'ENGINEER') {
      router.push('/auth/login');
      return;
    }

    setUserRole(role);
    loadDashboardStats();
  }, [router]);

  const loadDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await api.get<FormVerification[]>('/form/mine');
      const forms = response.data;

      const totalForms = forms.length;
      const pendingForms = forms.filter(
        (form) => form.status_verifikasi === 'PENDING'
      ).length;
      const approvedForms = forms.filter(
        (form) => form.status_verifikasi === 'APPROVED'
      ).length;
      const rejectedForms = forms.filter(
        (form) => form.status_verifikasi === 'REJECTED'
      ).length;

      setStats({
        totalForms,
        pendingForms,
        approvedForms,
        rejectedForms,
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
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Dashboard Engineer
            </h1>
            <p className="text-gray-600 mt-2">
              Selamat datang! Kelola form verifikasi aset Anda di sini.
            </p>
          </div>
          <Button
            onClick={() => router.push('/engineer/form')}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg flex items-center whitespace-nowrap"
          >
            <PlusCircle className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
            Buat Form Baru
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Statistik Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {/* Total */}
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-blue-800">
                Total Form
              </CardTitle>
              <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-8">
                  <Loader2 className="h-4 w-4 animate-spin text-blue-600" />
                </div>
              ) : (
                <>
                  <div className="text-xl sm:text-2xl font-bold text-blue-900">
                    {stats.totalForms}
                  </div>
                  <p className="text-xs sm:text-sm text-blue-700 mt-1">
                    Form yang telah dibuat
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Pending */}
          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-yellow-800">
                Pending
              </CardTitle>
              <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-8">
                  <Loader2 className="h-4 w-4 animate-spin text-yellow-600" />
                </div>
              ) : (
                <>
                  <div className="text-xl sm:text-2xl font-bold text-yellow-900">
                    {stats.pendingForms}
                  </div>
                  <p className="text-xs sm:text-sm text-yellow-700 mt-1">
                    Menunggu verifikasi
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Approved */}
          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-green-800">
                Disetujui
              </CardTitle>
              <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-8">
                  <Loader2 className="h-4 w-4 animate-spin text-green-600" />
                </div>
              ) : (
                <>
                  <div className="text-xl sm:text-2xl font-bold text-green-900">
                    {stats.approvedForms}
                  </div>
                  <p className="text-xs sm:text-sm text-green-700 mt-1">
                    Form yang telah disetujui
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          {/* Rejected */}
          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-red-800">
                Ditolak
              </CardTitle>
              <XCircle className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center h-8">
                  <Loader2 className="h-4 w-4 animate-spin text-red-600" />
                </div>
              ) : (
                <>
                  <div className="text-xl sm:text-2xl font-bold text-red-900">
                    {stats.rejectedForms}
                  </div>
                  <p className="text-xs sm:text-sm text-red-700 mt-1">
                    Form yang perlu diperbaiki
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions + Panduan */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Aksi Cepat */}
          <Card className="lg:col-span-2 bg-white shadow rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <Wrench className="mr-2 h-5 w-5 text-blue-600" />
                Aksi Cepat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={() => router.push('/engineer/form')}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-4 rounded-lg shadow transition-all hover:scale-105"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Buat Form Verifikasi
                </Button>
                <Button
                  onClick={() => router.push('/engineer/my-forms')}
                  className="bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white py-4 rounded-lg shadow transition-all hover:scale-105"
                >
                  <FileText className="mr-2 h-5 w-5" />
                  Lihat Semua Form
                </Button>
                <Button
                  onClick={() =>
                    router.push('/engineer/my-forms?status=rejected')
                  }
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-4 rounded-lg shadow transition-all hover:scale-105"
                >
                  <XCircle className="mr-2 h-5 w-5" />
                  Form Ditolak
                </Button>
                <Button
                  onClick={() =>
                    router.push('/engineer/my-forms?status=pending')
                  }
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white py-4 rounded-lg shadow transition-all hover:scale-105"
                >
                  <Clock className="mr-2 h-5 w-5" />
                  Form Pending
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Panduan Penggunaan */}
          <Card className="bg-white shadow rounded-xl overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center text-lg sm:text-xl">
                <MapPin className="mr-2 h-5 w-5 text-green-600" />
                Panduan Penggunaan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-blue-800">1</span>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    Pilih TID dari daftar master data
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-blue-800">2</span>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    Aktifkan geolocation untuk mendapatkan lokasi
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-blue-800">3</span>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    Lengkapi checklist dan upload foto
                  </p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0 h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                    <span className="text-xs font-medium text-blue-800">4</span>
                  </div>
                  <p className="ml-3 text-sm text-gray-600">
                    Kirim form untuk verifikasi
                  </p>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
