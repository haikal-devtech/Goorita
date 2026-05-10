import { useState, useEffect, useId, useMemo } from 'react';
import { ArrowLeft, CheckCircle2, Shield, Info, Truck } from 'lucide-react';
import { 
  LOCATIONS, RATES, REMOTE_AREA_SURCHARGE, INSURANCE_RATE,
  PackageItem, calculateTotalChargeableWeight, formatIDR 
} from '@/lib/shipping';
import { calculateChargeableWeight } from '@/lib/pricing';
import { fetchCountryShippingRule, CountryShippingRule, calculateSurcharges } from '@/lib/supabase-shipping';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'motion/react';
import { PaymentGateway } from './PaymentGateway';
import { useAuth } from '../auth/AuthContext';
import { toast } from 'sonner';

export function ResultSection({ 
  packages, originState, destCountry, isPickupAvailable, isRemoteArea, onBack,
  shipper, consignee
}: any) {
  const router = useRouter();
  const { isLoggedIn, openAuthModal } = useAuth();
  
  const [selectedService, setSelectedService] = useState<'saver' | 'express'>('saver');
  const [showAllOptions, setShowAllOptions] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedIncoterm, setSelectedIncoterm] = useState<'DDU' | 'DDP'>('DDU');
  const [shippingRule, setShippingRule] = useState<CountryShippingRule | null>(null);
  const [shippingRates, setShippingRates] = useState<{ saver: number; express: number }>({ saver: 0, express: 0 });

  const destInfo = LOCATIONS.destinations.find(d => d.code === destCountry);
  const zone = destInfo?.zone || 'SEA';
  
  // Cast zone to keyof typeof RATES to satisfy TypeScript
  const rateZone = RATES[zone as keyof typeof RATES] || RATES['SEA'];
  
  const actualWeightTotal = packages.reduce((sum: number, p: PackageItem) => sum + (p.weight || 0), 0);
  const volumeWeightTotal = packages.reduce((sum: number, p: PackageItem) => sum + calculateChargeableWeight(p), 0);
  const totalWeight = calculateTotalChargeableWeight(packages); // This calculates max per package, sum of maxes.
  const totalWeightCeil = Math.ceil(totalWeight);

  useEffect(() => {
    let active = true;
    
    // Fetch rules and rates concurrently
    Promise.all([
      fetchCountryShippingRule(destCountry),
      import('@/lib/supabase-shipping').then(m => Promise.all([
        m.getBaseShippingRate(zone, 'saver', actualWeightTotal, volumeWeightTotal),
        m.getBaseShippingRate(zone, 'express', actualWeightTotal, volumeWeightTotal)
      ]))
    ]).then(([rule, [saverRate, expressRate]]) => {
      if (active) {
        setShippingRule(rule);
        setShippingRates({ saver: saverRate, express: expressRate });
      }
    });

    return () => { active = false; };
  }, [destCountry, zone, actualWeightTotal, volumeWeightTotal]);

  const allowedIncoterms: ('DDU' | 'DDP')[] = useMemo(() => shippingRule ? (shippingRule.incoterms_allowed as ('DDU' | 'DDP')[]) : ['DDU', 'DDP'], [shippingRule]);

  useEffect(() => {
    if (!allowedIncoterms.includes(selectedIncoterm)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedIncoterm(allowedIncoterms[0]);
    }
  }, [destCountry, allowedIncoterms, selectedIncoterm]);
  
  // New State for B2C vs B2B
  const [customerType, setCustomerType] = useState<'B2C' | 'B2B'>('B2C');
  const [companyName, setCompanyName] = useState('');
  const [taxId, setTaxId] = useState('');
  const [picName, setPicName] = useState('');
  const [companyEmail, setCompanyEmail] = useState('');
  const [isSubmittingCredit, setIsSubmittingCredit] = useState(false);
  const [showPendingCredit, setShowPendingCredit] = useState(false);

  // Mock Corporate Credit (In real world, this would come from a user/corporate profile state)
  const [corporateCredit, setCorporateCredit] = useState(5000000); // 5 Million IDR

  // Load state from session storage on mount
  useEffect(() => {
    const pendingAction = sessionStorage.getItem('intendedNextAction');
    if (pendingAction === 'payment') {
      const savedService = sessionStorage.getItem('selectedService');
      if (savedService === 'saver' || savedService === 'express') {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelectedService(savedService);
      }
      
      if (isLoggedIn) {
        setIsPaymentOpen(true);
        sessionStorage.removeItem('intendedNextAction');
        sessionStorage.removeItem('selectedService');
      }
    }
  }, [isLoggedIn]);

  const totalValueUsd = packages.reduce((acc: number, p: PackageItem) => acc + (p.valueUsd || 0), 0);
  const insuranceFee = totalValueUsd * INSURANCE_RATE * 15000; // rough IDR conversion

  const roundedWeight = totalWeight >= 31 ? Math.ceil(totalWeight) : Math.ceil(totalWeight * 2) / 2;

  const { ddpSurcharge, handlingSurcharge, remoteAreaSurcharge } = shippingRule 
    ? calculateSurcharges(shippingRule, packages, selectedIncoterm, isRemoteArea)
    : { ddpSurcharge: 0, handlingSurcharge: 0, remoteAreaSurcharge: isRemoteArea ? REMOTE_AREA_SURCHARGE : 0 };

  const priceMultiplier = customerType === 'B2C' ? 1.2 : 1.0;

  const saverBase = shippingRates.saver * priceMultiplier;
  const expressBase = shippingRates.express * priceMultiplier;

  const saverTotal = saverBase + remoteAreaSurcharge + handlingSurcharge + ddpSurcharge + insuranceFee;
  const expressTotal = expressBase + remoteAreaSurcharge + handlingSurcharge + ddpSurcharge + insuranceFee;

  const currentTotal = selectedService === 'saver' ? saverTotal : expressTotal;
  const currentBase = selectedService === 'saver' ? saverBase : expressBase;
  const currentServiceName = selectedService === 'saver' ? 'Goorita Saver' : 'Goorita Air Express';

  const handleBook = () => {
    if (customerType === 'B2B') {
      if (!companyName || !taxId || !picName || !companyEmail) {
        toast.error("Please fill all B2B company details before applying.");
        return;
      }
      if (!isLoggedIn) {
        sessionStorage.setItem('intendedNextAction', 'b2b-submit');
        sessionStorage.setItem('selectedService', selectedService);
        openAuthModal(() => {
          setIsSubmittingCredit(true);
          setTimeout(() => {
            setIsSubmittingCredit(false);
            setShowPendingCredit(true);
            sessionStorage.removeItem('intendedNextAction');
            sessionStorage.removeItem('selectedService');
          }, 1500);
        });
      } else {
        setIsSubmittingCredit(true);
        setTimeout(() => {
          setIsSubmittingCredit(false);
          setShowPendingCredit(true);
        }, 1500);
      }
      return;
    }

    // B2C Flow
    console.log('handleBook clicked, isLoggedIn:', isLoggedIn);
    if (!isLoggedIn) {
      sessionStorage.setItem('intendedNextAction', 'payment');
      sessionStorage.setItem('selectedService', selectedService);
      // Open auth modal and the callback will be executed after login
      openAuthModal(() => {
        console.log('Auth success callback from openAuthModal');
        toast.success("Welcome back, your shipment is ready for payment.");
        setIsPaymentOpen(true);
        sessionStorage.removeItem('intendedNextAction');
        sessionStorage.removeItem('selectedService');
      });
    } else {
      setIsPaymentOpen(true);
    }
  };

  const estDelivery = selectedService === 'saver' ? rateZone.transitSaver : rateZone.transitExpress;
  const serviceNameWithEst = `${currentServiceName} · ETA: ${estDelivery}`;
  const originName = LOCATIONS.originProvinces.find(o => o.code === originState)?.name || originState;
  const destName = LOCATIONS.destinations.find(d => d.code === destCountry)?.country || destCountry;
  const packageDetails = packages.length === 1 
    ? `${packages[0].size === 'Custom' ? 'Custom' : packages[0].size} Box · ${roundedWeight}kg (Chargeable)`
    : `${packages.length} Packages · ${roundedWeight}kg (Chargeable)`;
  const packageDimensions = packages.length === 1 && packages[0].size === 'Custom'
    ? `${packages[0].length}x${packages[0].width}x${packages[0].height} cm`
    : null;

  const reactId = useId();
  const shipmentId = `GORT-${reactId.replace(/:/g, '') || '9128374'}`;

  if (showPendingCredit) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl mx-auto space-y-6 pb-20 text-center"
      >
        <div className="bg-white rounded-[12px] border border-[#e2e8f0] p-10 flex flex-col items-center gap-4 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-2">
            <CheckCircle2 className="h-8 w-8 text-blue-500" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">Application Received</h2>
          <p className="text-slate-500 text-sm font-medium">Your request for B2B credit terms has been submitted. Order #{shipmentId}</p>
          <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 w-full mt-4 text-left space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Company Name</span>
              <span className="font-bold text-slate-800">{companyName}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Status</span>
              <span className="font-bold text-blue-600">Pending Approval</span>
            </div>
          </div>
          <button 
            onClick={() => router.push('/dashboard')}
            className="w-full mt-6 bg-slate-900 text-white p-3.5 rounded-xl font-bold hover:bg-slate-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
        className="max-w-4xl mx-auto space-y-6 pb-20"
      >
        <button 
          onClick={onBack}
          className="flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-2 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to edit
        </button>

        <div className="bg-white rounded-[12px] border border-[#e2e8f0] p-6 flex flex-col gap-6 shadow-sm">
          <div>
            <p className="text-[14px] font-black uppercase tracking-[0.05em] text-slate-800 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-[12px] shadow-sm">4</span>
              Shipping Options
            </p>
          </div>
          
          {/* Recommended Option */}
          <motion.div 
            whileHover={{ y: -2, scale: 1.01 }}
            onClick={() => setSelectedService('saver')}
            className={cn(
              "border-2 rounded-[12px] p-5 relative cursor-pointer transition-all shadow-sm",
              selectedService === 'saver' ? "border-primary bg-primary-50" : "border-[#e2e8f0] bg-white opacity-80"
            )}
          >
            {selectedService === 'saver' && (
              <div className="absolute -top-[12px] right-4 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm flex items-center gap-1">
                <CheckCircle2 size={12} />
                Selected
              </div>
            )}
            <div className="flex justify-between items-center">
              <div>
                <p className="font-black text-[16px] text-slate-900 flex items-center gap-2">
                  <span className="p-1.5 bg-primary/10 rounded-lg text-primary"><Truck className="h-4 w-4" /></span>
                  Goorita Saver
                </p>
                <p className="text-[12px] text-slate-500 mt-1 font-medium ml-9">ETA: {rateZone.transitSaver}</p>
              </div>
              <motion.p 
                key={saverTotal} 
                initial={{ scale: 1.2, color: '#f44d4c' }} 
                animate={{ scale: 1, color: '#0f172a' }}
                className="font-black text-[20px] text-slate-900"
              >
                {formatIDR(saverTotal)}
              </motion.p>
            </div>
            <div className="mt-4 flex items-center text-[12px] font-bold text-slate-600 border-t border-primary/10 pt-4 ml-9">
               <CheckCircle2 className="h-4 w-4 text-primary mr-1 border-primary" />
               {isPickupAvailable ? 'Free pickup available in your area' : 'Drop-off at nearest GooSend Hub'}
            </div>
          </motion.div>

          {!showAllOptions ? (
            <button 
              onClick={() => setShowAllOptions(true)}
              className="text-center font-bold text-[13px] text-slate-500 hover:text-primary transition-colors py-2 border border-dashed border-slate-200 rounded-lg"
            >
              Show all shipping options
            </button>
          ) : (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              onClick={() => setSelectedService('express')}
              className={cn(
                "border-2 rounded-[12px] p-5 relative cursor-pointer hover:border-slate-300 transition-all",
                selectedService === 'express' ? "border-primary bg-primary-50" : "border-[#e2e8f0] bg-white opacity-80"
              )}
            >
              {selectedService === 'express' && (
                <div className="absolute -top-[12px] right-4 bg-primary text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-sm flex items-center gap-1 z-20">
                  <CheckCircle2 size={12} />
                  Selected
                </div>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-bold text-[16px] text-slate-900 flex items-center gap-2">
                    <span className="p-1.5 bg-slate-100 rounded-lg text-slate-400"><Truck className="h-4 w-4" /></span>
                    Goorita Air Express
                  </p>
                  <p className="text-[12px] text-slate-500 mt-1 font-medium ml-9">ETA: {rateZone.transitExpress}</p>
                </div>
                <motion.p 
                  key={expressTotal} 
                  initial={{ scale: 1.2, color: '#f44d4c' }} 
                  animate={{ scale: 1, color: '#0f172a' }}
                  className="font-black text-[20px] text-slate-900"
                >
                  {formatIDR(expressTotal)}
                </motion.p>
              </div>
            </motion.div>
          )}

          <div className="flex items-start justify-between bg-yellow-50/80 border border-yellow-200/50 p-4 rounded-[12px]">
            <div className="flex gap-3 items-start">
              <div className="p-1.5 bg-yellow-100/80 rounded-lg mt-0.5">
                <Shield className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="font-bold text-[13px] text-slate-900">Shipping Insurance Included</p>
                <p className="text-[11px] text-yellow-800/80 mt-1 font-medium leading-relaxed max-w-[280px]">Your package is automatically protected up to {formatIDR(totalValueUsd * 15000)} against loss or damage.</p>
              </div>
            </div>
            <div className="h-5 w-5 rounded-full bg-primary/10 text-primary flex items-center justify-center mt-1">
              <CheckCircle2 className="h-4 w-4" />
            </div>
          </div>

          <div className="border-t border-[#e2e8f0] pt-6 mt-2">
            <p className="text-[14px] font-black uppercase tracking-[0.05em] text-slate-800 mb-4">Incoterms</p>
            <div className="flex gap-4">
              <label className={cn(
                "flex-1 flex flex-col p-3 rounded-xl border-2 transition-all",
                !allowedIncoterms.includes('DDU') ? "opacity-40 cursor-not-allowed bg-slate-50" : "cursor-pointer",
                selectedIncoterm === 'DDU' ? "border-primary bg-primary-50" : "border-slate-100 bg-slate-50 hover:border-slate-200"
              )}>
                <input 
                  type="radio" 
                  name="incoterm" 
                  value="DDU" 
                  checked={selectedIncoterm === 'DDU'} 
                  onChange={() => setSelectedIncoterm('DDU')} 
                  disabled={!allowedIncoterms.includes('DDU')}
                  className="hidden" 
                />
                <span className="font-black text-sm text-slate-800">DDU</span>
                <span className="text-[10px] text-slate-500 font-medium leading-tight mt-1">Delivery Duty Unpaid·Receiver pays duties/taxes at destination.</span>
              </label>
              <label className={cn(
                "flex-1 flex flex-col p-3 rounded-xl border-2 transition-all",
                !allowedIncoterms.includes('DDP') ? "opacity-40 cursor-not-allowed bg-slate-50" : "cursor-pointer",
                selectedIncoterm === 'DDP' ? "border-primary bg-primary-50" : "border-slate-100 bg-slate-50 hover:border-slate-200"
              )}>
                <input 
                  type="radio" 
                  name="incoterm" 
                  value="DDP" 
                  checked={selectedIncoterm === 'DDP'} 
                  onChange={() => setSelectedIncoterm('DDP')} 
                  disabled={!allowedIncoterms.includes('DDP')}
                  className="hidden" 
                />
                <span className="font-black text-sm text-slate-800">DDP</span>
                <span className="text-[10px] text-slate-500 font-medium leading-tight mt-1">Delivery Duty Paid·Sender covers all duties/taxes.</span>
              </label>
            </div>
            {selectedIncoterm === 'DDU' && (
              <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-2">
                <Info className="h-4 w-4 text-slate-500 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-slate-600 font-medium leading-relaxed">
                  <strong>Notice:</strong> Duties and taxes are the responsibility of the receiver. Your receiver may be contacted by customs to pay applicable fees before the shipment can be delivered.
                </p>
              </div>
            )}
            {selectedIncoterm === 'DDP' && (
              <div className="mt-3 p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-start gap-2">
                <Info className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <p className="text-[11px] text-orange-800 font-medium leading-relaxed">
                  <strong>Delivery Duty Paid:</strong> You are prepaying the estimated duties and taxes (DDP Surcharge).
                </p>
              </div>
            )}
          </div>

          <div className="border-t border-dashed border-[#e2e8f0] pt-6 mt-2">
            <div className="flex justify-between text-[14px] mb-3 text-slate-500 font-medium">
              <span>Base Rate ({roundedWeight}kg)</span>
              <span className="text-slate-900">{formatIDR(currentBase)}</span>
            </div>
            {remoteAreaSurcharge > 0 && (
              <div className="flex justify-between text-[14px] mb-3 text-orange-600 font-medium">
                <span>Remote Area Surcharge</span>
                <span>{formatIDR(remoteAreaSurcharge)}</span>
              </div>
            )}
            {selectedIncoterm === 'DDP' ? (
              <div className="flex justify-between text-[14px] mb-3 text-orange-600 font-medium">
                <span>DDP Tax & Duty Appx.</span>
                <span>{formatIDR(ddpSurcharge)}</span>
              </div>
            ) : (
              <div className="flex justify-between text-[12px] mb-3 text-amber-600 font-medium bg-amber-50 p-2 rounded-md">
                <span>DDU Applied: Duties & taxes are the receiver's responsibility at destination.</span>
              </div>
            )}
            {handlingSurcharge > 0 && (
              <div className="flex justify-between text-[14px] mb-3 text-red-600 font-medium">
                <span>Out of bounds Handling Surcharge</span>
                <span>{formatIDR(handlingSurcharge)}</span>
              </div>
            )}
            <div className="flex justify-between text-[14px] mb-4 text-slate-500 font-medium">
              <span>Insurance Protection (0.5%)</span>
              <span className="text-slate-900">{formatIDR(insuranceFee)}</span>
            </div>
            <div className="flex justify-between items-center text-[18px] font-black text-slate-900 mt-4 border-t border-[#e2e8f0] pt-4">
              <span>Total Amount</span>
              <motion.span 
                key={currentTotal}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-[24px] text-primary"
              >
                {formatIDR(currentTotal)}
              </motion.span>
            </div>
          </div>

          <div className="mt-2 space-y-6 border-t border-[#e2e8f0] pt-6">
            <div>
              <p className="text-[14px] font-black uppercase tracking-[0.05em] text-slate-800 mb-4">Customer Type</p>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                <button
                  onClick={() => setCustomerType('B2C')}
                  className={cn(
                    "flex-1 py-2 text-sm font-bold rounded-md transition-all",
                    customerType === 'B2C' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Individual (B2C)
                </button>
                <button
                  onClick={() => setCustomerType('B2B')}
                  className={cn(
                    "flex-1 py-2 text-sm font-bold rounded-md transition-all",
                    customerType === 'B2B' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  )}
                >
                  Business (B2B)
                </button>
              </div>
            </div>

            <AnimatePresence initial={false}>
              {customerType === 'B2B' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className="overflow-hidden"
                >
                  <div className="space-y-4 mt-6">
                    <p className="text-[13px] font-medium text-slate-500 mb-2">
                      Apply for a 14-day credit term on this shipment. We will review your application.
                    </p>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Company Name</label>
                      <input type="text" value={companyName} onChange={e => setCompanyName(e.target.value)} className="w-full text-sm border-gray-300 rounded-lg focus:ring-primary focus:border-primary px-3 py-2 border outline-none" placeholder="PT. Export Sukses" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Corporate ID</label>
                      <input type="text" value={taxId} onChange={e => setTaxId(e.target.value)} className="w-full text-sm border-gray-300 rounded-lg focus:ring-primary focus:border-primary px-3 py-2 border outline-none" placeholder="CORP-XXXX-XXXX" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">PIC Name</label>
                        <input type="text" value={picName} onChange={e => setPicName(e.target.value)} className="w-full text-sm border-gray-300 rounded-lg focus:ring-primary focus:border-primary px-3 py-2 border outline-none" placeholder="John Doe" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Company Email</label>
                        <input type="email" value={companyEmail} onChange={e => setCompanyEmail(e.target.value)} className="w-full text-sm border-gray-300 rounded-lg focus:ring-primary focus:border-primary px-3 py-2 border outline-none" placeholder="billing@company.com" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Order Summary Recap */}
            <motion.div layout transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }} className="border border-[#e2e8f0] rounded-md p-4 sm:p-5 mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-[14px] font-black uppercase tracking-[0.05em] text-slate-800">Order Summary</h3>
                <button 
                  onClick={onBack}
                  className="text-xs font-bold text-slate-500 hover:text-primary transition-colors hover:underline"
                >
                  &larr; Back to edit
                </button>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Route</span>
                  <span className="font-bold text-slate-800 text-right">{originName} &rarr; {destName}</span>
                </div>
                <div className="flex justify-between text-sm items-start">
                  <span className="text-slate-500 font-medium">Package</span>
                  <span className="font-bold text-slate-800 text-right">
                    {packageDetails}
                    {packageDimensions && <span className="block text-xs text-slate-500 font-medium mt-0.5">{packageDimensions}</span>}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Service</span>
                  <span className="font-bold text-slate-800 text-right">{serviceNameWithEst}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Incoterms</span>
                  <span className="font-bold text-slate-800">{selectedIncoterm}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">Base Rate</span>
                  <span className="font-bold text-slate-800">{formatIDR(currentBase)}</span>
                </div>
                {remoteAreaSurcharge > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600 font-medium">Remote Surcharge</span>
                    <span className="font-bold text-slate-800">{formatIDR(remoteAreaSurcharge)}</span>
                  </div>
                )}
                {selectedIncoterm === 'DDP' ? (
                  <div className="flex justify-between text-sm">
                    <span className="text-orange-600 font-medium">DDP Surcharge</span>
                    <span className="font-bold text-slate-800">{formatIDR(ddpSurcharge)}</span>
                  </div>
                ) : (
                  <div className="bg-amber-50 p-2 rounded mt-2">
                    <span className="text-[11px] text-amber-700 font-medium block leading-tight">
                      DDU limit: Duties & taxes responsibility of receiver.
                    </span>
                  </div>
                )}
                {handlingSurcharge > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600 font-medium">Handling Surcharge</span>
                    <span className="font-bold text-slate-800">{formatIDR(handlingSurcharge)}</span>
                  </div>
                )}
                {insuranceFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Insurance</span>
                    <span className="font-bold text-slate-800">{formatIDR(insuranceFee)}</span>
                  </div>
                )}
                
                {customerType === 'B2B' && (
                  <div className="flex justify-between items-center pt-3 border-t border-dashed border-[#e2e8f0] mt-4">
                    <span className="text-sm font-bold text-slate-600 flex items-center gap-1.5">
                      <Shield className="h-3.5 w-3.5 text-blue-500" />
                      Corporate Credit Balance
                    </span>
                    <span className={cn("text-sm font-black", corporateCredit >= currentTotal ? "text-green-600" : "text-red-500")}>
                      {formatIDR(corporateCredit)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-[#e2e8f0] mt-4">
                  <span className="text-[15px] font-black text-slate-900">Total Amount</span>
                  <span className="text-[18px] font-black text-primary">{formatIDR(currentTotal)}</span>
                </div>
              </div>
            </motion.div>

            <motion.button layout transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
              whileTap={{ scale: 0.98 }}
              onClick={handleBook}
              disabled={isSubmittingCredit}
              className="w-full bg-primary text-white p-4 justify-center rounded-xl font-bold text-[16px] hover:bg-primary-600 transition-all duration-200 shadow-[0_4px_14px_0_rgba(244,77,76,0.39)] hover:shadow-[0_6px_20px_rgba(244,77,76,0.23)] hover:-translate-y-0.5 flex flex-row items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmittingCredit ? (
                <>
                  <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : customerType === 'B2B' ? (
                corporateCredit >= currentTotal ? 'Confirm Order' : 'Insufficient Balance'
              ) : (
                'Proceed to Payment'
              )}
            </motion.button>

            {customerType === 'B2B' && corporateCredit < currentTotal && (
              <p className="text-center text-[11px] font-medium text-slate-500">
                Not enough credit balance? <button onClick={() => toast.info("Redirecting to Credit Application...")} className="text-primary font-bold hover:underline">Apply for more credit</button>
              </p>
            )}
          </div>
        </div>
      </motion.div>

      <PaymentGateway 
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        shipmentData={{
          id: shipmentId,
          total: currentTotal,
          baseRate: currentBase,
          insurance: insuranceFee,
          surcharge: remoteAreaSurcharge + handlingSurcharge + ddpSurcharge,
          service: currentServiceName,
          incoterm: selectedIncoterm,
          eta: estDelivery,
          items: packages.length,
          weight: totalWeightCeil,
          consignee: { 
            name: consignee?.name || 'Jane Doe',
            street: consignee?.street || '123 Business Bay, Orchard Rd',
            city: consignee?.city || 'Singapore Central',
            state: consignee?.state || 'Singapore',
            zip: consignee?.zip || '238823',
            country: LOCATIONS.destinations.find(d => d.code === consignee?.country)?.country || consignee?.country || (destCountry === 'SG' ? 'Singapore' : destCountry),
            phone: consignee?.phone || '+65 9123 4567'
          },
          shipper: { 
            name: shipper?.name || 'John Doe',
            street: shipper?.street || 'Jl. Kemang Raya No. 12',
            city: shipper?.city || 'Jakarta South',
            state: shipper?.state || 'DKI Jakarta',
            zip: shipper?.zip || '12730',
            country: 'Indonesia',
            phone: shipper?.phone || '+62 812 3456 7890'
          }
        }}
        onSuccess={(method) => {
          console.log(`Payment successful via ${method}`);
        }}
      />
    </>
  );
}
