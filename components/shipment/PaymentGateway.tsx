'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, CheckCircle2, Wallet, CreditCard, QrCode, Building2, 
  ArrowRight, ShieldCheck, AlertCircle, Clock, Copy, ChevronRight,
  Printer, MapPin, Package, Download, History
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatIDR } from '@/lib/shipping';
import { PaymentMethod, PaymentStatus } from '@/types/shipping';
import * as motion from 'motion/react-client';
import Link from 'next/link';
import Image from 'next/image';
import { AirwayBill } from './AirwayBill';

interface PaymentGatewayProps {
  isOpen: boolean;
  onClose: () => void;
  shipmentData: {
    id: string;
    total: number;
    baseRate: number;
    insurance: number;
    surcharge: number;
    service: string;
    incoterm: 'DDU' | 'DDP';
    eta: string;
    items: number;
    weight: number;
    consignee: any;
    shipper: any;
  };
  onSuccess: (method: PaymentMethod) => void;
}

export function PaymentGateway({ isOpen, onClose, shipmentData, onSuccess }: PaymentGatewayProps) {
  const [step, setStep] = useState<'method' | 'processing' | 'instruction' | 'success'>('method');
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState(3600); // 1 hour for QRIS/VA

  const WALLET_BALANCE = 12450000;

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (step === 'instruction') {
      timer = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step]);

  if (!isOpen) return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const handlePayNow = () => {
    if (!selectedMethod) return;

    if (selectedMethod === 'Wallet' && WALLET_BALANCE < shipmentData.total) {
      return; // Insufficient balance logic handled in UI
    }

    setStep('processing');
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      if (selectedMethod === 'Credit Card' || selectedMethod === 'Wallet') {
        setStep('success');
        onSuccess(selectedMethod);
      } else {
        setStep('instruction');
      }
    }, 2000);
  };

  const handleConfirmInstructionPayment = () => {
    setStep('success');
    if (selectedMethod) onSuccess(selectedMethod);
  };

  const paymentMethods: { id: PaymentMethod; name: string; icon: any; description: string; disabled?: boolean }[] = [
    { 
      id: 'Wallet', 
      name: 'GooWallet Balance', 
      icon: Wallet, 
      description: `Available: ${formatIDR(WALLET_BALANCE)}`,
      disabled: WALLET_BALANCE < shipmentData.total
    },
    { id: 'Virtual Account', name: 'Virtual Account', icon: Building2, description: 'BCA, Mandiri, BNI, BRI' },
    { id: 'QRIS', name: 'QRIS', icon: QrCode, description: 'Pay with GoPay, OVO, Dana, LinkAja' },
    { id: 'Credit Card', name: 'Credit / Debit Card', icon: CreditCard, description: 'Visa, Mastercard, JCB, Amex' },
  ];

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 print:static print:inset-auto print:p-0 print:bg-white print:block">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={step !== 'processing' ? onClose : undefined}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm print:hidden"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col z-10 print:hidden"
      >
        {/* Header (except success) */}
        {step !== 'success' && (
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                {step === 'method' ? <CreditCard size={20} /> : <Clock size={20} />}
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-800 leading-tight">
                  {step === 'method' ? 'Choose Payment Method' : 'Complete Your Payment'}
                </h2>
                <p className="text-xs text-slate-500 font-medium">Order ID: {shipmentData.id}</p>
              </div>
            </div>
            {step !== 'processing' && (
              <button 
                onClick={onClose}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {step === 'method' && (
            <div className="grid grid-cols-1 md:grid-cols-12">
              {/* Methods List */}
              <div className="md:col-span-7 p-6 border-r border-slate-100">
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      disabled={method.disabled}
                      onClick={() => setSelectedMethod(method.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left relative",
                        selectedMethod === method.id 
                          ? "border-primary bg-primary/5 shadow-md shadow-primary/5" 
                          : "border-slate-100 hover:border-slate-200 hover:bg-slate-50",
                        method.disabled && "opacity-50 cursor-not-allowed grayscale"
                      )}
                    >
                      <div className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                        selectedMethod === method.id ? "bg-primary text-white" : "bg-slate-100 text-slate-500"
                      )}>
                        <method.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-slate-800 text-[14px]">{method.name}</p>
                        <p className="text-[12px] text-slate-500 font-medium">{method.description}</p>
                      </div>
                      {selectedMethod === method.id && (
                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                          <CheckCircle2 className="text-white h-3.5 w-3.5" />
                        </div>
                      )}
                      {method.disabled && (
                        <div className="absolute right-4 top-4">
                           <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase">Insufficient</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>

                {selectedMethod === 'Wallet' && (
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                    <AlertCircle className="text-blue-600 h-5 w-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-[13px] font-bold text-blue-900">Wallet Payment</p>
                      <p className="text-[12px] text-blue-700 leading-relaxed font-medium">
                        Payment will be automatically deducted from your balance. No further confirmation needed.
                      </p>
                    </div>
                  </div>
                )}

                {selectedMethod === 'Credit Card' && (
                    <div className="mt-6 space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Card Number</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="0000 0000 0000 0000" 
                                    readOnly
                                    defaultValue="4242 4242 4242 4242"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-[14px] focus:outline-none focus:border-primary"
                                />
                                <div className="absolute right-3 top-3">
                                    <CreditCard className="text-slate-300 h-5 w-5" />
                                </div>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Expiry Date</label>
                                <input type="text" placeholder="MM/YY" readOnly defaultValue="12/26" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-[14px]" />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">CVV</label>
                                <input type="password" placeholder="***" readOnly defaultValue="123" className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-[14px]" />
                            </div>
                        </div>
                    </div>
                )}
              </div>

              {/* Summary Sidebar */}
              <div className="md:col-span-5 bg-slate-50 p-6 flex flex-col">
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Order Summary</h3>
                <div className="space-y-4 flex-1">
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/5 rounded flex items-center justify-center text-primary">
                        <Package size={20} />
                      </div>
                      <div>
                        <p className="text-[13px] font-bold text-slate-800">{shipmentData.service}</p>
                        <p className="text-[11px] text-slate-500">{shipmentData.items} items • {shipmentData.weight}kg</p>
                      </div>
                    </div>
                    <p className="text-[14px] font-bold text-slate-800">{formatIDR(shipmentData.baseRate)}</p>
                  </div>
                  
                  <div className="space-y-2 px-1">
                    <div className="flex justify-between text-[13px] text-slate-500">
                      <span>Shipping Fee</span>
                      <span>{formatIDR(shipmentData.baseRate)}</span>
                    </div>
                    <div className="flex justify-between text-[13px] text-slate-500">
                      <span>Insurance Fee</span>
                      <span>{formatIDR(shipmentData.insurance)}</span>
                    </div>
                    {shipmentData.surcharge > 0 && (
                      <div className="flex justify-between text-[13px] text-orange-600">
                        <span>Remote Surcharge</span>
                        <span>{formatIDR(shipmentData.surcharge)}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-8 border-t border-slate-200 pt-6">
                  <div className="flex justify-between items-end mb-6">
                    <p className="text-[12px] font-bold text-slate-500 uppercase tracking-wider">Total Bill</p>
                    <p className="text-2xl font-black text-primary leading-none">{formatIDR(shipmentData.total)}</p>
                  </div>
                  <button
                    onClick={handlePayNow}
                    disabled={!selectedMethod}
                    className={cn(
                      "w-full bg-primary text-white py-4 rounded-xl font-bold text-[15px] flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-primary/20",
                      !selectedMethod && "opacity-50 grayscale cursor-not-allowed"
                    )}
                  >
                    Pay Now
                    <ArrowRight size={18} />
                  </button>
                  <p className="text-center text-[11px] text-slate-400 mt-4 flex items-center justify-center gap-1">
                    <ShieldCheck size={14} className="text-green-500" />
                    Secure SSL Encrypted Payment
                  </p>
                </div>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="p-12 flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="w-24 h-24 rounded-full border-4 border-slate-100 border-t-primary"
                />
                <div className="absolute inset-0 flex items-center justify-center text-primary">
                    <ShieldCheck size={40} />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">Processing Payment</h3>
                <p className="text-slate-500 font-medium max-w-xs mx-auto mt-2">
                  Please wait while we secure your transaction. Do not close or refresh this window.
                </p>
              </div>
            </div>
          )}

          {step === 'instruction' && (
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="p-8 border-r border-slate-100 flex flex-col items-center justify-center text-center">
                {selectedMethod === 'QRIS' ? (
                  <>
                    <div className="p-4 border-4 border-slate-100 rounded-3xl mb-4 bg-white shadow-xl shadow-slate-100 flex flex-col items-center">
                        <QrCode size={200} className="text-slate-800" />
                        <div className="mt-4 flex items-center gap-2 px-6 py-1.5 bg-slate-900 rounded-full">
                           <Image src="https://send.goorita.com/logo-white.png" alt="GooSafe" width={60} height={15} />
                           <span className="w-1 h-3 bg-white/20"></span>
                           <span className="text-[10px] text-white font-bold tracking-widest uppercase">Secured</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-primary font-bold bg-primary/5 px-4 py-2 rounded-full mb-2">
                      <Clock size={16} />
                      <span className="text-sm">Expires in {formatTime(countdown)}</span>
                    </div>
                    <p className="text-xs text-slate-400 font-medium">Scan QR above with any banking or payment app</p>
                  </>
                ) : (
                  <>
                    <div className="w-full max-w-sm bg-slate-50 rounded-2xl p-6 border border-slate-100 space-y-6">
                        <div className="text-left">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Transfer Destination</p>
                            <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black italic">BCA</div>
                                    <div className="text-left">
                                        <p className="text-[12px] font-bold text-slate-800">Bank Central Asia</p>
                                        <p className="text-[14px] font-black text-slate-900 tracking-wider">8093 1123 4452 938</p>
                                    </div>
                                </div>
                                <button className="p-2 text-primary hover:bg-primary/5 rounded-lg transition-colors">
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-primary font-bold bg-primary/5 px-4 py-2 rounded-full inline-flex">
                            <Clock size={16} />
                            <span className="text-sm">Pay before {formatTime(countdown)}</span>
                        </div>
                    </div>
                  </>
                )}
              </div>
              <div className="p-8 space-y-6 flex flex-col justify-center">
                <div>
                   <h3 className="text-xl font-black text-slate-800">Payment Instructions</h3>
                   <p className="text-slate-500 font-medium text-sm mt-1">Follow these steps to complete your booking</p>
                </div>

                <div className="space-y-4">
                    {[
                        "Open your preferred banking or e-wallet application",
                        selectedMethod === 'QRIS' ? "Select 'Scan' and point your camera to the QR code" : "Select 'Transfer' and choose Bank Central Asia",
                        `Ensure the total amount is exactly ${formatIDR(shipmentData.total)}`,
                        "Complete the transaction and wait for confirmation"
                    ].map((stepText, i) => (
                        <div key={i} className="flex gap-4 items-start group">
                            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[12px] font-black text-slate-500 flex-shrink-0 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                {i+1}
                            </div>
                            <p className="text-[13px] text-slate-600 font-medium leading-relaxed">{stepText}</p>
                        </div>
                    ))}
                </div>

                <div className="pt-6 space-y-3">
                    <button 
                         onClick={handleConfirmInstructionPayment}
                         className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-600 transition-all shadow-lg shadow-primary/20"
                    >
                        I Have Completed Payment
                    </button>
                    <button 
                        onClick={onClose}
                        className="w-full py-4 text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors"
                    >
                        Review Shipment Details
                    </button>
                </div>
              </div>
            </div>
          )}

          {step === 'success' && (
            <div className="flex flex-col items-center justify-center text-center p-8 sm:p-12">
               <motion.div 
                 initial={{ scale: 0 }}
                 animate={{ scale: 1 }}
                 className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center text-white mb-6 shadow-xl shadow-green-100"
               >
                 <CheckCircle2 size={48} />
               </motion.div>
               
               <h2 className="text-2xl font-black text-slate-800 mb-2">Payment Successful!</h2>
               <p className="text-slate-500 font-medium max-w-sm mb-8">
                 Shipment <span className="font-bold text-primary">{shipmentData.id}</span> is confirmed and ready for pickup.
               </p>

               <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl mb-12">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tracking ID</p>
                      <p className="text-[14px] font-black text-slate-800">{shipmentData.id}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Payment Method</p>
                      <p className="text-[14px] font-black text-slate-800">{selectedMethod}</p>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</p>
                      <p className="text-[14px] font-black text-green-600">Shipment Paid</p>
                  </div>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 w-full max-w-lg">
                  <button 
                    onClick={() => {
                        window.print();
                    }}
                    className="flex-1 bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                  >
                    <Printer size={18} />
                    Print AWB
                  </button>
                  <Link 
                    href={`/tracking?id=${shipmentData.id}`}
                    className="flex-1 bg-white border-2 border-slate-200 text-slate-800 font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-50 transition-all"
                  >
                    <ArrowRight size={18} />
                    Track Shipment
                  </Link>
               </div>

               <Link 
                  href="/shipment/history"
                  className="mt-8 text-slate-400 hover:text-primary font-bold text-sm transition-colors flex items-center gap-1"
               >
                  <History size={16} />
                  View My Shipments
               </Link>
            </div>
          )}
        </div>
      </motion.div>

       {/* AWB container for printing - Hidden on screen, visible on print */}
       {step === 'success' && (
          <div className="hidden print:block print:w-full print:bg-white">
             <AirwayBill 
               shipment={{
                 id: shipmentData.id,
                 date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                 service: shipmentData.service as 'Saver' | 'Express',
                 items: shipmentData.items,
                 actualWeight: shipmentData.weight * 0.9,
                 chargeableWeight: shipmentData.weight,
                 price: formatIDR(shipmentData.baseRate),
                 insurance: formatIDR(shipmentData.insurance),
                 total: formatIDR(shipmentData.total),
                 status: 'Paid',
                 statusColor: 'bg-green-100 text-green-800',
                 paymentStatus: 'Paid',
                 paymentMethod: selectedMethod || 'Wallet', incoterm: shipmentData.incoterm, eta: shipmentData.eta,
                 shipper: shipmentData.shipper,
                 consignee: shipmentData.consignee
               }}
             />
          </div>
       )}
    </div>
  );
}
