'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Settings, 
  PlusCircle, 
  Trash2,
  Save,
  AlertCircle
} from 'lucide-react';

export default function PMPeriodeManagementPage() {
  const router = useRouter();
  const [periodeList, setPeriodeList] = useState<string[]>(['PM1', 'PM2', 'PM3', 'PM4', 'PM5', 'PM6', 'PM7']);
  const [newPeriode, setNewPeriode] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    // Cek apakah user sudah login dan memiliki role ADMIN
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'ADMIN') {
      router.push('/auth/login');
      return;
    }

    // Load PM Periode settings
    loadPMPeriodeSettings();
  }, [router]);

  const loadPMPeriodeSettings = async () => {
    try {
      const response = await api.get('/pm-settings/');
      setPeriodeList(response.data.periode_list);
    } catch (error) {
      console.error('Error loading PM Periode settings:', error);
      toast.error('Gagal memuat pengaturan PM Periode');
    } finally {
      setLoading(false);
    }
  };

  const savePMPeriodeSettings = async () => {
    setSaving(true);
    try {
      await api.put('/pm-settings/', {
        periode_list: periodeList
      });
      toast.success('Pengaturan PM Periode berhasil disimpan');
    } catch (error) {
      console.error('Error saving PM Periode settings:', error);
      toast.error('Gagal menyimpan pengaturan PM Periode');
    } finally {
      setSaving(false);
    }
  };

  const addPeriode = () => {
    if (newPeriode.trim() && !periodeList.includes(newPeriode.trim())) {
      setPeriodeList([...periodeList, newPeriode.trim()]);
      setNewPeriode('');
    }
  };

  const removePeriode = (periode: string) => {
    if (periodeList.length > 1) {
      setPeriodeList(periodeList.filter(p => p !== periode));
    } else {
      toast.error('Minimal harus ada satu periode');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addPeriode();
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
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Pengaturan PM Periode</h1>
          <p className="text-gray-600 mt-3 text-lg">Kelola periode maintenance yang tersedia untuk form verifikasi</p>
        </div>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="flex items-center shadow-md hover:shadow-lg transition-all duration-300"
        >
          <AlertCircle className="mr-2 h-5 w-5" />
          Kembali
        </Button>
      </div>

      <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle className="flex items-center text-xl font-bold">
            <div className="p-2 bg-blue-100 rounded-xl mr-3">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            Daftar Periode Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="mb-10">
            <div className="flex items-end space-x-6">
              <div className="flex-1">
                <Label htmlFor="newPeriode" className="text-gray-800 font-semibold text-sm">
                  Tambah Periode Baru
                </Label>
                <Input
                  id="newPeriode"
                  value={newPeriode}
                  onChange={(e) => setNewPeriode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Masukkan nama periode (contoh: PM8)"
                  className="mt-2 h-12"
                />
              </div>
              <Button
                onClick={addPeriode}
                className="flex items-center h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-300 px-6 font-semibold"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Tambah
              </Button>
            </div>
          </div>

          <div className="mb-10">
            <Label className="text-gray-800 font-semibold text-sm mb-6 block">
              Periode yang Tersedia
            </Label>
            {periodeList.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                <div className="mx-auto h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center mb-4">
                  <Settings className="h-6 w-6 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">Belum ada periode yang ditambahkan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {periodeList.map((periode, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <span className="font-semibold text-gray-800">{periode}</span>
                    <Button
                      onClick={() => removePeriode(periode)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end">
            <Button
              onClick={savePMPeriodeSettings}
              disabled={saving}
              className="flex items-center bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300 px-8 py-3 font-semibold"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-3"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-3 h-5 w-5" />
                  Simpan Pengaturan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border-0 mt-10">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle className="flex items-center text-xl font-bold">
            <div className="p-2 bg-blue-100 rounded-xl mr-3">
              <AlertCircle className="h-6 w-6 text-blue-600" />
            </div>
            Informasi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="prose max-w-none space-y-4">
            <p className="text-gray-700 leading-relaxed">
              Pengaturan PM Periode memungkinkan administrator untuk menentukan periode maintenance yang tersedia 
              untuk form verifikasi. Periode yang ditambahkan di sini akan muncul sebagai pilihan radio button 
              pada form verifikasi yang diisi oleh engineer.
            </p>
            <p className="text-gray-700 leading-relaxed">
              <strong>Catatan:</strong> Perubahan pada pengaturan ini hanya akan mempengaruhi tampilan di frontend. 
              Backend akan tetap menerima dan menyimpan nilai apapun yang dikirimkan dari frontend dalam bentuk teks 
              tanpa validasi strict.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}