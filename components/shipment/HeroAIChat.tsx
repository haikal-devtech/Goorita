'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import * as motion from 'motion/react-client';
import { Send, Search, Truck, Zap, Mic, MicOff, ArrowRight, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatIDR } from '@/lib/shipping';

export function HeroAIChat() {
  const router = useRouter();
  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [responseType, setResponseType] = useState<'none' | 'question' | 'correction' | 'success'>('none');
  const [correctionText, setCorrectionText] = useState('');
  
  // For result panel
  const [showResultPanel, setShowResultPanel] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  
  // For question responses
  const [answerData, setAnswerData] = useState<{
    estTime: string;
    recommended: string;
    fastest: string;
    cheapest: string;
    confidence: string;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    // Listen for custom event from Get Started button
    const handleOpenQuoteModal = () => {
      router.push('/booking');
    };

    window.addEventListener('openQuoteModal', handleOpenQuoteModal);

    // Initialize speech recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        
        recognitionRef.current.onresult = (event: any) => {
          let transcript = '';
          for (let i = 0; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInputVal(transcript);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          if (event.error === 'not-allowed') {
            setErrorMessage('Microphone access denied. Please click the "View Site Information" lock icon in your browser address bar to allow microphone access for this site.');
          } else if (event.error === 'no-speech') {
            setErrorMessage('No speech detected. Please try again.');
          } else {
            setErrorMessage('An error occurred with speech recognition.');
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }
    
    return () => {
      window.removeEventListener('openQuoteModal', handleOpenQuoteModal);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [router]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setErrorMessage('');
      if (recognitionRef.current) {
        setInputVal(''); 
        recognitionRef.current.start();
        setIsListening(true);
      } else {
        alert("Speech recognition isn't supported in your browser.");
      }
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInputVal(text);
    inputRef.current?.focus();
    submitQuery(text);
  };

  const handleAcceptCorrection = () => {
    setResponseType('none');
    const newText = inputVal.replace(/singapur/i, correctionText);
    setInputVal(newText);
    submitQuery(newText);
  };

  const submitQuery = (query: string) => {
    if (!query.trim()) return;

    setIsProcessing(true);
    setResponseType('none');
    setStatusMessage('Analyzing shipment...');

    // Simulate AI processing delays
    setTimeout(() => {
      setStatusMessage('Optimizing route...');
    }, 600);
    setTimeout(() => {
      setStatusMessage('Finding best option...');
    }, 1200);

    setTimeout(() => {
      setIsProcessing(false);
      const lowerQuery = query.toLowerCase();

      // Robust Parsing Engine with Confidence Levels
      const params = new URLSearchParams();
      params.set('ai_input', query);

      type Confidence = 'high' | 'medium' | 'low';
      const confidences: Record<string, Confidence> = {};

      const setField = (key: string, value: string, confidence: Confidence) => {
        params.set(key, value);
        confidences[key] = confidence;
        params.set(`${key}_conf`, confidence);
      };

      // 1. Dimensions: 15x10x12
      const dimMatch = lowerQuery.match(/(\d+)\s*[x*×]\s*(\d+)\s*[x*×]\s*(\d+)/);
      if (dimMatch) {
        setField('length', dimMatch[1], 'high');
        setField('width', dimMatch[2], 'high');
        setField('height', dimMatch[3], 'high');
      }

      // 2. Weight: 3kg
      const weightMatch = lowerQuery.match(/(\d+(?:\.\d+)?)\s*(?:kg|kilo)/);
      if (weightMatch) {
        setField('weight', weightMatch[1], 'high');
      }

      // 3. Value: $52
      const valueMatch = lowerQuery.match(/(?:\$|usd|val|value)\s*(\d+(?:\.\d+)?)|(\d+(?:\.\d+)?)\s*(?:\$|usd)/);
      if (valueMatch) {
        setField('value_usd', valueMatch[1] || valueMatch[2], 'high');
      }

      // 4. Cities & Countries
      const CITIES = ['jakarta', 'bali', 'bandung', 'surabaya', 'medan', 'yogyakarta', 'semarang', 'makassar', 'denpasar', 'lebak bulus'];
      const COUNTRIES = ['singapore', 'australia', 'tokyo', 'japan', 'uk', 'usa', 'malaysia', 'thailand'];

      CITIES.forEach(city => {
        if (lowerQuery.includes(city)) {
          setField('origin_city', city.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '), 'high');
        }
      });

      COUNTRIES.forEach(country => {
        if (lowerQuery.includes(country)) {
          setField('destination_country', country.charAt(0).toUpperCase() + country.slice(1), 'high');
        }
      });

      // Special case: Overseas (Low confidence destination)
      if (!params.get('destination_country') && (lowerQuery.includes('overseas') || lowerQuery.includes('luar negeri'))) {
        setField('destination_country', 'Global', 'low');
      }

      // 5. Item Types
      const ITEMS = {
        documents: ['doc', 'paper', 'surat', 'file', 'document'],
        goods: ['goods', 'barang', 'box', 'package', 'clothes', 'electronics', 'food', 'baju', 'pakaian', 'fashion', 'gadget', 'phone', 'laptop', 'camera']
      };

      Object.entries(ITEMS).forEach(([key, keywords]) => {
        if (keywords.some(k => lowerQuery.includes(k))) {
          setField('item_type', key.charAt(0).toUpperCase() + key.slice(1), 'high');
        }
      });

    // CONFIDENCE HANDLING -> We now redirect to /booking with parsed data
      const bookingUrl = `/booking?${params.toString()}`;
      
      setResponseType('success');
      
      setTimeout(() => {
        router.push(bookingUrl);
      }, 1000);

    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(inputVal);
  };

  return (
    <div className="w-full flex flex-col items-center gap-6">
      <form 
        onSubmit={handleSubmit}
        className={cn(
          "relative w-full max-w-4xl flex items-center bg-white/10 backdrop-blur-[50px] rounded-[32px] overflow-hidden shadow-2xl border transition-all duration-500 group",
          isProcessing ? "border-primary/50 shadow-[0_0_30px_rgba(244,77,76,0.3)]" : "border-white/10 hover:border-white/20 focus-within:border-primary/50 focus-within:shadow-[0_0_40px_rgba(244,77,76,0.2)]"
        )}
      >
        {/* Glowing Background Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-primary/5 pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity" />
        
        <div className="pl-6 pr-2 py-6 flex items-center justify-center text-primary/80 relative z-10">
          <Zap className="w-6 h-6 animate-pulse" />
        </div>
        
        <div className="flex-1 relative flex items-center">
          <input
            ref={inputRef}
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              if (errorMessage) setErrorMessage('');
            }}
            placeholder="Send a box 15x12x10 cm from Jakarta to Singapore, how long and which service is best?"
            className="w-full bg-transparent border-none outline-none text-white placeholder:text-white/30 text-lg md:text-xl font-medium py-6 px-4 tracking-tight relative z-10"
            disabled={isProcessing}
          />
          {!inputVal && !isProcessing && (
            <div className="absolute left-[18px] top-1/2 -translate-y-1/2 w-[2px] h-6 bg-primary animate-cursor-blink pointer-events-none z-0" />
          )}
        </div>

        <div className="pr-4 flex items-center gap-3 relative z-10">
          {isProcessing ? (
             <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-2xl border border-white/10">
                <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                <span className="text-[13px] font-black text-white/80 tracking-widest uppercase">{statusMessage}</span>
             </div>
          ) : (
            <>
              <button
                type="button"
                onClick={toggleListening}
                className={cn(
                  "p-3 rounded-2xl transition-all",
                  isListening 
                    ? "bg-primary text-white shadow-[0_0_20px_rgba(244,77,76,0.5)] animate-pulse" 
                    : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                )}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="p-3 rounded-2xl bg-primary text-white hover:brightness-110 shadow-lg shadow-primary/20 transition-all disabled:opacity-30 disabled:grayscale group/btn"
              >
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </>
          )}
        </div>
      </form>

      {/* ERROR MESSAGE */}
      {errorMessage && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-primary font-black text-xs uppercase tracking-widest bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-primary/20">
            {errorMessage}
        </motion.div>
      )}

      {/* HINT TEXT */}
      {!isProcessing && responseType === 'none' && (
        <p className="text-white/40 text-[10px] uppercase font-black tracking-[0.3em]">Describe your shipment in one sentence</p>
      )}

      {/* QUICK ACTIONS */}
      {responseType === 'none' && !isProcessing && (
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl px-4">
          <span className="text-white/20 text-[10px] font-black uppercase tracking-widest w-full text-center mb-1">Quick actions</span>
          {['✈ Send Documents', '📦 Send Goods'].map((chip) => (
            <button
              key={chip}
              onClick={() => handleSuggestionClick(chip)}
              className="text-[11px] px-5 py-2.5 rounded-full bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-all font-black uppercase tracking-widest border border-white/5 hover:border-white/20"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* INTERACTIVE RESPONSES (GLASS CARDS) */}
      <div className="w-full max-w-4xl px-4">
        {responseType === 'correction' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 flex items-start gap-5 shadow-2xl"
          >
            <div className="bg-orange-500/20 p-3 rounded-2xl text-orange-400">
              <Search className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-white font-black text-lg tracking-tight">Did you mean <span className="text-orange-400">{correctionText}</span>?</p>
              <p className="text-white/40 text-sm font-medium mt-1">We want to make sure your quote is as accurate as possible.</p>
              <div className="flex items-center gap-3 mt-6">
                 <button onClick={handleAcceptCorrection} className="px-6 py-2.5 bg-white text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-colors flex items-center gap-2">
                    <Check size={14} /> Yes, use this
                 </button>
                 <button onClick={() => setResponseType('none')} className="px-6 py-2.5 bg-white/5 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-colors">
                    Ignore
                 </button>
              </div>
            </div>
          </motion.div>
        )}

        {responseType === 'question' && answerData && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 backdrop-blur-3xl border border-white/10 rounded-[40px] p-8 md:p-10 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
            
            <div className="flex flex-col md:flex-row items-start gap-8">
              <div className="bg-primary/20 p-4 rounded-2xl text-primary shrink-0 relative group">
                <Truck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 bg-green-500/10 text-green-400 border border-green-500/20 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                  <Check className="w-3.5 h-3.5" /> Intelligence Applied
                </div>
                <h4 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-4">
                  {answerData.recommended}
                </h4>
                <p className="text-white/60 text-lg font-medium leading-relaxed italic mb-8">
                  &quot;{answerData.confidence}&quot;
                </p>
                
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">ETA</p>
                    <p className="text-xl font-black text-white">{answerData.estTime}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Alternative</p>
                    <div className="flex items-center gap-2">
                       <Zap className="w-4 h-4 text-secondary" />
                       <p className="text-sm font-black text-white">{answerData.fastest}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-10 flex items-center justify-end">
                   <button 
                    onClick={() => router.push(`/shipment/create?origin=Jakarta&destination=Singapore&ai=true`)}
                    className="px-10 py-4 bg-primary text-white rounded-2xl font-black text-[14px] uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-4"
                   >
                    Proceed to Booking <ArrowRight size={20} />
                   </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {responseType === 'success' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 backdrop-blur-xl border border-green-500/20 rounded-[32px] p-6 flex flex-col items-center gap-4 shadow-2xl w-fit mx-auto"
          >
            <div className="bg-green-500 p-3 rounded-2xl text-white shadow-lg shadow-green-500/20">
              <Check className="w-6 h-6" />
            </div>
            <div className="text-center">
              <p className="text-green-400 font-black text-lg tracking-tight">Shipment Identified!</p>
              <p className="text-white/40 text-sm font-medium mt-1">Check your shipping estimate below.</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
