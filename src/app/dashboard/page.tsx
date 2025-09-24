'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();

  useEffect(() => {
    // Cek role user dari localStorage
    const role = localStorage.getItem('role');
    
    // Redirect ke dashboard sesuai role
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
        // Jika tidak ada role, redirect ke login
        router.push('/auth/login');
    }
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-4 text-gray-600">Mengarahkan ke dashboard...</p>
      </div>
    </div>
  );
}