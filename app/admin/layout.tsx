'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, ShoppingCart, FileText, CreditCard, Receipt, 
  Package, Printer, Truck, ClipboardList, Map, Users, Briefcase, 
  BarChart, Settings, ArrowLeft 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const ADMIN_NAV = [
  { name: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Quotations', href: '/admin/quotations', icon: FileText },
  { name: 'Payments', href: '/admin/payments', icon: CreditCard },
  { name: 'Invoices', href: '/admin/invoices', icon: Receipt },
  { name: 'Shipments', href: '/admin/shipments', icon: Package },
  { name: 'Airway Bills', href: '/admin/airway-bills', icon: Printer },
  { name: 'Pickup Operations', href: '/admin/pickup', icon: Truck },
  { name: 'Manifests', href: '/admin/manifests', icon: ClipboardList },
  { name: 'Tracking', href: '/admin/tracking', icon: Map },
  { name: 'Customers (CRM)', href: '/admin/customers', icon: Users },
  { name: 'B2B Credit Accounts', href: '/admin/b2b-accounts', icon: Briefcase },
  { name: 'Reports', href: '/admin/reports', icon: BarChart },
  { name: 'Settings', href: '/admin/settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] overflow-hidden">
      {/* Mobile Toggle */}
      <button 
        className="md:hidden fixed top-4 left-4 z-[60] p-2 bg-slate-900 text-white rounded-lg shadow-lg"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-[40] md:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-[50] w-64 bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 md:static",
        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-6 font-medium">
            <ArrowLeft size={16} />
            Back to Website
          </Link>
          <div className="flex items-center">
            <Image 
              src="https://send.goorita.com/logo-white.png"
              alt="Goorita" 
              width={140} 
              height={36} 
              className="h-8 w-auto object-contain"
              priority
            />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
          {ADMIN_NAV.map((item) => {
            const isActive = pathname === item.href;
            const isClickable = item.href !== '#';
            return (
              <Link 
                key={item.name} 
                href={item.href}
                onClick={() => isClickable && setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : isClickable 
                      ? "hover:bg-white/5 hover:text-white" 
                      : "opacity-50 cursor-not-allowed"
                )}
              >
                <item.icon size={18} className={cn(
                  "transition-colors", 
                  isActive ? "text-primary" : isClickable ? "text-slate-500 group-hover:text-slate-300" : "text-slate-600"
                )} />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-white/5 border border-white/10">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center font-bold text-xs text-white">
              A
            </div>
            <div>
              <p className="text-sm font-bold text-white leading-none">Admin User</p>
              <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-wider">Operations Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden pt-16 md:pt-0">
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="max-w-7xl mx-auto space-y-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
