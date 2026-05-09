'use client';

import { motion } from 'motion/react';
import { PackageOpen, Tag, CreditCard, Truck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const steps = [
  {
    id: 1,
    title: 'Describe Your Shipment',
    description: 'Enter shipment details via AI chat or our easy form.',
    icon: PackageOpen,
  },
  {
    id: 2,
    title: 'Get Instant Quote',
    description: 'Our system shows the best courier options and rates.',
    icon: Tag,
  },
  {
    id: 3,
    title: 'Choose & Pay',
    description: 'Select your preferred service and complete payment quickly.',
    icon: CreditCard,
  },
  {
    id: 4,
    title: 'We Ship & Track',
    description: 'Enjoy real-time tracking until your package is safely delivered.',
    icon: Truck,
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6"
          >
            How It Works
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-500 font-medium leading-relaxed"
          >
            International shipping made simple. Four steps from booking to delivery.
          </motion.p>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Desktop Connecting Line */}
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-[2px] bg-slate-100 z-0">
            <motion.div 
              className="h-full bg-[#F44D4C]"
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeInOut", delay: 0.2 }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 relative z-10">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Icon Container */}
                <div className="w-24 h-24 mb-6 relative">
                  <div className="absolute inset-0 bg-[#F44D4C]/5 rounded-full scale-0 group-hover:scale-110 transition-transform duration-300 ease-out" />
                  <div className="w-full h-full bg-white border-2 border-slate-100 rounded-full flex items-center justify-center relative z-10 shadow-sm group-hover:border-[#F44D4C]/30 transition-colors duration-300">
                    <step.icon className="w-10 h-10 text-slate-400 group-hover:text-[#F44D4C] transition-colors duration-300 group-hover:-translate-y-1 transform" />
                  </div>
                  
                  {/* Step Number Badge */}
                  <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-slate-900 text-white font-bold text-sm flex items-center justify-center z-20 border-4 border-white shadow-sm group-hover:bg-[#F44D4C] transition-colors duration-300">
                    {step.id}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-[#F44D4C] transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed max-w-[280px]">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          className="mt-20 text-center"
        >
          <Link 
            href="/booking"
            className="inline-flex items-center justify-center gap-2 bg-[#F44D4C] text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-[#D93C3B] hover:shadow-[0_10px_25px_rgba(244,77,76,0.3)] transition-all active:scale-95 group"
          >
            Start Your Shipment
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
