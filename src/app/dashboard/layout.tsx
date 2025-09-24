'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import useSessionTimeout from '@/hooks/useSessionTimeout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { handleLogout } = useSessionTimeout();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Cek apakah user sudah login
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (!token) {
      toast.error('Anda harus login terlebih dahulu');
      router.push('/auth/login');
      return;
    }
    
    setUserRole(role);
  }, [router]);

  // Tentukan menu berdasarkan role user
  const getMenuItems = () => {
    switch (userRole) {
      case 'ENGINEER':
        return [
          { name: 'Dashboard', href: '/dashboard/engineer' },
          { name: 'Form Verifikasi', href: '/engineer/form' },
          { name: 'Form Saya', href: '/engineer/my-forms' },
        ];
      case 'VERIFIKATOR':
        return [
          { name: 'Dashboard', href: '/dashboard/verificator' },
          { name: 'Form Pending', href: '/verificator/pending-forms' },
        ];
      case 'ADMIN':
        return [
          { name: 'Dashboard', href: '/dashboard/admin' },
          { name: 'Manajemen User', href: '/admin/users' },
          { name: 'Master Data', href: '/admin/master-data' },
        ];
      default:
        return [];
    }
  };

  if (!userRole) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile by default */}
      <Sidebar 
        sidebarOpen={sidebarOpen} 
        setSidebarOpen={setSidebarOpen} 
        menuItems={getMenuItems()} 
        userRole={userRole}
        isCollapsed={isCollapsed}
        isDesktop={isDesktop}
      />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ${isDesktop && (isCollapsed ? 'lg:ml-20' : 'lg:ml-64')}`}>
        {/* Header */}
        <Header 
          sidebarOpen={sidebarOpen} 
          setSidebarOpen={setSidebarOpen} 
          userRole={userRole}
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
          isDesktop={isDesktop}
        />

        {/* Main content - responsive padding */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}