'use client';

import { Sidebar } from '@/components/layout/sidebar';
import { Navbar } from '@/components/layout/navbar';
import { useAuth } from '@/components/auth/AuthContext';
import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Lock, LogIn } from 'lucide-react';

export default function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, openAuthModal } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Small delay to prevent flash
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) return null;

  if (!isLoggedIn) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-900 items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-slate-900 to-slate-900">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center"
        >
          <div className="w-20 h-20 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] flex items-center justify-center text-primary mx-auto mb-8 shadow-2xl">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-black text-white mb-4 uppercase tracking-[0.1em]">Authenticated Access Only</h1>
          <p className="text-slate-400 text-sm font-medium mb-10 leading-relaxed">
            This workspace is reserved for registered Goorita Send members. Please sign in to continue.
          </p>
          <button 
            onClick={() => {
              openAuthModal(() => {
                // Do nothing, the layout will automatically re-render when isLoggedIn becomes true
              });
            }}
            className="w-full h-14 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
          >
            <LogIn size={20} />
            Sign In Now
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-[100vw] overflow-x-hidden">
      <Navbar />
      <div className="flex flex-1 w-full overflow-x-hidden">
        <Sidebar className="hidden md:flex flex-col w-[220px] flex-shrink-0 overflow-hidden" />
        <main className="flex-1 min-w-0 flex flex-col min-h-[calc(100vh-64px)] bg-[#f8f9fa] overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
