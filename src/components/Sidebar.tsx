'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Users, 
  Database, 
  FileText, 
  CheckCircle, 
  Clock, 
  User, 
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";


interface MenuItem {
  name: string;
  href: string;
}

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  menuItems: MenuItem[];
  userRole: string | null;
  isCollapsed: boolean;
  isDesktop: boolean;
}

export default function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  menuItems,
  userRole,
  isCollapsed,
  isDesktop,
}: SidebarProps) {
  const pathname = usePathname();

  // Map menu items to icons
  const getMenuIcon = (name: string) => {
    switch (name) {
      case 'Dashboard': return <LayoutDashboard className="h-5 w-5" />;
      case 'Manajemen User': return <Users className="h-5 w-5" />;
      case 'Master Data': return <Database className="h-5 w-5" />;
      case 'Form Verifikasi': return <FileText className="h-5 w-5" />;
      case 'Form Saya': return <FileText className="h-5 w-5" />;
      case 'Form Pending': return <Clock className="h-5 w-5" />;
      case 'Form Ditolak': return <X className="h-5 w-5" />;
      case 'Form Disetujui': return <CheckCircle className="h-5 w-5" />;
      default: return <LayoutDashboard className="h-5 w-5" />;
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Sidebar header */}
      <div className={`flex items-center justify-between h-16 px-6 border-b border-gray-100 ${isCollapsed && 'px-3'}`}>
        {!isCollapsed && (
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <h1 className="text-lg font-bold text-gray-900 truncate">Nexus</h1>
          </div>
        )}
        {isCollapsed && (
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mx-auto">
            <span className="text-white font-bold text-sm">N</span>
          </div>
        )}
        <button 
          className="lg:hidden text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg p-1 transition-all duration-200"
          onClick={() => setSidebarOpen(false)}
          aria-label="Tutup sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar content */}
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="px-4">
          <div className="space-y-2">
            <TooltipProvider>
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                const linkContent = (
                  <>
                    {getMenuIcon(item.name)}
                    <span className={`ml-4 truncate font-medium ${isCollapsed && 'hidden'}`}>{item.name}</span>
                  </>
                );

                return (
                  <Tooltip key={item.name} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link
                        href={item.href}
                        className={`flex items-center px-4 py-3 text-sm rounded-xl transition-all duration-300 ${isCollapsed && 'justify-center'} ${
                          isActive
                            ? 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 font-semibold shadow-sm border border-blue-200/50'
                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                        onClick={() => setSidebarOpen(false)}
                        aria-current={isActive ? 'page' : undefined}
                      >
                        {linkContent}
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="flex items-center gap-4">
                        {item.name}
                      </TooltipContent>
                    )}
                  </Tooltip>
                );
              })}
            </TooltipProvider>
          </div>
        </nav>
      </div>

      {/* Sidebar footer */}
      <div className={`p-6 border-t border-gray-100 ${isCollapsed && 'p-3'}`}>
        <div className="flex items-center">
          <div className={`flex-shrink-0 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-2.5 ${isCollapsed && 'mx-auto'}`}>
            <User className="h-5 w-5 text-gray-700" />
          </div>
          {!isCollapsed && (
            <div className="ml-4 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {userRole === 'ENGINEER' && 'Engineer'}
                {userRole === 'VERIFIKATOR' && 'Verifikator'}
                {userRole === 'ADMIN' && 'Administrator'}
              </p>
              <div className="flex items-center mt-1">
                <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
                <p className="text-xs text-green-600 font-medium truncate">Online</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <Fragment>
      {/* Sidebar backdrop (mobile only) */}
      {sidebarOpen && !isDesktop && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 transition-opacity lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-50 bg-white shadow-lg transform transition-all duration-300 ease-in-out 
          ${isDesktop ? (isCollapsed ? 'w-20' : 'w-64') : (sidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full')}
        `}
        aria-label="Sidebar"
      >
        {sidebarContent}
      </div>
    </Fragment>
  );
}