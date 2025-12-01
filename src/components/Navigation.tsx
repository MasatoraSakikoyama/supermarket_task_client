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
  const { logout } = useAuth();

  return (
    <aside className="bg-gray-800 text-white w-64 min-h-screen p-4 flex flex-col">
      <Link href="/home" className="text-xl font-bold mb-6">
        Supermarket Task
      </Link>
      <nav className="flex-1">
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
      </nav>
      <button
        onClick={logout}
        className="mt-4 px-3 py-2 bg-red-600 rounded-md text-white hover:bg-red-700 transition-colors w-full"
      >
        Logout
      </button>
    </aside>
  );
}
