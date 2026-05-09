'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, User as UserIcon, LogOut, FileText, Wallet, LayoutDashboard } from 'lucide-react';
import * as motion from 'motion/react-client';
import { useAuth } from '../auth/AuthContext';
import { useRouter, usePathname } from 'next/navigation';

export function LandingNavbar() {
  const pathname = usePathname();
  const isHomePage = pathname === '/';
  const [isScrolled, setIsScrolled] = useState(!isHomePage);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { openAuthModal, user, isLoggedIn, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isHomePage) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsScrolled(true);
      return;
    }
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    // Initial check
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleLogin = (e: React.MouseEvent) => {
    e.preventDefault();
    openAuthModal(() => {
      router.push('/dashboard');
    });
    setIsMenuOpen(false);
  };

  const handleGetStarted = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push('/booking');
    setIsMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
    setIsMenuOpen(false);
    router.push('/');
  };

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/50 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex-shrink-0">
          <Image 
            src="https://send.goorita.com/logo-white.png"
            alt="Goorita Send" 
            width={140} 
            height={36} 
            className={`h-8 w-auto object-contain transition-all duration-300 ${isScrolled ? 'brightness-0' : ''}`}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-10">
        </nav>

        <div className="hidden md:flex items-center gap-6 relative">
          {!isLoggedIn ? (
            <>
              <button onClick={handleLogin} className={`text-sm font-bold tracking-wide transition-colors ${isScrolled ? 'text-slate-700 hover:text-[#F44D4C]' : 'text-white hover:text-[#F44D4C]'}`}>Login</button>
              <button 
                onClick={handleGetStarted}
                className="bg-[#F44D4C] text-white px-6 py-2.5 rounded-xl font-bold text-sm tracking-wide hover:bg-[#D93C3B] hover:shadow-[0_0_20px_rgba(244,77,76,0.3)] transition-all active:scale-95"
              >
                Get Started
              </button>
            </>
          ) : (
            <div className="relative">
              <button 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`flex items-center gap-3 hover:opacity-80 transition-opacity ${isScrolled ? 'text-slate-800' : 'text-white'}`}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center overflow-hidden">
                  <span className="text-sm font-black text-primary uppercase">
                    {user?.name?.charAt(0) || <UserIcon size={18} />}
                  </span>
                </div>
                <div className="text-left hidden lg:block">
                  <p className="text-sm font-bold leading-none">{user?.name}</p>
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mt-1">{user?.email}</p>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full right-0 mt-4 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden py-2 z-50">
                  <div className="px-4 py-3 border-b border-slate-50 lg:hidden">
                    <p className="text-sm font-bold text-slate-800">{user?.name}</p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <Link href="/dashboard" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors">
                    <LayoutDashboard size={18} /> Dashboard
                  </Link>
                  <Link href="/shipment/history" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors">
                    <FileText size={18} /> My Shipments
                  </Link>
                  <Link href="/wallet" onClick={() => setIsDropdownOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-slate-600 hover:text-primary hover:bg-slate-50 transition-colors">
                    <Wallet size={18} /> Wallet
                  </Link>
                  <div className="h-px w-full bg-slate-50 my-2"></div>
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-rose-500 hover:bg-rose-50 transition-colors">
                    <LogOut size={18} /> Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X className="text-slate-800" /> : <Menu className={isScrolled ? 'text-slate-800' : 'text-white'} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-white/95 backdrop-blur-xl absolute top-full left-0 right-0 p-6 shadow-2xl flex flex-col gap-6 rounded-b-2xl border-t border-slate-100"
        >
          {isLoggedIn && (
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-xl">
              <div className="w-12 h-12 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center">
                <span className="text-lg font-black text-primary uppercase">
                  {user?.name?.charAt(0) || <UserIcon size={20} />}
                </span>
              </div>
              <div>
                <p className="text-base font-bold text-slate-800">{user?.name}</p>
                <p className="text-xs font-semibold text-slate-500">{user?.email}</p>
              </div>
            </div>
          )}
          
          <div className="h-px w-full bg-slate-100"></div>
          
          {!isLoggedIn ? (
            <>
              <button onClick={handleLogin} className="text-left text-slate-700 font-bold text-lg hover:text-[#F44D4C]">Login</button>
              <button onClick={handleGetStarted} className="bg-[#F44D4C] text-white px-5 py-4 rounded-xl font-bold text-center text-lg shadow-lg shadow-[#F44D4C]/30">Get Started</button>
            </>
          ) : (
            <>
              <Link href="/dashboard" className="text-slate-700 font-bold text-lg hover:text-primary flex items-center gap-3">
                <LayoutDashboard size={20} /> Dashboard
              </Link>
              <Link href="/shipment/history" className="text-slate-700 font-bold text-lg hover:text-primary flex items-center gap-3">
                <FileText size={20} /> My Shipments
              </Link>
              <Link href="/wallet" className="text-slate-700 font-bold text-lg hover:text-primary flex items-center gap-3">
                <Wallet size={20} /> Wallet
              </Link>
              <button onClick={handleLogout} className="text-left text-rose-500 font-bold text-lg flex items-center gap-3">
                <LogOut size={20} /> Logout
              </button>
            </>
          )}
        </motion.div>
      )}
    </header>
  );
}
