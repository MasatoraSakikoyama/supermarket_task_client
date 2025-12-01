'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { SidebarProvider, useSidebar } from '@/contexts/SidebarContext';

function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading, logout } = useAuth();
  const { isOpen, toggle, close } = useSidebar();
  
  // Don't show navigation on login page (root path)
  const showNavigation = pathname !== '/' && isAuthenticated;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (pathname === '/') {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile overlay */}
      {showNavigation && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={close}
        />
      )}
      
      {showNavigation && <Navigation />}
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with hamburger menu */}
        {showNavigation && (
          <header className="bg-white shadow-sm p-4 flex items-center gap-4 sticky top-0 z-10">
            <button
              onClick={toggle}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-800">
              Supermarket Task
            </h2>
            <div className="flex-1"></div>
            <button
              onClick={logout}
              className="px-3 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </header>
        )}
        
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AppContent({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppLayout>{children}</AppLayout>
    </SidebarProvider>
  );
}
