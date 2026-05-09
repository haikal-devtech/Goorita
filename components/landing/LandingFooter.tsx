'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

export function LandingFooter() {
  return (
    <footer className="bg-[#0A0F1A] text-white pt-24 pb-12 border-t border-white/5 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#F44D4C]/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="space-y-6">
          <Image 
            src="https://send.goorita.com/logo-white.png" 
            alt="Goorita Send" 
            width={160} 
            height={40} 
            className="h-10 w-auto object-contain"
          />
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            Goorita Send is Indonesia&apos;s leading logistics platform helping SMEs and diaspora ship globally with ease and affordability.
          </p>
          <div className="flex gap-3">
            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F44D4C] transition-colors">
              <Facebook size={18} className="text-slate-300" />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F44D4C] transition-colors">
              <Instagram size={18} className="text-slate-300" />
            </Link>
            <Link href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[#F44D4C] transition-colors">
              <Linkedin size={18} className="text-slate-300" />
            </Link>
          </div>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 text-white">Product</h4>
          <ul className="space-y-4 text-slate-400 text-sm font-medium">
            <li><Link href="/shipment/create" className="hover:text-[#F44D4C] transition-colors">Get a Quote</Link></li>
            <li><Link href="/tracking" className="hover:text-[#F44D4C] transition-colors">Track Shipment</Link></li>
            <li><Link href="#pricing" className="hover:text-[#F44D4C] transition-colors">Pricing Options</Link></li>
            <li><Link href="/dashboard" className="hover:text-[#F44D4C] transition-colors">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 text-white">Company</h4>
          <ul className="space-y-4 text-slate-400 text-sm font-medium">
            <li><Link href="#" className="hover:text-[#F44D4C] transition-colors">About Us</Link></li>
            <li><Link href="#" className="hover:text-[#F44D4C] transition-colors">Carrier Partners</Link></li>
            <li><Link href="#" className="hover:text-[#F44D4C] transition-colors">Privacy Policy</Link></li>
            <li><Link href="#" className="hover:text-[#F44D4C] transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-bold mb-6 text-white">Contact</h4>
          <ul className="space-y-4 text-slate-400 text-sm font-medium">
            <li className="flex items-start gap-4">
              <MapPin size={20} className="text-[#F44D4C] flex-shrink-0 mt-0.5" />
              <span>Jakarta Selatan, Indonesia</span>
            </li>
            <li className="flex items-center gap-4">
              <Phone size={20} className="text-[#F44D4C] flex-shrink-0" />
              <span>+62 21 1234 5678</span>
            </li>
            <li className="flex items-center gap-4">
              <Mail size={20} className="text-[#F44D4C] flex-shrink-0" />
              <span>support@goorita.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
        <p className="text-slate-500 font-medium text-sm">© {(new Date()).getFullYear()} Goorita Send. All rights reserved.</p>
        <div className="flex gap-6 text-sm font-medium text-slate-500">
          <Link href="/admin" className="hover:text-[#F44D4C] transition-colors flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span>
            Internal ERP
          </Link>
          <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
          <Link href="#" className="hover:text-white transition-colors">Terms</Link>
        </div>
      </div>
    </footer>
  );
}
