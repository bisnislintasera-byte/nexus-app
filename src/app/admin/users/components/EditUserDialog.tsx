import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { User } from '@/types';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';

interface EditUserFormProps {
  user: User;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface UserUpdate {
  nama: string;
  role: 'ENGINEER' | 'VERIFIKATOR' | 'ADMIN';
}

export function EditUserDialog({ user, open, onClose, onSuccess }: EditUserFormProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<UserUpdate>({
    defaultValues: {
      nama: user.nama,
      role: user.role as 'ENGINEER' | 'VERIFIKATOR' | 'ADMIN'
    }
  });

  const onSubmit = async (data: UserUpdate) => {
    try {
      setLoading(true);
      await api.put(`/users/${user.user_id}`, data);
      toast.success('User berhasil diperbarui');
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Gagal memperbarui user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit User: {user.nama}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="nama">Nama</Label>
            <Input
              id="nama"
              {...register('nama', { required: 'Nama wajib diisi' })}
            />
            {errors.nama && (
              <p className="text-sm text-red-500">{errors.nama.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <select
              id="role"
              {...register('role', { required: 'Role wajib dipilih' })}
              className="w-full p-2 border rounded"
            >
              <option value="ENGINEER">Engineer</option>
              <option value="VERIFIKATOR">Verifikator</option>
              <option value="ADMIN">Administrator</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}