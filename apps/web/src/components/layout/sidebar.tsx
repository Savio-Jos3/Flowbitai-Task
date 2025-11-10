'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  FileText, 
  FolderOpen, 
  Building2, 
  Users, 
  Settings,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  {
    title: 'Dashboard',
    href: '/dashboard',
    icon: Home,
  },
  {
    title: 'Invoices',
    href: '/dashboard/invoice',
    icon: FileText,
  },
  {
    title: 'Other Files',
    href: '/dashboard/files',
    icon: FolderOpen,
  },
  {
    title: 'Departments',
    href: '/dashboard/departments',
    icon: Building2,
  },
  {
    title: 'Users',
    href: '/dashboard/users',
    icon: Users,
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
  {
    title: 'Chat with Data',
    href: '/dashboard/chat',
    icon: MessageSquare,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-white">
      <div className="flex h-full flex-col">
        {/* Logo Section */}
        <div className="border-b px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600">
              <span className="text-xl font-bold text-white">L</span>
            </div>
            <div>
              <h2 className="text-lg font-semibold">Buchhaltung</h2>
              <p className="text-xs text-gray-500">Invoice Analytics</p>
            </div>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="mb-2 px-3">
            <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              GENERAL
            </p>
          </div>
          
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-indigo-50 text-indigo-700'
                        : 'text-gray-700 hover:bg-gray-100'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Flowbit AI Branding */}
        <div className="border-t p-4">
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-gradient-to-br from-blue-600 to-indigo-600">
              <span className="text-sm font-bold text-white">F</span>
            </div>
            <span className="text-sm font-semibold">Flowbit AI</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
