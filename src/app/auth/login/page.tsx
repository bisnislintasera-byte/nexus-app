'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import api from '@/lib/api';
import { LoginRequest, TokenResponse } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  Lock, 
  User, 
  Shield, 
  Loader2,
  Eye,
  EyeOff,
  Fingerprint,
  Info
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<LoginRequest>();

  const onSubmit = async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response = await api.post<TokenResponse>('/auth/login', new URLSearchParams({
        username: data.username,
        password: data.password,
      }), {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const { access_token, role, user_id } = response.data;

      localStorage.setItem('token', access_token);
      localStorage.setItem('role', role);
      localStorage.setItem('user_id', user_id);

      toast.success('Login berhasil!', {
        duration: 4000,
        position: 'top-center',
        style: {
          fontSize: '16px',
          padding: '16px',
          fontWeight: '500',
          maxWidth: '90vw',
        }
      });

      setTimeout(() => {
        switch (role) {
          case 'ENGINEER':
            router.push('/dashboard/engineer');
            break;
          case 'VERIFIKATOR':
            router.push('/dashboard/verificator');
            break;
          case 'ADMIN':
            router.push('/dashboard/admin');
            break;
          default:
            router.push('/dashboard/admin');
        }
      }, 1000);

    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || 'Login gagal. Silakan coba lagi.';
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-center',
        style: {
          fontSize: '16px',
          padding: '16px',
          fontWeight: '500',
          maxWidth: '90vw',
        }
      });
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl transform rotate-6 blur-md opacity-20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 rounded-2xl transform -rotate-6 blur-md opacity-20"></div>
              <div className="relative mx-auto h-20 w-20 flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="h-16 w-16 text-white" fill="currentColor">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  <circle cx="12" cy="12" r="3" className="text-blue-200"/>
                </svg>
              </div>
            </div>
          </div>
          <h1 className="mt-6 text-3xl font-bold text-white tracking-wider">
            NEXUS
          </h1>
          <p className="mt-2 text-sm text-white max-w-sm mx-auto uppercase tracking-wider">
            Connecting Worlds
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl border border-white/10 p-8 transition-all duration-300 hover:shadow-2xl">
          <div className="text-center mb-8">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-900/50">
              <Fingerprint className="h-6 w-6 text-white" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-white">
              Masuk ke Akun Anda
            </h2>
            <p className="mt-2 text-sm text-white">
              Masukkan kredensial Anda untuk melanjutkan
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="username" className="block text-sm font-medium text-white mb-1">
                  Username
                </Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <Input
                    id="username"
                    type="text"
                    {...register('username', { required: 'Username wajib diisi' })}
                    className="pl-10 py-3 text-base bg-blue-900/30 border-blue-700 focus:border-blue-400 focus:ring-blue-400 text-white placeholder-white transition-all duration-200"
                    placeholder="Masukkan username Anda"
                    disabled={isLoading}
                  />
                </div>
                {errors.username && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <span className="w-4 h-4 mr-1">•</span>
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <Label htmlFor="password" className="block text-sm font-medium text-white">
                    Password
                  </Label>
                  <button
                    type="button"
                    className="text-sm font-medium text-white hover:text-white/80 transition-colors"
                    onClick={() => toast('Hubungi administrator untuk reset password', {
                      icon: <Info className="w-4 h-4 text-white" />,
                    })}
                  >
                    Lupa password?
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-white" />
                  </div>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register('password', { required: 'Password wajib diisi' })}
                    className="pl-10 pr-10 py-3 text-base bg-blue-900/30 border-blue-700 focus:border-blue-400 focus:ring-blue-400 text-white placeholder-white transition-all duration-200"
                    placeholder="Masukkan password Anda"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-white hover:text-white transition-colors" />
                    ) : (
                      <Eye className="h-5 w-5 text-white hover:text-white transition-colors" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 text-sm text-red-500 flex items-center">
                    <span className="w-4 h-4 mr-1">•</span>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white py-3 rounded-xl shadow-lg flex items-center justify-center text-base font-medium transition-all duration-300 transform hover:-translate-y-0.5 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-5 w-5" />
                    Masuk ke Sistem
                  </>
                )}
              </Button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/30">
            <div className="text-center">
              <p className="text-xs text-white">
                © {new Date().getFullYear()} Nexus Enterprise. Hak Cipta Dilindungi.
              </p>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-white">
          <p>
            Memerlukan bantuan? Hubungi tim IT perusahaan Anda.
          </p>
        </div>
      </div>
    </div>
  );
}
