'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Send, History, MapPin, Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/auth/AuthContext';

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Create Shipment', href: '/shipment/create', icon: Send },
    { name: 'Tracking', href: '/tracking', icon: MapPin },
    { name: 'My Shipments', href: '/shipment/history', icon: History },
    { name: 'Wallet', href: '/wallet', icon: Wallet },
  ];

  const { user } = useAuth();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className={cn("bg-white border-r border-[#e2e8f0] pt-4 z-10 static flex flex-col min-h-fit", className)}>
      <nav className="flex-1 flex flex-col pt-2 pb-6">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-6 py-3.5 transition-colors text-[14px] font-semibold border-l-4",
                isActive 
                  ? "bg-primary-50 text-primary border-primary" 
                  : "text-slate-500 hover:bg-slate-50 border-transparent hover:text-slate-700"
              )}
            >
              <item.icon className={cn(
                "mr-3 flex-shrink-0 h-5 w-5 transition-colors",
                isActive ? "text-primary" : "text-slate-400 group-hover:text-slate-600"
              )} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto w-full p-4 border-t border-[#f0f0f0] bg-white">
        <Link href="/settings" className="flex items-center group w-full">
          <div className="h-9 w-9 flex-shrink-0 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs group-hover:bg-slate-200 transition-colors">
            {user ? getInitials(user.name) : '??'}
          </div>
          <div className="ml-3 overflow-hidden flex-1">
            <p className="text-[13px] font-bold text-slate-800 truncate">{user?.name || 'Guest'}</p>
            <p className="text-[11px] text-slate-500 font-medium truncate">Account Settings</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
