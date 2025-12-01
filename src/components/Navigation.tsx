'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from '@/contexts/SidebarContext';

const navItems = [
  { href: '/summary', label: 'Summary' },
  { href: '/register', label: 'Register' },
  { href: '/update', label: 'Update' },
  { href: '/delete', label: 'Delete' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { isOpen, close } = useSidebar();

  const handleLinkClick = () => {
    // Close sidebar on mobile when clicking a link
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      close();
    }
  };

  return (
    <nav
      className={`
        bg-gray-800 text-white flex flex-col
        fixed md:sticky top-0 h-screen z-30
        transition-transform duration-300 ease-in-out
        w-64 
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0 md:w-0 md:overflow-hidden'}
      `}
    >
      <div className={`p-4 flex flex-col h-full ${isOpen ? '' : 'md:hidden'}`}>
        <div className="mb-8">
          <Link href="/summary" className="text-xl font-bold block" onClick={handleLinkClick}>
            Supermarket Task
          </Link>
          {user && (
            <div className="text-sm text-gray-300 mt-1">
              Welcome {user.username}
            </div>
          )}
        </div>
        <ul className="flex flex-col gap-2">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                onClick={handleLinkClick}
                className={`block px-3 py-2 rounded-md transition-colors ${
                  pathname === item.href
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex-1"></div>
        <button
          onClick={logout}
          className="px-3 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 transition-colors"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
