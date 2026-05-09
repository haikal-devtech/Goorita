'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ArrowRight, Zap, Truck, Shield, MapPin, CheckCircle2, Globe2, Star, TrendingUp, FileText, X
} from 'lucide-react';
import { HeroAIChat } from '@/components/shipment/HeroAIChat';
import { PricingSection } from '@/components/landing/PricingSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import * as motion from 'motion/react-client';
import { useScroll, useTransform, AnimatePresence } from 'motion/react';

const PROMO_CONFIG = {
  title: "Special Rates for New Customers",
  description: "Get 10% off your first shipment. Limited time only.",
  cta: "Get Started",
  active: true
};

export default function LandingPage() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const heroVideoY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);
  const heroContentY = useTransform(scrollYProgress, [0, 0.2], [0, -50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  const [showPromo, setShowPromo] = useState(false);

  useEffect(() => {
    if (PROMO_CONFIG.active) {
      const timer = setTimeout(() => {
        setShowPromo(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  const dismissPromo = () => {
    setShowPromo(false);
  };

  const stats = [
    { label: 'Orders Delivered', value: '500K+' },
    { label: 'Countries Served', value: '50+' },
    { label: 'Indonesian Cities', value: '1000+' },
    { label: 'User Satisfaction', value: '99%' },
  ];

  return (
    <div ref={containerRef} className="relative bg-[#fafafa] selection:bg-primary/20 selection:text-primary-900 scroll-smooth overflow-hidden">
      
      {/* GLOBAL NOISE TEXTURE */}
      <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      {/* 1. HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 pb-32 overflow-hidden">
        {/* Parallax Video Background */}
        <motion.div 
          style={{ y: heroVideoY, opacity: heroOpacity }}
          className="absolute inset-0 z-0"
        >
          <video 
            autoPlay 
            muted 
            loop 
            playsInline 
            className="w-full h-full object-cover scale-110"
          >
            <source src="https://www.pexels.com/download/video/26893760/" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/60 via-slate-900/40 to-[#fafafa]"></div>
        </motion.div>

        {/* Floating Elements (Framer style) */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden max-w-7xl mx-auto hidden lg:block">
          <motion.div 
            animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[25%] left-[5%] bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl z-20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <TrendingUp size={20} className="text-primary" />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Growth</p>
                <p className="text-sm font-black text-white">+124% Export</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute top-[40%] right-[5%] bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl z-20"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-400/20 flex items-center justify-center">
                <Shield size={20} className="text-green-400" />
              </div>
              <div className="leading-tight">
                <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">Security</p>
                <p className="text-sm font-black text-white">Full Insurance</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div 
          style={{ y: heroContentY }}
          className="max-w-7xl mx-auto px-6 relative z-10 w-full text-center"
        >
          <div className="space-y-8 mb-16">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-2 rounded-full text-white text-[11px] font-black uppercase tracking-[0.2em]"
            >
              Trusted by 500,000+ Businesses
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-tight tracking-[-0.04em]"
            >
              Ship <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">Anywhere</span> <br />
              <span className="italic relative">
                Globally.
                <motion.span 
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 1, duration: 1 }}
                  className="absolute bottom-4 left-0 h-2 bg-primary/40 -z-10"
                />
              </span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-white/80 font-medium max-w-2xl mx-auto text-lg md:text-xl leading-relaxed"
            >
              The most reliable international logistics platform for Indonesia. 
              Get instant quotes, real-time tracking, and doorstep pickup.
            </motion.p>
          </div>

          {/* AI-POWERED CHAT ENTRY */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl mx-auto w-full"
          >
            <HeroAIChat />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. STATS SECTION (Clean & Striking) */}
      <section className="bg-white border-y border-slate-100 relative z-20">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-24">
            {stats.map((s, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center md:text-left"
              >
                <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none mb-3">{s.value}</h3>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. CORE VALUES SECTION: LIFTED CARDS */}
      <section className="py-40 relative overflow-hidden bg-white">
        <div className="absolute top-0 right-0 w-[60%] h-full bg-gradient-to-bl from-primary/5 to-transparent -z-0"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl mb-24 transition-all">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]"
            >
              Shipping is complex. <br/>
              <span className="text-primary">We make it invisible.</span>
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Affordable Rates', desc: 'Direct carrier API integration ensures you get the real rates, with zero markups or surprises.', icon: Zap },
              { title: 'Global Compliance', desc: 'Customs paperwork is stressful. Our automated system handles the validation for 200+ countries.', icon: Shield },
              { title: 'Smart Visibility', desc: 'From Jakarta street to London doorstep, track every kilometer with advanced telemetry.', icon: Truck },
              { title: 'Instant Scalability', desc: 'One box or a full container. Our platform adapts to your business volume instantly.', icon: Globe2 },
              { title: 'Premium Support', desc: 'Real humans monitoring your shipments 24/7. Excellence isn\'t automated.', icon: Star },
              { title: 'Digital Documentation', desc: 'Stop printing. Our smart dashboard digitizes your entire logistics paper trail.', icon: FileText },
            ].map((v, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group p-10 rounded-[32px] bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-500 ease-out"
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8 group-hover:bg-primary transition-colors duration-500">
                  <v.icon size={28} className="text-primary group-hover:text-white transition-colors duration-500" />
                </div>
                <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{v.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.4 HOW IT WORKS SECTION */}
      <HowItWorksSection />

      {/* 3.5 PRICING SECTION */}
      <PricingSection />

      {/* 4. HIGHLIGHT SECTION (Bento Grid Style) */}
      <section className="py-32 bg-[#FFE882] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_30%,#F44D4C_0%,transparent_50%)]"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight">
              Designed for the <span className="italic">Exporter.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto lg:h-[700px]">
             <motion.div 
              whileHover={{ scale: 0.99 }}
              className="md:col-span-8 relative rounded-[40px] overflow-hidden shadow-2xl group cursor-pointer"
             >
                <Image 
                  src="https://images.unsplash.com/photo-1578575437130-527eed3abbec?q=80&w=2070&auto=format&fit=crop" 
                  alt="Warehouse" 
                  fill 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-12 w-full">
                  <div className="bg-primary/20 backdrop-blur-md border border-white/20 inline-flex px-4 py-2 rounded-full text-white text-[10px] font-black uppercase tracking-[0.2em] mb-6">Operations</div>
                  <h3 className="text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">Master your supply chain <br/> with surgical precision.</h3>
                </div>
             </motion.div>

             {/* Small Items Column */}
             <div className="md:col-span-4 grid grid-rows-2 gap-6">
                <motion.div 
                  whileHover={{ scale: 0.98 }}
                  className="relative rounded-[40px] overflow-hidden shadow-2xl group cursor-pointer"
                >
                  <Image src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1470&auto=format&fit=crop" fill alt="Trust" className="object-cover" referrerPolicy="no-referrer"/>
                  <div className="absolute inset-0 bg-primary/60 mix-blend-multiply opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent">
                    <h4 className="text-white font-black text-2xl uppercase tracking-tight">Zero Errors</h4>
                  </div>
                </motion.div>

                <motion.div 
                  whileHover={{ scale: 0.98 }}
                  className="relative rounded-[40px] overflow-hidden shadow-2xl group cursor-pointer"
                >
                  <Image src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1470&auto=format&fit=crop" fill alt="Scale" className="object-cover" referrerPolicy="no-referrer"/>
                  <div className="absolute inset-0 p-10 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent">
                    <h4 className="text-white font-black text-2xl uppercase tracking-tight">10K+ Carriers</h4>
                  </div>
                </motion.div>
             </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS: REFINED LAYERED CARDS */}
      <section className="py-40 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end gap-10 mb-24">
            <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              The choice of <br/><span className="text-primary">Industry Leaders.</span>
            </h2>
            <div className="max-w-xs text-slate-400 font-bold uppercase text-[11px] tracking-[0.2em]">
              Real testimonials from Indonesian businesses expanding globally every single day.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[
              { 
                text: "The transition to Goorita Send reduced our delivery time to the US by 40%. The API integration was seamless and transparent.", 
                author: "Sarah Jenita", 
                role: "Director of Batik Global",
                img: "https://i.pravatar.cc/150?u=1" 
              },
              { 
                text: "Documentation used to be our biggest bottleneck. Goorita Send solved it overnight. Absolutely essential for modern exporters.", 
                author: "Budi Santoso", 
                role: "Founder, Kopi Nusantara",
                img: "https://i.pravatar.cc/150?u=2" 
              },
              { 
                text: "The instant pricing tool changed how we quote our international clients. It's accurate, fast, and builds trust immediately.", 
                author: "Liza W.", 
                role: "CEO, IndoCraft Jewelry",
                img: "https://i.pravatar.cc/150?u=3" 
              },
            ].map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-slate-50 border border-slate-100 p-10 rounded-[40px] relative overflow-hidden group shadow-sm hover:shadow-xl transition-all duration-500"
              >
                <div className="absolute top-10 right-10 text-slate-100 group-hover:text-primary/10 transition-colors">
                  <Star size={60} fill="currentColor" stroke="none" />
                </div>
                <div className="relative z-10">
                  <p className="text-lg font-bold text-slate-800 leading-relaxed mb-10 italic">&quot;{t.text}&quot;</p>
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                      <Image src={t.img} alt={t.author} fill className="object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div>
                      <h5 className="font-black text-slate-900 tracking-tight">{t.author}</h5>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{t.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FINAL CTA: MAGICAL GRADIENT */}
      <section className="py-40 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative bg-slate-950 rounded-[60px] p-16 md:p-32 overflow-hidden text-center"
          >
            {/* Animated Orbs */}
            <motion.div 
              animate={{ x: [-20, 20, -20], y: [-20, 20, -20] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -z-0"
            />
            <motion.div 
              animate={{ x: [20, -20, 20], y: [20, -20, 20] }}
              transition={{ duration: 12, repeat: Infinity }}
              className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-[100px] -z-0"
            />

            <div className="relative z-10 space-y-12">
              <h2 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-[0.9]">
                Expand your business <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-white to-primary animate-gradient-x">Globally.</span>
              </h2>
              <p className="text-white/60 font-medium text-lg md:text-2xl max-w-2xl mx-auto leading-relaxed">
                Join 10,000+ businesses shipping smarter today. 
                Your first international shipment starts here.
              </p>
              <div className="pt-8">
                <Link 
                  href="/shipment/create" 
                  className="group relative inline-flex items-center justify-center h-20 px-12 bg-primary text-white rounded-2xl font-black text-xl uppercase tracking-widest shadow-[0_0_50px_rgba(244,77,76,0.3)] hover:shadow-[0_0_80px_rgba(244,77,76,0.5)] transition-all overflow-hidden"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out"></div>
                  <span className="relative z-10 flex items-center gap-4">Start Shipping Now <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" /></span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PROMO POPUP */}
      {typeof window !== 'undefined' && PROMO_CONFIG.active && (
        <AnimatePresence>
          {showPromo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="relative w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl border border-slate-100 overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-[#f44d4c]"></div>
                <button
                  onClick={dismissPromo}
                  className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X size={24} />
                </button>
                <div className="mt-4 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#f44d4c]/10 text-[#f44d4c] flex items-center justify-center mb-6">
                    <Zap size={24} className="fill-current" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                    {PROMO_CONFIG.title}
                  </h3>
                  <p className="text-slate-500 font-medium">
                    {PROMO_CONFIG.description}
                  </p>
                </div>
                <button
                  onClick={dismissPromo}
                  className="w-full py-4 bg-[#f44d4c] text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#d43d3c] transition-colors"
                >
                  {PROMO_CONFIG.cta}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}
