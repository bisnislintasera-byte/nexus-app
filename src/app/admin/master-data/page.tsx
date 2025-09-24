'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { MasterData } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BackButton } from '@/components/ui/BackButton';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Database, 
  PlusCircle, 
  Trash2,
  MapPin,
  Building,
  HardDrive,
  Settings,
  Edit3
} from 'lucide-react';
import { StandardTable, ColumnDef } from '@/components/ui/standard-table';
import { StandardPagination } from '@/components/ui/standard-pagination';
import { StatusBadge, DataRow } from '@/components/ui/data-display';

interface MasterDataForm {
  TID: string;
  KANWIL: string;
  KC_SUPERVISI: string;
  LOKASI: string;
  PROJECT: string;
  PIC_AREA: string;
  NO_PC: string;
  SN_MINI_PC: string;
  latitude: string;
  longitude: string;
}

export default function MasterDataManagementPage() {
  const router = useRouter();
  const [masterData, setMasterData] = useState<MasterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingData, setEditingData] = useState<MasterData | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<MasterDataForm>();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    // Cek apakah user sudah login dan memiliki role ADMIN
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token || role !== 'ADMIN') {
      router.push('/auth/login');
      return;
    }

    // Load master data
    loadMasterData();
  }, [router]);

  const loadMasterData = async () => {
    try {
      const response = await api.get<MasterData[]>('/master-data/');
      setMasterData(response.data);
    } catch (error) {
      toast.error('Gagal memuat data master');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (data: MasterData) => {
    setEditingData(data);
    setShowCreateForm(true);
    
    // Set form values
    Object.keys(data).forEach(key => {
      if (key in data) {
        setValue(key as keyof MasterDataForm, data[key as keyof MasterData]);
      }
    });
  };

  const onSubmit = async (data: MasterDataForm) => {
    try {
      if (editingData) {
        // Update existing data
        await api.put(`/master-data/${data.TID}`, data);
        toast.success('Data master berhasil diperbarui');
      } else {
        // Create new data
        await api.post('/master-data/', data);
        toast.success('Data master berhasil dibuat');
      }
      reset();
      setShowCreateForm(false);
      setEditingData(null);
      loadMasterData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Gagal menyimpan data master');
    }
  };

  const handleDelete = async (tid: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data master ini?')) {
      return;
    }

    try {
      await api.delete(`/master-data/${tid}`);
      toast.success('Data master berhasil dihapus');
      loadMasterData();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Gagal menghapus data master');
    }
  };

  const totalPages = Math.ceil(masterData.length / pageSize);
  const paginatedData = masterData.slice((page - 1) * pageSize, page * pageSize);

  const masterDataColumns: ColumnDef<MasterData>[] = [
    {
      id: 'tid',
      header: 'TID',
      cell: (row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <HardDrive className="h-5 w-5 text-blue-600" />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">
              {row.TID}
            </p>
            <p className="text-sm text-gray-500">
              {row.LOKASI}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'kanwil',
      header: 'Kanwil',
      cell: (row) => row.KANWIL,
    },
    {
      id: 'supervisi',
      header: 'Supervisi',
      cell: (row) => row.KC_SUPERVISI,
    },
    {
      id: 'project',
      header: 'Project',
      cell: (row) => row.PROJECT,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(row)}
          >
            <Edit3 className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(row.TID)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Manajemen Data Master</h1>
          <p className="text-gray-600 mt-3 text-lg">Kelola data master untuk form verifikasi aset</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            {showCreateForm ? 'Batal' : 'Tambah Data'}
          </Button>
          <Button
            onClick={() => router.push('/admin/pm-periode')}
            variant="outline"
            className="flex items-center shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Settings className="mr-2 h-5 w-5" />
            Pengaturan PM
          </Button>
          <BackButton variant="outline" />
        </div>
      </div>

      {showCreateForm && (
        <Card className="bg-white shadow-xl rounded-2xl overflow-hidden mb-10 border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <CardTitle className="flex items-center text-xl font-bold">
              {editingData ? (
                <>
                  <div className="p-2 bg-blue-100 rounded-xl mr-3">
                    <Edit3 className="h-6 w-6 text-blue-600" />
                  </div>
                  Edit Data Master
                </>
              ) : (
                <>
                  <div className="p-2 bg-blue-100 rounded-xl mr-3">
                    <PlusCircle className="h-6 w-6 text-blue-600" />
                  </div>
                  Tambah Data Master Baru
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="TID" className="text-gray-800 font-semibold text-sm">
                    Terminal ID (TID) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="TID"
                    type="text"
                    {...register('TID', { required: 'TID wajib diisi' })}
                    className="w-full h-12"
                    disabled={!!editingData} // Disable TID when editing
                  />
                  {errors.TID && (
                    <p className="text-sm text-red-600 font-medium">{errors.TID.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="KANWIL" className="text-gray-800 font-semibold text-sm">
                    Kanwil <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="KANWIL"
                    type="text"
                    {...register('KANWIL', { required: 'Kanwil wajib diisi' })}
                    className="w-full h-12"
                  />
                  {errors.KANWIL && (
                    <p className="text-sm text-red-600 font-medium">{errors.KANWIL.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="KC_SUPERVISI" className="text-gray-700 font-medium">
                    KC Supervisi <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="KC_SUPERVISI"
                    type="text"
                    {...register('KC_SUPERVISI', { required: 'KC Supervisi wajib diisi' })}
                    className="w-full"
                  />
                  {errors.KC_SUPERVISI && (
                    <p className="text-sm text-red-600">{errors.KC_SUPERVISI.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="LOKASI" className="text-gray-700 font-medium">
                    Lokasi <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="LOKASI"
                    type="text"
                    {...register('LOKASI', { required: 'Lokasi wajib diisi' })}
                    className="w-full"
                  />
                  {errors.LOKASI && (
                    <p className="text-sm text-red-600">{errors.LOKASI.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="PROJECT" className="text-gray-700 font-medium">
                    Project <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="PROJECT"
                    type="text"
                    {...register('PROJECT', { required: 'Project wajib diisi' })}
                    className="w-full"
                  />
                  {errors.PROJECT && (
                    <p className="text-sm text-red-600">{errors.PROJECT.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="PIC_AREA" className="text-gray-700 font-medium">
                    PIC Area <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="PIC_AREA"
                    type="text"
                    {...register('PIC_AREA', { required: 'PIC Area wajib diisi' })}
                    className="w-full"
                  />
                  {errors.PIC_AREA && (
                    <p className="text-sm text-red-600">{errors.PIC_AREA.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="NO_PC" className="text-gray-700 font-medium">
                    No PC <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="NO_PC"
                    type="text"
                    {...register('NO_PC', { required: 'No PC wajib diisi' })}
                    className="w-full"
                  />
                  {errors.NO_PC && (
                    <p className="text-sm text-red-600">{errors.NO_PC.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="SN_MINI_PC" className="text-gray-700 font-medium">
                    SN Mini PC <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="SN_MINI_PC"
                    type="text"
                    {...register('SN_MINI_PC', { required: 'SN Mini PC wajib diisi' })}
                    className="w-full"
                  />
                  {errors.SN_MINI_PC && (
                    <p className="text-sm text-red-600">{errors.SN_MINI_PC.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="latitude" className="text-gray-700 font-medium">
                    Latitude <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="latitude"
                    type="text"
                    placeholder="-6.123456"
                    {...register('latitude', { 
                      required: 'Latitude wajib diisi',
                      pattern: {
                        value: /^-?\d*\.?\d*$/,
                        message: 'Format latitude tidak valid'
                      }
                    })}
                    className="w-full"
                  />
                  {errors.latitude && (
                    <p className="text-sm text-red-600">{errors.latitude.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="longitude" className="text-gray-700 font-medium">
                    Longitude <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="longitude"
                    type="text"
                    placeholder="106.789012"
                    {...register('longitude', { 
                      required: 'Longitude wajib diisi',
                      pattern: {
                        value: /^-?\d*\.?\d*$/,
                        message: 'Format longitude tidak valid'
                      }
                    })}
                    className="w-full"
                  />
                  {errors.longitude && (
                    <p className="text-sm text-red-600">{errors.longitude.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowCreateForm(false);
                    setEditingData(null);
                    reset();
                  }}
                  className="px-6 py-3 font-semibold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {editingData ? 'Update Data' : 'Simpan Data'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle className="flex items-center text-xl font-bold">
            <div className="p-2 bg-blue-100 rounded-xl mr-3">
              <Database className="h-6 w-6 text-blue-600" />
            </div>
            Daftar Data Master
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <StandardTable 
            columns={masterDataColumns} 
            data={paginatedData} 
            emptyState={{
              title: "Tidak ada data master",
              description: "Belum ada data master yang terdaftar.",
              icon: <Database className="h-12 w-12 text-gray-400" />
            }}
          />
          <div className="p-6 border-t border-gray-100">
            <StandardPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
              onPageSizeChange={setPageSize}
              pageSize={pageSize}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}