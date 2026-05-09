'use client';

import Image from 'next/image';
import { Bell, HelpCircle, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';
import { useRouter } from 'next/navigation';

export function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-16 bg-[#F44D4C] text-white flex items-center justify-between px-6 shadow-[0_2px_10px_rgba(0,0,0,0.1)] z-30 sticky top-0">
      <div className="flex items-center gap-10">
        <Link href="/" className="flex-shrink-0 transition-opacity hover:opacity-90">
          <Image 
            src="https://send.goorita.com/logo-white.png" 
            alt="Goorita Send" 
            width={130} 
            height={32} 
            className="h-8 w-auto object-contain"
            priority
          />
        </Link>
      </div>

      <div className="flex items-center gap-6">
        <div className="bg-white px-4 py-1.5 rounded-full flex items-center gap-2 shadow-sm">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Wallet Balance</span>
          <span className="text-primary font-extrabold text-[14px]">Rp {user ? '12,450,000' : '0'}</span>
        </div>

        <div className="flex items-center gap-3 border-l border-white/20 pl-6">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-white rounded-full ring-2 ring-primary"></span>
          </button>
          
          <div className="flex items-center gap-3 ml-2 group relative">
            <div className="text-right hidden sm:block">
              <p className="text-[12px] font-bold leading-none">{user?.name || 'Guest'}</p>
              <p className="text-[10px] text-white/70 mt-1 font-medium italic">Premium Member</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-white text-primary flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-white/30 cursor-pointer">
              {user ? getInitials(user.name) : '??'}
            </div>

            {/* Simple Dropdown for Logout */}
            <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left text-slate-600 hover:bg-slate-50 flex items-center gap-3 font-bold text-xs uppercase tracking-widest"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
