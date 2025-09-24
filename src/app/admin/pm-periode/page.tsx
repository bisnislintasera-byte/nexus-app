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
          <h1 className="text-3xl font-bold text-gray-900">Pengaturan PM Periode</h1>
          <p className="text-gray-600 mt-2">Kelola periode maintenance yang tersedia untuk form verifikasi</p>
        </div>
        <Button
          onClick={() => router.back()}
          variant="outline"
          className="flex items-center"
        >
          <AlertCircle className="mr-2 h-4 w-4" />
          Kembali
        </Button>
      </div>

      <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center text-xl">
            <Settings className="mr-2 h-5 w-5 text-blue-600" />
            Daftar Periode Maintenance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="mb-8">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <Label htmlFor="newPeriode" className="text-gray-700 font-medium">
                  Tambah Periode Baru
                </Label>
                <Input
                  id="newPeriode"
                  value={newPeriode}
                  onChange={(e) => setNewPeriode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Masukkan nama periode (contoh: PM8)"
                  className="mt-1"
                />
              </div>
              <Button
                onClick={addPeriode}
                className="flex items-center h-full"
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Tambah
              </Button>
            </div>
          </div>

          <div className="mb-8">
            <Label className="text-gray-700 font-medium mb-4 block">
              Periode yang Tersedia
            </Label>
            {periodeList.length === 0 ? (
              <div className="text-center py-8 bg-gray-50 rounded-lg">
                <p className="text-gray-500">Belum ada periode yang ditambahkan</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {periodeList.map((periode, index) => (
                  <div 
                    key={index} 
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <span className="font-medium text-gray-700">{periode}</span>
                    <Button
                      onClick={() => removePeriode(periode)}
                      variant="destructive"
                      size="sm"
                      className="flex items-center"
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
              className="flex items-center bg-green-600 hover:bg-green-700"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Simpan Pengaturan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-lg rounded-xl overflow-hidden mt-8">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <CardTitle className="flex items-center text-xl">
            <AlertCircle className="mr-2 h-5 w-5 text-blue-600" />
            Informasi
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="prose max-w-none">
            <p className="text-gray-700">
              Pengaturan PM Periode memungkinkan administrator untuk menentukan periode maintenance yang tersedia 
              untuk form verifikasi. Periode yang ditambahkan di sini akan muncul sebagai pilihan radio button 
              pada form verifikasi yang diisi oleh engineer.
            </p>
            <p className="text-gray-700 mt-4">
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