'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/summary', label: 'Summary' },
  { href: '/register', label: 'Register' },
  { href: '/update', label: 'Update' },
  { href: '/delete', label: 'Delete' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { logout } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex flex-wrap items-center justify-between">
        <Link href="/" className="text-xl font-bold">
          Supermarket Task
        </Link>
        <div className="flex flex-wrap items-center gap-4">
          <ul className="flex flex-wrap gap-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`px-3 py-2 rounded-md transition-colors ${
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
          <button
            onClick={logout}
            className="px-3 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
