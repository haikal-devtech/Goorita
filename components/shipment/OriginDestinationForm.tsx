import { useState } from 'react';
import { MapPin, Search, User, Phone, Mail, Home } from 'lucide-react';
import { LOCATIONS, POSTAL_CODES } from '@/lib/shipping';
import { motion } from 'motion/react';
import { cn } from '@/lib/utils';

export function OriginDestinationForm({ origin, destination, confData, isCompact = false, mode = 'both' }: any) {
  const [destPostalSuggestions, setDestPostalSuggestions] = useState<any[]>([]);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);

  const [originPostalSuggestions, setOriginPostalSuggestions] = useState<any[]>([]);
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);

  // Handle Destination Postal Search
  const handleDestPostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    destination.setPostal(val);
    
    if (val.length > 2 && destination.country) {
      const suggestions = (POSTAL_CODES[destination.country] || []).filter(
        c => c.code.toLowerCase().includes(val.toLowerCase()) || 
             c.city.toLowerCase().includes(val.toLowerCase())
      );
      setDestPostalSuggestions(suggestions);
      setShowDestSuggestions(true);
    } else {
      setShowDestSuggestions(false);
    }
  };

  const selectDestPostal = (suggestion: any) => {
    destination.setPostal(suggestion.code);
    destination.setCity(suggestion.city);
    destination.setState(suggestion.state);
    destination.setIsRemoteArea(!!suggestion.isRemote);
    setShowDestSuggestions(false);
  };

  // Handle Origin Postal Search
  const handleOriginPostalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    origin.setPostal(val);
    
    if (val.length > 2) {
      const suggestions = (POSTAL_CODES['ID'] || []).filter(
        c => c.code.toLowerCase().includes(val.toLowerCase()) || 
             c.city.toLowerCase().includes(val.toLowerCase())
      );
      setOriginPostalSuggestions(suggestions);
      setShowOriginSuggestions(true);
    } else {
      setShowOriginSuggestions(false);
    }
  };

  const selectOriginPostal = (suggestion: any) => {
    origin.setPostal(suggestion.code);
    origin.setCity(suggestion.city);
    origin.setState(suggestion.state);
    setShowOriginSuggestions(false);
  };

  return (
    <div className={cn("flex flex-col gap-8 relative", isCompact && "gap-4")}>
      {/* Route Line Animation */}
      {!isCompact && mode === 'both' && (
        <div className="absolute left-[27px] top-[120px] bottom-[120px] w-0.5 bg-gray-200 hidden md:block">
          <motion.div 
            className="w-full bg-primary"
            initial={{ height: 0 }}
            animate={{ height: "100%" }}
            transition={{ duration: 1.5, ease: "easeInOut", delay: 0.5 }}
          />
        </div>
      )}
      
      {/* 1. Shipper Details */}
      {(mode === 'both' || mode === 'shipper') && (
        <motion.div 
          whileHover={{ y: -2 }}
          className={cn(
            "bg-white rounded-[12px] border border-[#e2e8f0] p-6 flex flex-col gap-6 shadow-sm hover:shadow-md transition-shadow overflow-visible relative z-10",
            isCompact && "p-0 border-0 shadow-none hover:shadow-none hover:y-0 gap-4"
          )}
        >
          {!isCompact && (
            <div>
              <p className="text-[14px] font-black uppercase tracking-[0.05em] text-slate-800 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-[12px] shadow-sm">1</span>
                Shipper Details
              </p>
              <p className="text-[12px] text-slate-500 mt-1 font-medium italic ml-10">International outgoing from Indonesia.</p>
            </div>
          )}

          <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-5 ml-0", !isCompact && "md:ml-10")}>
           <div className="flex flex-col gap-[6px]">
              <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5 focus-within:text-primary transition-colors">
                <User size={12} className="text-slate-400 group-focus-within:text-primary" /> Full Name
              </label>
              <input 
                type="text" 
                placeholder="Enter shipper's full name"
                className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] outline-none focus:border-primary w-full shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                value={origin.name}
                onChange={(e) => origin.setName(e.target.value)}
              />
           </div>
           <div className="flex grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <Phone size={12} className="text-slate-400" /> Phone
                </label>
                <input 
                  type="text" 
                  placeholder="e.g. 0812..."
                  className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] outline-none focus:border-primary w-full shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                  value={origin.phone}
                  onChange={(e) => origin.setPhone(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <Mail size={12} className="text-slate-400" /> Email
                </label>
                <input 
                  type="email" 
                  placeholder="name@email.com"
                  className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] outline-none focus:border-primary w-full shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                  value={origin.email}
                  onChange={(e) => origin.setEmail(e.target.value)}
                />
              </div>
           </div>
        </div>

        <div className="flex flex-col gap-[6px] ml-0 md:ml-10">
          <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
            <Home size={12} className="text-slate-400" /> Full Address
          </label>
          <textarea 
            rows={2}
            placeholder="Street name, building, apartment, unit..."
            className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] outline-none focus:border-primary w-full shadow-sm resize-none transition-all focus:ring-2 focus:ring-primary/20"
            value={origin.address}
            onChange={(e) => origin.setAddress(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ml-0 md:ml-10">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Country</label>
            <div className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] bg-slate-50 text-slate-500 border-dashed">Indonesia</div>
          </div>
          <div className="flex flex-col gap-[6px] relative">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Postal Code</label>
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search..."
                className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] outline-none focus:border-primary w-full shadow-sm pl-8 transition-all focus:ring-2 focus:ring-primary/20"
                value={origin.postal}
                onChange={handleOriginPostalChange}
              />
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            </div>
            {showOriginSuggestions && originPostalSuggestions.length > 0 && (
              <motion.ul 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-16 z-50 mt-1 w-full min-w-[200px] bg-white border border-[#e2e8f0] rounded-md shadow-xl max-h-60 overflow-auto"
              >
                {originPostalSuggestions.map((s, i) => (
                  <li 
                    key={i}
                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                    onClick={() => selectOriginPostal(s)}
                  >
                    <div className="text-[13px] font-bold text-slate-900">{s.code}</div>
                    <div className="text-[11px] text-slate-500">{s.city}, {s.state}</div>
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center justify-between">
              City
              {confData?.origin === 'high' && (
                <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 font-black tracking-tight">Detected</span>
              )}
              {confData?.origin === 'medium' && (
                <span className="text-[9px] text-primary bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10 font-black tracking-tight">Suggested</span>
              )}
            </label>
            <input 
              readOnly
              type="text" 
              placeholder="Auto-filled"
              className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] bg-slate-50 text-slate-600 outline-none w-full"
              value={origin.city}
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="text-[11px] font-bold text-slate-500 uppercase">State</label>
            <input 
              readOnly
              type="text" 
              placeholder="Auto-filled"
              className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] bg-slate-50 text-slate-600 outline-none w-full"
              value={origin.state}
            />
          </div>
        </div>
      </motion.div>
    )}

      {/* 2. Consignee Details */}
      {(mode === 'both' || mode === 'consignee') && (
        <motion.div 
          whileHover={{ y: -2 }}
          className={cn(
            "bg-white rounded-[12px] border border-[#e2e8f0] p-6 flex flex-col gap-6 shadow-sm overflow-visible hover:shadow-md transition-shadow relative z-10",
            isCompact && "p-0 border-0 shadow-none hover:shadow-none hover:y-0 gap-4"
          )}
        >
          {!isCompact && (
            <div>
              <p className="text-[14px] font-black uppercase tracking-[0.05em] text-slate-800 flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center text-[12px] shadow-sm">2</span>
                Consignee Details
              </p>
              <p className="text-[12px] text-slate-500 mt-1 font-medium italic ml-10">Package destination information.</p>
            </div>
          )}

          <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-5 ml-0", !isCompact && "md:ml-10")}>
           <div className="flex flex-col gap-[6px]">
              <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5 border-none">
                <User size={12} className="text-slate-400" /> Full Name
              </label>
              <input 
                type="text" 
                placeholder="Enter consignee's full name"
                className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] outline-none focus:border-primary w-full shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                value={destination.name}
                onChange={(e) => destination.setName(e.target.value)}
              />
           </div>
           <div className="flex grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <Phone size={12} className="text-slate-400" /> Phone
                </label>
                <input 
                  type="text" 
                  placeholder="Enter phone number"
                  className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] outline-none focus:border-primary w-full shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                  value={destination.phone}
                  onChange={(e) => destination.setPhone(e.target.value)}
                />
              </div>
              <div className="flex flex-col gap-[6px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <Mail size={12} className="text-slate-400" /> Email
                </label>
                <input 
                  type="email" 
                  placeholder="name@email.com"
                  className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] outline-none focus:border-primary w-full shadow-sm transition-all focus:ring-2 focus:ring-primary/20"
                  value={destination.email}
                  onChange={(e) => destination.setEmail(e.target.value)}
                />
              </div>
           </div>
        </div>

        <div className="flex flex-col gap-[6px] ml-0 md:ml-10">
          <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
            <Home size={12} className="text-slate-400" /> Full Address
          </label>
          <textarea 
            rows={2}
            placeholder="Complete street address in destination country..."
            className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] outline-none focus:border-primary w-full shadow-sm resize-none transition-all focus:ring-2 focus:ring-primary/20"
            value={destination.address}
            onChange={(e) => destination.setAddress(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 ml-0 md:ml-10">
          <div className="flex flex-col gap-[6px]">
            <label className="text-[11px] font-bold text-slate-500 uppercase flex items-center justify-between">
              Country
              {confData?.destination === 'high' && (
                <span className="text-[9px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-100 font-black tracking-tight">AI Detected</span>
              )}
            </label>
            <select 
              className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] outline-none focus:border-primary w-full shadow-sm bg-white transition-all focus:ring-2 focus:ring-primary/20"
              value={destination.country}
              onChange={(e) => {
                destination.setCountry(e.target.value);
                destination.setPostal('');
                destination.setCity('');
                destination.setState('');
                destination.setIsRemoteArea(false);
              }}
            >
              <option value="">Select country...</option>
              <optgroup label="Southeast Asia">
                <option value="SG">Singapore</option>
                <option value="MY">Malaysia</option>
                <option value="PH">Philippines</option>
                <option value="TH">Thailand</option>
                <option value="VN">Vietnam</option>
                <option value="BN">Brunei</option>
                <option value="KH">Cambodia</option>
                <option value="LA">Laos</option>
                <option value="MM">Myanmar</option>
                <option value="TL">Timor-Leste</option>
              </optgroup>
              <optgroup label="Other Asia">
                <option value="JP">Japan</option>
                <option value="KR">South Korea</option>
                <option value="HK">Hong Kong</option>
                <option value="CN">China</option>
                <option value="IN">India</option>
                <option value="BD">Bangladesh</option>
                <option value="MV">Maldives</option>
                <option value="NP">Nepal</option>
                <option value="PK">Pakistan</option>
                <option value="LK">Sri Lanka</option>
                <option value="MO">Macau</option>
                <option value="TW">Taiwan</option>
              </optgroup>
              <optgroup label="Australia & Pacific">
                <option value="AU">Australia</option>
                <option value="NZ">New Zealand</option>
                <option value="PG">Papua New Guinea</option>
              </optgroup>
              <optgroup label="Europe">
                <option value="NL">Netherlands</option>
                <option value="BE">Belgium</option>
                <option value="LU">Luxembourg</option>
                <option value="DE">Germany</option>
                <option value="FR">France</option>
                <option value="DK">Denmark</option>
                <option value="IT">Italy</option>
                <option value="MC">Monaco</option>
                <option value="FI">Finland</option>
                <option value="IE">Ireland</option>
                <option value="AT">Austria</option>
                <option value="PT">Portugal</option>
                <option value="ES">Spain</option>
                <option value="SE">Sweden</option>
                <option value="PL">Poland</option>
                <option value="CZ">Czech Republic</option>
                <option value="BG">Bulgaria</option>
                <option value="EE">Estonia</option>
                <option value="GR">Greece</option>
                <option value="HU">Hungary</option>
                <option value="HR">Croatia</option>
                <option value="LV">Latvia</option>
                <option value="LT">Lithuania</option>
                <option value="RO">Romania</option>
                <option value="SI">Slovenia</option>
                <option value="SK">Slovakia</option>
                <option value="TR">Turkey</option>
                <option value="ZA">South Africa</option>
              </optgroup>
              <optgroup label="Middle East">
                <option value="SA">Saudi Arabia</option>
                <option value="EG">Egypt</option>
                <option value="AE">UAE</option>
                <option value="BH">Bahrain</option>
                <option value="JO">Jordan</option>
                <option value="KW">Kuwait</option>
                <option value="OM">Oman</option>
                <option value="QA">Qatar</option>
              </optgroup>
              <optgroup label="Americas">
                <option value="US">USA</option>
                <option value="CA">Canada</option>
                <option value="MX">Mexico</option>
              </optgroup>
            </select>
          </div>
          <div className="flex flex-col gap-[6px] relative">
            <label className="text-[11px] font-bold text-slate-500 uppercase">Postal Code</label>
            <div className="relative">
              <input 
                type="text" 
                disabled={!destination.country}
                placeholder={destination.country ? "Search..." : "Pick country"}
                className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] outline-none focus:border-primary w-full shadow-sm pl-8 disabled:bg-slate-50 disabled:cursor-not-allowed transition-all focus:ring-2 focus:ring-primary/20"
                value={destination.postal}
                onChange={handleDestPostalChange}
              />
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
            </div>
            {showDestSuggestions && destPostalSuggestions.length > 0 && (
              <motion.ul 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-16 z-50 mt-1 w-full min-w-[200px] bg-white border border-[#e2e8f0] rounded-md shadow-xl max-h-60 overflow-auto"
              >
                {destPostalSuggestions.map((s, i) => (
                  <li 
                    key={i}
                    className="px-4 py-2 hover:bg-slate-50 cursor-pointer border-b border-slate-100 last:border-0"
                    onClick={() => selectDestPostal(s)}
                  >
                    <div className="text-[13px] font-bold text-slate-900">{s.code}</div>
                    <div className="text-[11px] text-slate-500">{s.city}, {s.state} {s.isRemote && <span className="text-orange-600 font-bold ml-2">(Remote)</span>}</div>
                  </li>
                ))}
              </motion.ul>
            )}
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="text-[11px] font-bold text-slate-500 uppercase">City</label>
            <input 
              readOnly
              type="text" 
              placeholder="Auto-filled"
              className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] bg-slate-50 text-slate-600 outline-none w-full"
              value={destination.city}
            />
          </div>
          <div className="flex flex-col gap-[6px]">
            <label className="text-[11px] font-bold text-slate-500 uppercase">State</label>
            <input 
              readOnly
              type="text" 
              placeholder="Auto-filled"
              className="px-3 py-2 border border-[#e2e8f0] rounded-lg text-[13px] bg-slate-50 text-slate-600 outline-none w-full"
              value={destination.state}
            />
          </div>
        </div>
      </motion.div>
    )}
    </div>
  );
}
