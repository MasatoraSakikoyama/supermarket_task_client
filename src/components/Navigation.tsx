'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const navItems = [
  { href: '/home', label: 'Home' },
  { href: '/summary', label: 'Summary' },
  { href: '/register', label: 'Register' },
  { href: '/update', label: 'Update' },
  { href: '/delete', label: 'Delete' },
];

export default function Navigation() {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <nav className="bg-gray-800 text-white p-4 w-64 min-h-screen flex flex-col">
      <div className="mb-8">
        <Link href="/home" className="text-xl font-bold block">
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
    </nav>
  );
}
