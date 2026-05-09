'use client';

import React, { useState } from 'react';
import { X, Printer, Download, Eye } from 'lucide-react';
import { AirwayBill } from './AirwayBill';
import { ShipmentHistoryItem } from '@/types/shipping';
import * as motion from 'motion/react-client';

interface AWBModalProps {
  shipment: ShipmentHistoryItem;
  isOpen: boolean;
  onClose: () => void;
}

export function AWBModal({ shipment, isOpen, onClose }: AWBModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    setIsDownloading(true);
    // Simulate PDF generation delay
    setTimeout(() => {
      setIsDownloading(false);
      alert(`Simulating PDF download for ${shipment.id}. In a real app, this would trigger a file download.`);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 print:static print:inset-auto print:p-0 print:z-auto print:block">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden"
      />

      {/* Modal Content */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col z-10 print:hidden"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              <Printer size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-800 leading-tight">Airway Bill Preview</h2>
              <p className="text-xs text-slate-500 font-medium">{shipment.id} • {shipment.consignee.country}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDownload}
              disabled={isDownloading}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-lg transition-colors disabled:opacity-50"
            >
              <Download size={18} />
              {isDownloading ? 'Generating...' : 'Download PDF'}
            </button>
            <button 
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-bold bg-primary text-white rounded-lg hover:bg-primary-600 shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              <Printer size={18} />
              Print AWB
            </button>
            <button 
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable AWB Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-12 bg-slate-50">
          <div className="mx-auto shadow-2xl bg-white shadow-slate-200/50">
            <AirwayBill shipment={shipment} />
          </div>
        </div>

        {/* Footer info (mobile only download) */}
        <div className="sm:hidden p-4 border-t border-slate-100 bg-white">
          <button 
            onClick={handleDownload}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
          >
            <Download size={18} />
            Download PDF
          </button>
        </div>
      </motion.div>

      {/* AWB container for printing - Hidden on screen, visible on print */}
      <div className="hidden print:block print:w-full print:bg-white">
        <AirwayBill shipment={shipment} />
      </div>
    </div>
  );
}
