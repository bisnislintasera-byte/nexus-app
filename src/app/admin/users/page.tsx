'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { User } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { EditUserDialog } from './components/EditUserDialog';
import { 
  Users, 
  UserPlus, 
  UserCheck, 
  UserX,
  Shield,
  Wrench,
  Eye,
  Edit2
} from 'lucide-react';
import { StandardTable, ColumnDef } from '@/components/ui/standard-table';
import { StandardPagination } from '@/components/ui/standard-pagination';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { StatusBadge, DataRow } from '@/components/ui/data-display';

interface UserCreate {
  nama: string;
  user_id: string;
  username: string;
  password: string;
  role: 'ENGINEER' | 'VERIFIKATOR' | 'ADMIN';
}

export default function UsersManagementPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<UserCreate>();
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

    // Load users
    loadUsers();
  }, [router]);

  const loadUsers = async () => {
    try {
      const response = await api.get<User[]>('/users/');
      setUsers(response.data);
    } catch (error) {
      toast.error('Gagal memuat data pengguna');
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: UserCreate) => {
    try {
      await api.post('/users/', data);
      toast.success('Pengguna berhasil dibuat');
      reset();
      setShowCreateForm(false);
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Gagal membuat pengguna');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      toast.success('Pengguna berhasil dihapus');
      loadUsers();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Gagal menghapus pengguna');
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'ENGINEER':
        return <Wrench className="h-4 w-4 text-blue-600" />;
      case 'VERIFIKATOR':
        return <Eye className="h-4 w-4 text-green-600" />;
      case 'ADMIN':
        return <Shield className="h-4 w-4 text-purple-600" />;
      default:
        return <UserCheck className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'ENGINEER':
        return <StatusBadge status="ENGINEER" />;
      case 'VERIFIKATOR':
        return <StatusBadge status="VERIFIKATOR" />;
      case 'ADMIN':
        return <StatusBadge status="ADMIN" />;
      default:
        return <StatusBadge status="UNKNOWN" />;
    }
  };

  const paginatedUsers = useMemo(() => {
    const startIndex = (page - 1) * pageSize;
    return users.slice(startIndex, startIndex + pageSize);
  }, [users, page, pageSize]);

  const totalPages = Math.ceil(users.length / pageSize);

  const userColumns: ColumnDef<User>[] = [
    {
      id: 'user',
      header: 'User',
      cell: (row) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            {getRoleIcon(row.role)}
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-900">
              {row.nama}
            </p>
            <p className="text-sm text-gray-500">
              {row.username}
            </p>
          </div>
        </div>
      ),
    },
    {
      id: 'user_id',
      header: 'User ID',
      cell: (row) => row.user_id,
    },
    {
      id: 'role',
      header: 'Role',
      cell: (row) => getRoleBadge(row.role),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedUser(row)}
          >
            <Edit2 className="h-4 w-4 text-blue-600" />
          </Button>
          {row.role !== 'ADMIN' && (
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDelete(row.user_id)}
            >
              <UserX className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-36" />
          </div>
        </div>
        <Card className="bg-white shadow-lg rounded-xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
            <CardTitle className="flex items-center text-xl">
              <Skeleton className="h-6 w-6 mr-2" />
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <StandardTable columns={userColumns} data={[]} isLoading={true} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Manajemen Pengguna</h1>
          <p className="text-gray-600 mt-3 text-lg">Kelola pengguna sistem verifikasi aset</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => router.back()}
            variant="outline"
            className="flex items-center shadow-md hover:shadow-lg transition-all duration-300"
          >
            <UserX className="mr-2 h-5 w-5" />
            Kembali
          </Button>
          <Button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            {showCreateForm ? 'Batal' : 'Tambah Pengguna'}
          </Button>
        </div>
      </div>

      {showCreateForm && (
        <Card className="bg-white shadow-xl rounded-2xl overflow-hidden mb-10 border-0">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
            <CardTitle className="flex items-center text-xl font-bold">
              <div className="p-2 bg-blue-100 rounded-xl mr-3">
                <UserPlus className="h-6 w-6 text-blue-600" />
              </div>
              Tambah Pengguna Baru
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="nama" className="text-gray-800 font-semibold text-sm">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="nama"
                    type="text"
                    {...register('nama', { required: 'Nama wajib diisi' })}
                    className="w-full h-12"
                  />
                  {errors.nama && (
                    <p className="text-sm text-red-600 font-medium">{errors.nama.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="user_id" className="text-gray-700 font-medium">
                    User ID <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="user_id"
                    type="text"
                    {...register('user_id', { required: 'User ID wajib diisi' })}
                    className="w-full"
                  />
                  {errors.user_id && (
                    <p className="text-sm text-red-600">{errors.user_id.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username" className="text-gray-700 font-medium">
                    Username <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="username"
                    type="text"
                    {...register('username', { required: 'Username wajib diisi' })}
                    className="w-full"
                  />
                  {errors.username && (
                    <p className="text-sm text-red-600">{errors.username.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Password <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    {...register('password', { required: 'Password wajib diisi' })}
                    className="w-full"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-600">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="role" className="text-gray-800 font-semibold text-sm">
                    Role <span className="text-red-500">*</span>
                  </Label>
                  <select
                    id="role"
                    {...register('role', { required: 'Role wajib dipilih' })}
                    className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 hover:border-gray-400 bg-white"
                  >
                    <option value="">Pilih Role</option>
                    <option value="ENGINEER">Engineer</option>
                    <option value="VERIFIKATOR">Verifikator</option>
                    <option value="ADMIN">Administrator</option>
                  </select>
                  {errors.role && (
                    <p className="text-sm text-red-600 font-medium">{errors.role.message}</p>
                  )}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                  className="px-6 py-3 font-semibold"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white px-6 py-3 font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Simpan Pengguna
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {selectedUser && (
        <EditUserDialog
          user={selectedUser}
          open={selectedUser !== null}
          onClose={() => setSelectedUser(null)}
          onSuccess={loadUsers}
        />
      )}

      <Card className="bg-white shadow-xl rounded-2xl overflow-hidden border-0">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <CardTitle className="flex items-center text-xl font-bold">
            <div className="p-2 bg-blue-100 rounded-xl mr-3">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            Daftar Pengguna
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <StandardTable 
            columns={userColumns} 
            data={paginatedUsers} 
            emptyState={{
              title: "Tidak ada pengguna",
              description: "Belum ada pengguna yang terdaftar.",
              icon: <Users className="h-12 w-12 text-gray-400" />
            }}
            onRowClick={(row) => setSelectedUser(row)}
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