'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, ArrowRight, Star, Globe2 } from 'lucide-react';
import Link from 'next/link';

interface WeightTier {
  weight: string;
  price: number;
  time: string;
}

interface Destination {
  code: string;
  name: string;
  flag: string;
  region: string;
  tag: string;
  featured: boolean;
  basePrice: number;
  tiers: WeightTier[];
}

const DESTINATIONS: Destination[] = [
  {
    code: 'SGP',
    name: 'Singapore',
    flag: '🇸🇬',
    region: 'Asia',
    tag: 'Best Value',
    featured: true,
    basePrice: 55000,
    tiers: [
      { weight: '5 kg', price: 55000, time: '2-3 Days' },
      { weight: '10 kg', price: 52000, time: '2-3 Days' },
      { weight: '15 kg', price: 50000, time: '2-3 Days' },
      { weight: '20 kg', price: 48000, time: '2-3 Days' },
    ]
  },
  {
    code: 'USA',
    name: 'United States',
    flag: '🇺🇸',
    region: 'America',
    tag: 'Popular Route',
    featured: true,
    basePrice: 168000,
    tiers: [
      { weight: '5 kg', price: 168000, time: '4-6 Days' },
      { weight: '10 kg', price: 155000, time: '4-6 Days' },
      { weight: '15 kg', price: 150000, time: '4-6 Days' },
      { weight: '20 kg', price: 145000, time: '4-6 Days' },
    ]
  },
  {
    code: 'AUS',
    name: 'Australia',
    flag: '🇦🇺',
    region: 'Australia',
    tag: 'Best Value',
    featured: false,
    basePrice: 125000,
    tiers: [
      { weight: '5 kg', price: 125000, time: '3-5 Days' },
      { weight: '10 kg', price: 115000, time: '3-5 Days' },
      { weight: '15 kg', price: 110000, time: '3-5 Days' },
      { weight: '20 kg', price: 105000, time: '3-5 Days' },
    ]
  },
  {
    code: 'JPN',
    name: 'Japan',
    flag: '🇯🇵',
    region: 'Asia',
    tag: 'Fast Delivery',
    featured: false,
    basePrice: 145000,
    tiers: [
      { weight: '5 kg', price: 145000, time: '3-4 Days' },
      { weight: '10 kg', price: 135000, time: '3-4 Days' },
      { weight: '15 kg', price: 130000, time: '3-4 Days' },
      { weight: '20 kg', price: 125000, time: '3-4 Days' },
    ]
  },
  {
    code: 'NLD',
    name: 'Netherlands',
    flag: '🇳🇱',
    region: 'Europe',
    tag: '',
    featured: false,
    basePrice: 185000,
    tiers: [
      { weight: '5 kg', price: 185000, time: '5-7 Days' },
      { weight: '10 kg', price: 175000, time: '5-7 Days' },
      { weight: '15 kg', price: 168000, time: '5-7 Days' },
      { weight: '20 kg', price: 162000, time: '5-7 Days' },
    ]
  },
  {
    code: 'GBR',
    name: 'United Kingdom',
    flag: '🇬🇧',
    region: 'Europe',
    tag: '',
    featured: false,
    basePrice: 195000,
    tiers: [
      { weight: '5 kg', price: 195000, time: '4-6 Days' },
      { weight: '10 kg', price: 185000, time: '4-6 Days' },
      { weight: '15 kg', price: 180000, time: '4-6 Days' },
      { weight: '20 kg', price: 175000, time: '4-6 Days' },
    ]
  }
];

export function PricingSection() {
  const [search, setSearch] = useState('');
  const [regionFilter, setRegionFilter] = useState('All');
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [customerType, setCustomerType] = useState<'B2C' | 'B2B'>('B2C');

  const priceMultiplier = customerType === 'B2C' ? 1.2 : 1.0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price * priceMultiplier).replace('Rp', 'Rp ');
  };

  const regions = ['All', 'Asia', 'Europe', 'America', 'Australia'];

  const filteredDestinations = DESTINATIONS.filter(dest => {
    const matchesSearch = dest.name.toLowerCase().includes(search.toLowerCase());
    const matchesRegion = regionFilter === 'All' || dest.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  return (
    <section id="pricing" className="py-32 bg-[#fafafa] relative overflow-hidden">
      <div className="absolute top-0 right-0 w-full h-[500px] bg-gradient-to-b from-white to-transparent -z-0"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-[11px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <Globe2 size={14} /> Global Rates
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6"
          >
            Transparent International <br className="hidden md:block" /> Shipping Rates
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500 font-medium leading-relaxed"
          >
            Estimate your shipping cost based on destination and package weight.
            No hidden fees, no markup—just the direct rates.
          </motion.p>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-slate-200/50 p-1 rounded-2xl w-full md:w-auto">
            <button
              onClick={() => setCustomerType('B2C')}
              className={`flex-1 md:flex-none whitespace-nowrap px-8 py-3 rounded-xl text-sm font-black tracking-widest transition-all ${
                customerType === 'B2C'
                  ? 'bg-white text-slate-900 shadow-[0_4px_10px_rgba(0,0,0,0.05)]'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              Personal (B2C)
            </button>
            <button
              onClick={() => setCustomerType('B2B')}
              className={`flex-1 md:flex-none whitespace-nowrap px-8 py-3 rounded-xl text-sm font-black tracking-widest transition-all ${
                customerType === 'B2B'
                  ? 'bg-white text-slate-900 shadow-[0_4px_10px_rgba(0,0,0,0.05)]'
                  : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
              }`}
            >
              Business (B2B)
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          {/* Search */}
          <div className="relative w-full md:max-w-xs">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="w-full pl-11 pr-4 py-3.5 bg-white border border-slate-200 focus:border-primary focus:ring-4 focus:ring-primary/10 rounded-2xl text-sm font-semibold outline-none transition-all placeholder:text-slate-400"
              placeholder="Search destination..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Region Tabs */}
          <div className="flex overflow-x-auto hide-scrollbar w-full md:w-auto gap-2 p-1 bg-slate-200/50 rounded-2xl">
            {regions.map((region) => (
              <button
                key={region}
                onClick={() => setRegionFilter(region)}
                className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  regionFilter === region 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/50'
                }`}
              >
                {region}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredDestinations.map((dest, i) => {
            const isExpanded = expandedCard === dest.code;
            
            return (
              <motion.div
                key={dest.code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`group relative bg-white border border-slate-200 rounded-[24px] overflow-hidden transition-all duration-300 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-slate-300 ${
                  dest.featured ? 'md:col-span-2 xl:col-span-2 bg-gradient-to-b from-white to-orange-50/30' : ''
                }`}
              >
                {/* Popular Route Badge for featured */}
                {dest.featured && (
                  <div className="absolute top-0 right-0 p-6 flex justify-end items-start pointer-events-none z-10 w-full h-full">
                    <div className="hidden sm:flex rotate-12 scale-[3] absolute -top-8 -right-8 opacity-5">
                      <Star fill="currentColor" className="text-primary" />
                    </div>
                  </div>
                )}
                
                <div className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl shadow-sm rounded-full overflow-hidden w-12 h-12 flex items-center justify-center bg-slate-50 border border-slate-100">
                        {dest.flag}
                      </div>
                      <div>
                        <h3 className="font-black text-xl text-slate-900 tracking-tight">{dest.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">{dest.region}</span>
                          {dest.tag && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                              <span className="text-[11px] font-bold uppercase tracking-widest text-[#F44D4C]">{dest.tag}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-sm font-semibold text-slate-500 mb-1">Starting from</p>
                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-black text-slate-900 tracking-tight">{formatPrice(dest.basePrice)}</span>
                      <span className="text-sm font-bold text-slate-400 mb-1">/kg</span>
                    </div>
                  </div>

                  {/* Accordion Trigger */}
                  <button 
                    onClick={() => setExpandedCard(isExpanded ? null : dest.code)}
                    className="w-full flex items-center justify-between py-4 border-t border-slate-100 text-sm font-bold text-slate-700 hover:text-primary transition-colors"
                  >
                    <span>View weight tiers</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Accordion Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="bg-slate-50 rounded-xl p-4 mb-4 space-y-3 border border-slate-100">
                          <div className="grid grid-cols-3 pb-2 border-b border-slate-200">
                            <div className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Weight</div>
                            <div className="text-[11px] font-black uppercase text-slate-400 tracking-widest">Price/Kg</div>
                            <div className="text-[11px] font-black uppercase text-slate-400 tracking-widest text-right">Time</div>
                          </div>
                          {dest.tiers.map((tier, idx) => (
                            <div key={idx} className="grid grid-cols-3 items-center">
                              <div className="text-sm font-bold text-slate-800">{tier.weight}</div>
                              <div className="text-sm font-bold text-slate-700">{formatPrice(tier.price)}</div>
                              <div className="text-xs font-semibold text-slate-500 text-right">{tier.time}</div>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* CTA */}
                  <div className="pt-2">
                    <Link 
                      href={`/booking?destination_country=${dest.code}`}
                      className="w-full relative flex items-center justify-center gap-2 bg-slate-900 hover:bg-primary text-white font-bold text-sm py-4 rounded-xl shadow-[0_5px_15px_rgba(0,0,0,0.1)] hover:shadow-[0_10px_25px_rgba(244,77,76,0.3)] transition-all ease-out"
                    >
                      Get Instant Quote <ArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {filteredDestinations.length === 0 && (
          <div className="text-center py-20 bg-white border border-slate-100 rounded-[32px]">
            <Globe2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 mb-2">Destination not found</h3>
            <p className="text-slate-500">We couldn&apos;t find any pricing for &quot;{search}&quot;. Try selecting a different region or search term.</p>
          </div>
        )}
      </div>
    </section>
  );
}
