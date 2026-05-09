'use client';

import { useState, useEffect, Suspense, useRef } from 'react';
import { MapPin, Plus, Trash2, CheckCircle2, AlertCircle, Info, Truck, Package, PackageOpen, Wand2, ChevronRight, MessageCircle, Zap } from 'lucide-react';
import { 
  LOCATIONS, POSTAL_CODES, RATES, REMOTE_AREA_SURCHARGE, INSURANCE_RATE,
  PackageItem, calculateTotalChargeableWeight, calculateChargeableWeight, formatIDR 
} from '@/lib/shipping';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ResultSection } from '@/components/shipment/ResultSection';
import { OriginDestinationForm } from '@/components/shipment/OriginDestinationForm';
import { PackageBuilder } from '@/components/shipment/PackageBuilder';
import { motion } from 'motion/react';

import { AIChatInput } from '@/components/shipment/AIChatInput';

function CreateShipmentContent() {
  const searchParams = useSearchParams();
  
  const [step, setStep] = useState<1 | 2>(() => {
    return (searchParams.has('origin_city') && searchParams.has('destination_country') && searchParams.has('weight')) ? 2 : 1;
  });
  
  // Shipper State
  const [shipperName, setShipperName] = useState(() => searchParams.has('origin_city') ? 'John Doe' : '');
  const [shipperPhone, setShipperPhone] = useState(() => searchParams.has('origin_city') ? '+628123456789' : '');
  const [shipperEmail, setShipperEmail] = useState(() => searchParams.has('origin_city') ? 'john@example.com' : '');
  const [shipperAddress, setShipperAddress] = useState(() => searchParams.has('origin_city') ? 'Jl. Sudirman No 10' : '');
  const [originCountry, setOriginCountry] = useState('ID');
  
  const [originCity, setOriginCity] = useState(() => {
    const q = searchParams.get('origin_city')?.toLowerCase();
    if (q) return searchParams.get('origin_city') || '';
    return '';
  });

  const [originState, setOriginState] = useState(() => {
    const q = searchParams.get('origin_city')?.toLowerCase();
    if (q === 'jakarta' || q === 'lebak bulus') return 'DKI Jakarta';
    if (q === 'bali') return 'Bali';
    if (q === 'bandung') return 'Jawa Barat';
    if (q === 'surabaya') return 'Jawa Timur';
    if (q) return searchParams.get('origin_city') || '';
    return '';
  });

  const [originPostal, setOriginPostal] = useState(() => {
    const q = searchParams.get('origin_city')?.toLowerCase();
    if (q === 'jakarta' || q === 'lebak bulus') return '12190';
    if (q === 'bali') return '80232';
    if (q === 'bandung') return '40111';
    return searchParams.has('origin_city') ? '1000' : '';
  });

  // Consignee State
  const [consigneeName, setConsigneeName] = useState(() => searchParams.has('destination_country') ? 'Jane Smith' : '');
  const [consigneePhone, setConsigneePhone] = useState(() => searchParams.has('destination_country') ? '+6591234567' : '');
  const [consigneeEmail, setConsigneeEmail] = useState(() => searchParams.has('destination_country') ? 'jane@example.com' : '');
  const [consigneeAddress, setConsigneeAddress] = useState(() => searchParams.has('destination_country') ? '123 Main Street' : '');
  
  const [destCountry, setDestCountry] = useState(() => {
    const q = searchParams.get('destination_country')?.toLowerCase();
    if (q === 'singapore') return 'SG';
    if (q === 'australia') return 'AU';
    if (q === 'japan' || q === 'tokyo') return 'JP';
    if (q === 'usa' || q === 'united states') return 'US';
    if (q === 'uk' || q === 'united kingdom') return 'GB';
    if (q) return searchParams.get('destination_country') || '';
    return '';
  });

  const [destCity, setDestCity] = useState(() => {
    const q = searchParams.get('destination_country')?.toLowerCase();
    if (q === 'singapore') return 'Singapore';
    if (q === 'australia') return 'Sydney';
    if (q === 'tokyo' || q === 'japan') return 'Tokyo';
    if (q) return searchParams.get('destination_country') || '';
    return '';
  });

  const [destState, setDestState] = useState(() => {
    const q = searchParams.get('destination_country')?.toLowerCase();
    if (q === 'singapore') return 'Singapore';
    if (q === 'australia') return 'New South Wales';
    if (q === 'tokyo' || q === 'japan') return 'Tokyo-to';
    if (q) return searchParams.get('destination_country') || '';
    return '';
  });

  const [destPostal, setDestPostal] = useState(() => {
    const q = searchParams.get('destination_country')?.toLowerCase();
    if (q === 'singapore') return '238823';
    if (q === 'australia') return '2000';
    if (q === 'tokyo' || q === 'japan') return '100-0001';
    return searchParams.has('destination_country') ? '00000' : '';
  });

  const [isRemoteArea, setIsRemoteArea] = useState(false);

  const [aiInput, setAiInput] = useState<string | null>(searchParams.get('ai_input'));

  // Confidence state
  const getConf = (key: string) => searchParams.get(`${key}_conf`) || null;
  const confData = {
    origin: getConf('origin_city'),
    destination: getConf('destination_country'),
    weight: getConf('weight'),
    dimensions: getConf('length'), // length used as proxy for dimensions confidence
    value: getConf('value_usd'),
    itemType: getConf('item_type')
  };

  // Packages State
  const [packages, setPackages] = useState<PackageItem[]>(() => {
    const qWeight = parseFloat(searchParams.get('weight') || '0');
    const qL = parseInt(searchParams.get('length') || '0');
    const qW = parseInt(searchParams.get('width') || '0');
    const qH = parseInt(searchParams.get('height') || '0');
    const qValue = parseFloat(searchParams.get('value_usd') || '100');
    const qItemType = searchParams.get('item_type');

    if (qWeight > 0 || qL > 0 || qItemType) {
      return [{
        id: '1',
        size: (qL > 0) ? 'Custom' : 'Medium',
        weight: qWeight || (getConf('weight') === 'low' ? 0 : 2),
        valueUsd: qValue,
        length: qL || (getConf('length') === 'high' ? 15 : 0),
        width: qW || (getConf('width') === 'high' ? 12 : 0),
        height: qH || (getConf('height') === 'high' ? 10 : 0)
      }];
    }
    return [{ id: '1', size: 'Medium', weight: 3, valueUsd: 100 }];
  });

  const [isLoadingEstimate, setIsLoadingEstimate] = useState(false);
  const initialized = useRef(false);

  const missingFields = [];
  if (!destCountry) missingFields.push('destination country');
  if (packages.some(p => p.weight <= 0)) missingFields.push('package weight');
  if (packages.some(p => p.size === 'Custom' && (p.length === 0 || p.width === 0 || p.height === 0))) missingFields.push('dimensions');


  // Remove the problematic effect since we now initialize state directly
  useEffect(() => {
    initialized.current = true;
  }, []);

  const handleGetEstimate = () => {
    // Basic validation
    if (!destCountry || !destPostal || packages.length === 0) {
      alert("Please fill all required destination and package details.");
      return;
    }
    
    setIsLoadingEstimate(true);
    // Simulate smart loading states
    setTimeout(() => {
      setStep(2);
      setIsLoadingEstimate(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const handleAutoFill = (data: any) => {
    // Determine target from simulated data
    if (data.destCity?.toLowerCase().includes('singapore')) {
      setShipperName('Wayan Suparta');
      setShipperPhone('+628123456789');
      setShipperEmail('wayan@example.com');
      setShipperAddress('Jl. Sudirman No 10, Jakarta Selatan');
      setOriginCountry('ID');
      setOriginPostal('12190');
      setOriginCity('Jakarta Selatan');
      setOriginState('DKI Jakarta');

      setConsigneeName('Ketut Lempak');
      setConsigneePhone('+6591234567');
      setConsigneeEmail('ketut@example.com');
      setConsigneeAddress('123 Orchard Road, #05-12');
      setDestCountry('SG');
      setDestPostal('238823');
      setDestCity('Singapore');
      setDestState('Singapore');
      setIsRemoteArea(false);
    } else {
      setShipperName('Budi Santoso');
      setShipperPhone('+628123456789');
      setShipperEmail('budi@example.com');
      setShipperAddress('Jl. Sudirman No 10, Jakarta Selatan');
      setOriginCountry('ID');
      setOriginPostal('12190');
      setOriginCity('Jakarta Selatan');
      setOriginState('DKI Jakarta');

      setConsigneeName('Alice Smith');
      setConsigneePhone('+14155552671');
      setConsigneeEmail('alice.smith@example.com');
      setConsigneeAddress('123 Mission St, Apt 4B');
      setDestCountry('US');
      setDestPostal('94105');
      setDestCity('San Francisco');
      setDestState('California');
      setIsRemoteArea(false);
    }

    setPackages([
       { id: '1', size: 'Custom', weight: 3, valueUsd: 150, length: 15, width: 12, height: 10 }
    ]);
  };

  const totalChargeableWeight = calculateTotalChargeableWeight(packages);
  const isPickupAvailable = (originState.includes('Jakarta') || originState.includes('Bali')) && totalChargeableWeight >= 20;

  // Animation variants
  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 15 }
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-[#f8f9fa] flex flex-col">
      <div className="p-6 md:p-8 max-w-6xl mx-auto w-full flex-1">
        {/* Progress Indicator */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex items-center justify-center"
        >
          <div className="flex items-center gap-4 text-sm font-bold uppercase tracking-wider">
            <div className={cn("flex flex-col items-center gap-2 transition-colors duration-300", step === 1 ? "text-primary" : "text-slate-400")}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm", step === 1 ? "border-primary bg-primary/10 text-primary" : "border-slate-200 bg-white text-slate-400")}>
                1
              </div>
              <span className="text-[10px]">Details</span>
            </div>
            
            <div className="w-16 h-0.5 relative bg-slate-200 mb-6 rounded-full overflow-hidden">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: step === 2 ? '100%' : '0%' }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              />
            </div>
            
            <div className={cn("flex flex-col items-center gap-2 transition-colors duration-300", step === 2 ? "text-primary" : "text-slate-400")}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-sm", step === 2 ? "border-primary bg-primary/10 text-primary" : "border-slate-200 bg-white text-slate-400")}>
                2
              </div>
              <span className="text-[10px]">Quote & Pay</span>
            </div>
          </div>
        </motion.div>

        {step === 1 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 xl:grid-cols-3 gap-8 relative"
          >
            <div className="xl:col-span-2 space-y-8">
              
              {aiInput && (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-primary/5 border border-primary/10 rounded-2xl p-6 flex items-start gap-5 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-2 flex gap-2">
                    {confData.origin === 'high' && (
                       <span className="flex items-center gap-1.5 text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2.5 py-1 rounded-full border border-green-100">
                         <CheckCircle2 size={10} /> Origin Verified
                       </span>
                    )}
                    <span className="flex items-center gap-1.5 text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2.5 py-1 rounded-full">
                      <Zap size={10} className="fill-primary" /> AI Assisted
                    </span>
                  </div>
                  <div className="bg-primary p-3 rounded-2xl text-white shadow-lg shadow-primary/20">
                    <MessageCircle size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-2">Conversation Context</p>
                    <p className="text-slate-900 font-bold text-lg leading-tight italic">
                      &quot;{aiInput}&quot;
                    </p>
                    
                    {missingFields.length > 0 ? (
                      <div className="mt-4 p-3 bg-white/60 border border-primary/20 rounded-xl">
                        <p className="text-slate-800 font-black text-sm uppercase tracking-tight flex items-center gap-2">
                           <AlertCircle size={16} className="text-primary" />
                           Action Required: {missingFields[0]}
                        </p>
                        <p className="text-slate-500 text-xs font-medium mt-1">
                          I couldn&apos;t quite catch the {missingFields.join(' and ')}. Please provide them below to calculate the final rate.
                        </p>
                      </div>
                    ) : (
                      <p className="text-slate-500 text-xs font-medium mt-3 flex items-center gap-2">
                        <CheckCircle2 size={14} className="text-green-500" />
                        We&apos;ve pre-filled the form based on your request. Please verify the details below.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <AIChatInput onAutoFill={handleAutoFill} />
              </motion.div>

              {/* Origin & Destination Details */}
              <motion.div variants={itemVariants}>
                <OriginDestinationForm 
                  confData={confData}
                  origin={{
                    name: shipperName, phone: shipperPhone, email: shipperEmail, address: shipperAddress,
                    country: originCountry, postal: originPostal, city: originCity, state: originState,
                    setName: setShipperName, setPhone: setShipperPhone, setEmail: setShipperEmail, setAddress: setShipperAddress,
                    setCountry: setOriginCountry, setPostal: setOriginPostal, setCity: setOriginCity, setState: setOriginState
                  }}
                  destination={{
                    name: consigneeName, phone: consigneePhone, email: consigneeEmail, address: consigneeAddress,
                    country: destCountry, postal: destPostal, city: destCity, state: destState,
                    setName: setConsigneeName, setPhone: setConsigneePhone, setEmail: setConsigneeEmail, setAddress: setConsigneeAddress,
                    setCountry: setDestCountry, setPostal: setDestPostal, setCity: setDestCity, setState: setDestState,
                    setIsRemoteArea
                  }}
                />
              </motion.div>

              {/* Package Builder */}
              <motion.div variants={itemVariants}>
                <PackageBuilder packages={packages} setPackages={setPackages} />
              </motion.div>
            </div>

            {/* Sticky summary sidebar */}
            <motion.div variants={itemVariants} className="xl:col-span-1">
              <motion.div 
                whileHover={{ y: -2 }}
                className="bg-white rounded-[12px] border-t-4 border-t-primary border-x border-b border-[#e2e8f0] p-6 sticky top-8 flex flex-col gap-5 shadow-sm relative overflow-hidden transition-shadow hover:shadow-md"
              >
                <div className="absolute top-0 left-0 w-full h-[1px] bg-primary/20"></div>
                <p className="text-[14px] font-black uppercase tracking-[0.05em] text-slate-800 flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  Shipment Summary
                </p>
                
                <div className="flex flex-col gap-3 py-2">
                  <div className="flex justify-between items-center text-[13px] text-slate-600 border-b border-dashed border-slate-100 pb-2">
                    <span className="font-medium">Total Items</span>
                    <span className="font-black text-slate-900 bg-slate-50 px-2 py-0.5 rounded">{packages.length} package(s)</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] text-slate-600 border-b border-dashed border-slate-100 pb-2">
                    <span className="flex items-center font-medium">
                      Est. Weight 
                      <div className="group relative ml-1.5 inline-block">
                        <Info className="h-3.5 w-3.5 text-slate-400 cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden w-48 rounded-lg bg-slate-800 p-2 text-[11px] text-white group-hover:block z-10 text-center shadow-lg font-normal leading-relaxed">
                          We use the higher value between actual weight and dimensional weight.
                        </div>
                      </div>
                    </span>
                    <span className="font-black text-slate-900 bg-slate-50 px-2 py-0.5 rounded">{Math.ceil(totalChargeableWeight)} kg</span>
                  </div>
                  <div className="flex justify-between items-center text-[13px] text-slate-600">
                    <span className="font-medium">Declared Value</span>
                    <span className="font-black text-slate-900 bg-slate-50 px-2 py-0.5 rounded">
                      ${packages.reduce((acc, p) => acc + (p.valueUsd || 0), 0)}
                    </span>
                  </div>
                </div>

                {isRemoteArea && (
                  <div className="bg-orange-50 border border-orange-100 rounded-lg p-3 flex">
                    <AlertCircle className="h-4 w-4 text-orange-600 flex-shrink-0 mr-2 mt-0.5" />
                    <p className="text-[11px] text-orange-800 font-medium">
                      Destination postal code is in a remote area. Additional surcharges will apply.
                    </p>
                  </div>
                )}

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={handleGetEstimate}
                  disabled={isLoadingEstimate}
                  className="w-full relative rounded-xl bg-primary p-4 text-[15px] font-black text-white hover:bg-primary-600 transition-all duration-200 mt-2 shadow-[0_4px_14px_0_rgba(244,77,76,0.39)] hover:shadow-[0_6px_20px_rgba(244,77,76,0.23)] hover:-translate-y-0.5 disabled:opacity-80 disabled:cursor-not-allowed overflow-hidden flex justify-center items-center gap-2 group"
                >
                  {isLoadingEstimate ? (
                    <motion.div 
                      className="absolute inset-0 bg-primary flex items-center justify-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <motion.div
                        animate={{ x: [0, 40, -40, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      >
                        <Truck className="h-5 w-5 text-white/90" />
                      </motion.div>
                      <span className="animate-pulse">Finding best price...</span>
                    </motion.div>
                  ) : (
                    <>
                      Get Instant Quote
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <ResultSection
            packages={packages}
            originState={originState}
            destCountry={destCountry}
            isPickupAvailable={isPickupAvailable}
            isRemoteArea={isRemoteArea}
            onBack={() => setStep(1)}
            shipper={{
              name: shipperName,
              phone: shipperPhone,
              email: shipperEmail,
              street: shipperAddress,
              city: originCity,
              state: originState,
              zip: originPostal,
              country: 'Indonesia'
            }}
            consignee={{
              name: consigneeName,
              phone: consigneePhone,
              email: consigneeEmail,
              street: consigneeAddress,
              city: destCity,
              state: destState,
              zip: destPostal,
              country: destCountry
            }}
          />
        )}
      </div>
    </div>
  );
}

export default function CreateShipment() {
  return (
    <Suspense fallback={
      <div className="flex-1 flex items-center justify-center bg-[#f8f9fa]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest animate-pulse">Initializing Engine...</p>
        </div>
      </div>
    }>
      <CreateShipmentContent />
    </Suspense>
  );
}
