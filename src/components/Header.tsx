'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { Menu, User, LogOut, UserCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import useSessionTimeout from '@/hooks/useSessionTimeout';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  userRole: string | null;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isDesktop: boolean;
}

export default function Header({
  sidebarOpen,
  setSidebarOpen,
  userRole,
  isCollapsed,
  setIsCollapsed,
  isDesktop,
}: HeaderProps) {
  const router = useRouter();
  const { handleLogout: sessionLogout } = useSessionTimeout();

  const handleLogout = () => {
    // Handle session logout with manual flag
    sessionLogout(true);
  };

  // Get user role display name
  const getUserRoleName = () => {
    switch (userRole) {
      case 'ENGINEER': return 'Engineer';
      case 'VERIFIKATOR': return 'Verifikator';
      case 'ADMIN': return 'Administrator';
      default: return 'User';
    }
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-100">
      <div className="flex items-center justify-between h-16 px-6">
        <div className="flex items-center">
          {/* Tombol menu mobile */}
          <button
            className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 transition-all duration-200 lg:hidden"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label="Toggle sidebar"
            aria-expanded={sidebarOpen}
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Tombol collapse desktop */}
          {isDesktop && (
            <button
              className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-2 transition-all duration-200"
              onClick={() => setIsCollapsed(!isCollapsed)}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            </button>
          )}
        </div>

        {/* Judul halaman */}
        <div className="flex-1 flex justify-center lg:justify-start">
          <h1 className="text-lg font-bold text-gray-900 truncate ml-4">
            {userRole === 'ENGINEER' && 'Dashboard Engineer'}
            {userRole === 'VERIFIKATOR' && 'Dashboard Verifikator'}
            {userRole === 'ADMIN' && 'Dashboard Administrator'}
          </h1>
        </div>

        {/* Dropdown user menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="flex items-center text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 hover:scale-105"
              aria-label="User menu"
              aria-haspopup="true"
            >
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-lg">
                {getUserRoleName().charAt(0)}
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64">
            <DropdownMenuLabel>
              <div className="py-2">
                <p className="text-sm font-semibold text-gray-900 truncate">{getUserRoleName()}</p>
                <p className="text-xs text-green-600 font-medium">● Online</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link
                href={userRole === 'VERIFIKATOR' ? '/verificator/profile' : '#'}
                className="flex items-center"
                onClick={(e) => {
                  if (userRole !== 'VERIFIKATOR') {
                    e.preventDefault();
                  }
                }}
              >
                <UserCircle className="mr-3 h-5 w-5 text-gray-500" />
                Profil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-3 h-5 w-5 text-gray-500" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
