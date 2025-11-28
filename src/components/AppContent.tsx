'use client';

import { usePathname } from 'next/navigation';
import Navigation from './Navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function AppContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();
  
  // Don't show navigation on login page
  const showNavigation = pathname !== '/login' && isAuthenticated;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <>
      {showNavigation && <Navigation />}
      <main className="container mx-auto p-4">
        {children}
      </main>
    </>
  );
}
