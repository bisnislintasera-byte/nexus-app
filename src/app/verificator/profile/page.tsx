'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  FileCheck, 
  CheckCircle, 
  XCircle, 
  Clock, 
  TrendingUp, 
  Calendar,
  Download,
  Loader2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import html2canvas from 'html2canvas';

interface KPIData {
  verifikator_id: string;
  nama_verifikator: string;
  total_verifikasi: number;
  total_sukses: number;
  total_gagal: number;
  rata_rata_waktu_verifikasi: string;
  per_periode: {
    periode: string;
    total: number;
    sukses: number;
    gagal: number;
    rata_rata_waktu: string;
  }[];
  trend_harian: {
    tanggal: string;
    jumlah: number;
  }[];
  log_terbaru: {
    action_type: string;
    form_id: string;
    status_verifikasi: string;
    comment_verifikasi?: string;
    action_time: string;
  }[];
}

const COLORS = ['#10B981', '#EF4444', '#F59E0B'];

// Perbaiki pieData untuk menghindari error saat kpiData belum dimuat
const getPieData = (kpiData: KPIData | null) => {
  if (!kpiData) return [];
  return [
    { name: 'Sukses', value: kpiData.total_sukses },
    { name: 'Gagal', value: kpiData.total_gagal },
    { name: 'Total', value: kpiData.total_verifikasi }
  ];
};

export default function VerificatorProfilePage() {
  const router = useRouter();
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const analyticsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cek apakah user sudah login dan memiliki role VERIFIKATOR
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    const userId = localStorage.getItem('user_id');
    
    if (!token || role !== 'VERIFIKATOR') {
      router.push('/auth/login');
      return;
    }

    // Load KPI data
    loadKPIData(userId || '');
  }, [router]);

  const loadKPIData = async (verifikatorId: string) => {
    try {
      const response = await api.get<KPIData>(`/verifikator/kpi/${verifikatorId}`);
      setKpiData(response.data);
    } catch (error) {
      toast.error('Gagal memuat data profil verifikator');
      console.error('Error loading KPI data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    if (!analyticsRef.current) {
      toast.error('Tidak dapat mengekspor data');
      return;
    }

    setExporting(true);
    try {
      // Tunggu sebentar untuk memastikan semua elemen telah dirender
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Menggunakan html2canvas untuk mengambil screenshot
      const canvas = await html2canvas(analyticsRef.current, {
        scale: 2, // Meningkatkan kualitas gambar
        useCORS: true, // Memungkinkan pemuatan gambar dari sumber eksternal
        backgroundColor: '#ffffff', // Latar belakang putih
        logging: false, // Menonaktifkan logging untuk mengurangi output
        scrollX: 0,
        scrollY: 0,
      });

      // Membuat URL dari canvas
      const image = canvas.toDataURL('image/png');

      // Membuat elemen link untuk download
      const link = document.createElement('a');
      link.href = image;
      link.download = `profil-verifikator-${kpiData?.verifikator_id || 'data'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success('Berhasil mengekspor data sebagai gambar');
    } catch (error) {
      toast.error('Gagal mengekspor data');
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="mr-1 h-3 w-3" />
            Disetujui
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <XCircle className="mr-1 h-3 w-3" />
            Ditolak
          </span>
        );
      case 'PENDING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            Unknown
          </span>
        );
    }
  };

  const getActionTypeBadge = (actionType: string) => {
    switch (actionType) {
      case 'INSERT':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            Baru
          </span>
        );
      case 'UPDATE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Update
          </span>
        );
      case 'DELETE':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Hapus
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {actionType}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  // Tampilkan pesan jika tidak ada data
  if (!kpiData) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Data tidak ditemukan</h3>
          <p className="mt-1 text-sm text-gray-500">
            Tidak dapat memuat data profil verifikator.
          </p>
          <div className="mt-6">
            <Button
              onClick={() => router.back()}
              className="flex items-center mx-auto"
            >
              <XCircle className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Data untuk pie chart
  const pieData = [
    { name: 'Sukses', value: kpiData.total_sukses },
    { name: 'Gagal', value: kpiData.total_gagal },
    { name: 'Total', value: kpiData.total_verifikasi }
  ];

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profil Verifikator</h1>
          <p className="text-gray-600 mt-2">Detail dan analitik kinerja verifikasi</p>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex items-center"
          >
            <XCircle className="mr-2 h-4 w-4" />
            Kembali
          </Button>
          <Button
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center bg-green-600 hover:bg-green-700"
          >
            {exporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            Export PNG
          </Button>
        </div>
      </div>

      <div ref={analyticsRef}>
        {/* Profile Header */}
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <div className="flex items-center">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                <User className="h-8 w-8 text-gray-400" />
              </div>
              <div className="ml-4">
                <CardTitle className="text-2xl text-gray-900">
                  {kpiData?.nama_verifikator}
                </CardTitle>
                <p className="text-gray-600">ID: {kpiData?.verifikator_id}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <FileCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Total Verifikasi</p>
                    <p className="text-2xl font-bold text-gray-900">{kpiData.total_verifikasi || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-full">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Sukses</p>
                    <p className="text-2xl font-bold text-gray-900">{kpiData.total_sukses || 0}</p>
                  </div>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-100 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 rounded-full">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-600">Gagal</p>
                    <p className="text-2xl font-bold text-gray-900">{kpiData.total_gagal || 0}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-100 transition-all duration-300 hover:shadow-md">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Rata-rata Waktu Verifikasi</p>
                  <p className="text-2xl font-bold text-gray-900">{kpiData.rata_rata_waktu_verifikasi || '0 menit'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Daily Trend Chart */}
          <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center text-lg">
                <TrendingUp className="mr-2 h-5 w-5 text-blue-600" />
                Tren Aktivitas Harian
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={kpiData?.trend_harian}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="tanggal" 
                      tickFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' });
                      }}
                    />
                    <YAxis />
                    <Tooltip 
                      formatter={(value) => [value, 'Jumlah']}
                      labelFormatter={(value) => {
                        const date = new Date(value);
                        return date.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
                      }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="jumlah" 
                      stroke="#3b82f6" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Success/Failure Distribution */}
          <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <CardTitle className="flex items-center text-lg">
                <PieChart className="mr-2 h-5 w-5 text-blue-600" />
                Distribusi Hasil Verifikasi
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getPieData(kpiData)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => {
                        const total = getPieData(kpiData).reduce((sum, item) => sum + item.value, 0) || 1;
                        const percent = (Number(entry.value) / total) * 100;
                        return `${entry.name}: ${percent.toFixed(0)}%`;
                      }}
                    >
                      {getPieData(kpiData).map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Jumlah']} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Per Period Data */}
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden mb-8">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center text-lg">
              <Calendar className="mr-2 h-5 w-5 text-blue-600" />
              Detail Verifikasi Per Periode
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6">
                      Periode
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6">
                      Total
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6">
                      Sukses
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6">
                      Gagal
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider md:px-6">
                      Rata-rata Waktu
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {kpiData?.per_periode.map((periode, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 md:px-6">
                        {periode.periode}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 md:px-6">
                        {periode.total}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-green-600 md:px-6">
                        {periode.sukses}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-red-600 md:px-6">
                        {periode.gagal}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 md:px-6">
                        {periode.rata_rata_waktu}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity Logs */}
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center text-lg">
              <Clock className="mr-2 h-5 w-5 text-blue-600" />
              Aktivitas Terbaru
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {kpiData && kpiData.log_terbaru.length === 0 ? (
              <div className="text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada aktivitas</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Belum ada aktivitas verifikasi yang dicatat.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {kpiData?.log_terbaru.map((log, index) => (
                  <div key={index} className="px-6 py-4 hover:bg-gray-50 transition">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-blue-600">
                          Form ID: {log.form_id}
                        </p>
                        <div className="flex items-center mt-1">
                          {getActionTypeBadge(log.action_type)}
                          <span className="ml-2 text-sm text-gray-500">
                            {new Date(log.action_time).toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusBadge(log.status_verifikasi)}
                      </div>
                    </div>
                    {log.comment_verifikasi && (
                      <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                        <p>{log.comment_verifikasi}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}