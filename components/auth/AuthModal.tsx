'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Github, LogIn, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuth } from './AuthContext';
import Image from 'next/image';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  // Lock scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    // Simulate login
    login(email, email.split('@')[0]);
    onSuccess();
    onClose();
  };

  const handleGoogleLogin = () => {
    // Simulate Google Login
    login('user@google.com', 'Google User');
    onSuccess();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden relative"
          >
            {/* Header with Background Accent */}
            <div className="h-32 bg-primary relative overflow-hidden flex items-center justify-center">
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
              </div>
             
            </div>

            <button 
              onClick={onClose}
              className="absolute top-6 right-6 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-20"
            >
              <X size={20} />
            </button>

            <div className="p-8 -mt-10 bg-white rounded-t-[32px] relative z-10">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  {isRegistering ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-slate-500 text-sm font-medium mt-2">
                  Login to continue your shipment and secure your booking.
                </p>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={handleGoogleLogin}
                   className="w-full h-12 border border-slate-200 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-50 transition-all font-bold text-slate-700"
                >
                  <Image src="https://www.google.com/favicon.ico" alt="Google" width={20} height={20} className="w-5 h-5" />
                  Continue with Google
                </button>
                
                <div className="flex items-center gap-4 my-6">
                  <div className="h-px flex-1 bg-slate-100" />
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Or email</span>
                  <div className="h-px flex-1 bg-slate-100" />
                </div>

                <form onSubmit={handleAuth} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      placeholder="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full h-12 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                    />
                  </div>
                  <div className="relative">
                    <input 
                      type="password" 
                      placeholder="Password"
                      required
                      className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                    />
                  </div>
                  
                  <button 
                    type="submit"
                    className="w-full h-12 bg-primary text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <LogIn size={18} />
                    {isRegistering ? 'Register' : 'Login'}
                  </button>
                </form>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                <p className="text-slate-500 text-xs font-medium">
                  {isRegistering ? 'Already have an account?' : 'New to Goorita?'}
                  {' '}
                  <button 
                    onClick={() => setIsRegistering(!isRegistering)}
                    className="text-primary font-black uppercase tracking-widest hover:underline ml-1"
                  >
                    {isRegistering ? 'Login' : 'Create Account'}
                  </button>
                </p>
                <div className="flex items-center justify-center gap-2 mt-6 text-slate-300">
                  <ShieldCheck size={14} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Secured by Goorita Auth</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
