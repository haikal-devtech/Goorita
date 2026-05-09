'use client';

import { useState, useRef, useEffect } from 'react';
import * as motion from 'motion/react-client';
import { Send, Wand2, ArrowRight, X, Check, Search, Truck, Zap, Mic, MicOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatIDR } from '@/lib/shipping';

interface AIChatInputProps {
  onAutoFill: (data: any) => void;
  className?: string;
}

export function AIChatInput({ onAutoFill, className }: AIChatInputProps) {
  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [responseType, setResponseType] = useState<'none' | 'question' | 'correction' | 'success'>('none');
  const [correctionText, setCorrectionText] = useState('');
  
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
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setErrorMessage('');
      if (recognitionRef.current) {
        setInputVal(''); // Clear input on new listening
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
  };

  const handleAcceptCorrection = () => {
    setResponseType('none');
    setInputVal((prev) => prev.replace(/singapur/i, correctionText));
    submitQuery(inputVal.replace(/singapur/i, correctionText));
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

      // Detection logic:
      if (lowerQuery.includes('singapur') || (lowerQuery.includes('singapore') && !lowerQuery.includes('singapore, sg'))) {
        // Trigger smart correction
        setResponseType('correction');
        setCorrectionText('Singapore, SG');
      } 
      else if (lowerQuery.includes('how long') || lowerQuery.includes('which service') || lowerQuery.includes('best') || lowerQuery.includes('cost')) {
        // Trigger question response
        setResponseType('question');
        setAnswerData({
          estTime: '3-5 business days',
          recommended: 'Goorita Saver',
          cheapest: formatIDR(450000), // mock price
          fastest: '1-2 business days with Air Express',
          confidence: 'Based on your package size and destination, we recommend Saver as the best balance of speed and cost.'
        });
      }
      else {
        // Trigger instruction / autofill
        setResponseType('success');
        onAutoFill({
          // We'd parse this, but for demo we just hardcode a smart fill
          originCity: 'Jakarta Selatan',
          destCity: (lowerQuery.includes('singapore') || lowerQuery.includes('singapur')) ? 'Singapore, SG' : 'San Francisco',
          // ... other fields handled by the parent
        });
        
        setTimeout(() => setResponseType('none'), 3000);
      }
    }, 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitQuery(inputVal);
  };

  return (
    <div className={cn("w-full flex flex-col gap-4", className)}>
      <form 
        onSubmit={handleSubmit}
        className={cn(
          "relative flex items-center bg-white rounded-2xl shadow-sm border transition-all duration-300",
          isProcessing ? "border-primary/50 shadow-[0_0_15px_rgba(244,77,76,0.15)] ring-4 ring-primary/5" : "border-slate-200 hover:border-slate-300 focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/10"
        )}
      >
        <div className="pl-5 pr-2 py-4 flex items-center justify-center text-primary/80">
          <Zap className="w-5 h-5" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
            if (errorMessage) setErrorMessage('');
          }}
          placeholder="Send a box 15x12x10 cm from Jakarta to Singapore, how long and which service is best?"
          className="flex-1 bg-transparent border-none outline-none text-slate-800 placeholder:text-slate-400 text-[15px] font-medium py-4 px-2 tracking-tight"
          disabled={isProcessing}
        />

        <div className="pr-3 flex items-center gap-2">
          {isProcessing ? (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
              <div className="w-3.5 h-3.5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
              <span className="text-[12px] font-bold text-primary animate-pulse">{statusMessage}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleListening}
                className={cn(
                  "p-2.5 rounded-xl transition-colors group",
                  isListening 
                    ? "bg-red-100 text-red-600 hover:bg-red-200 animate-pulse" 
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                )}
                title={isListening ? "Stop listening" : "Start speaking"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
              <button
                type="submit"
                disabled={!inputVal.trim()}
                className="p-2.5 rounded-xl bg-slate-900 text-white hover:bg-primary transition-colors disabled:opacity-50 disabled:bg-slate-200 disabled:text-slate-400 group"
              >
                <Send className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </form>
      
      {/* Error Message */}
      {errorMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[12px] text-red-500 font-bold px-1"
        >
          {errorMessage}
        </motion.div>
      )}

      {/* Suggestion Chips */}
      {responseType === 'none' && !isProcessing && (
        <div className="flex flex-wrap items-center gap-2 px-1">
          <span className="text-[12px] font-bold text-slate-500 mr-2">Quick actions:</span>
          {['Send documents to Singapore', 'Send clothes', 'Send electronics'].map((chip) => (
            <button
              key={chip}
              onClick={() => handleSuggestionClick(chip)}
              className="text-[12px] px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 hover:bg-primary/10 hover:text-primary transition-colors font-medium border border-slate-200 hover:border-primary/20"
            >
              {chip}
            </button>
          ))}
        </div>
      )}

      {/* Correction Card */}
      {responseType === 'correction' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3 shadow-sm"
        >
          <div className="bg-orange-100 p-2 rounded-lg text-orange-600 shrink-0">
            <Search className="w-4 h-4" />
          </div>
          <div className="flex-1 pt-0.5">
            <p className="text-[14px] text-orange-900 font-medium">
              Did you mean <span className="font-black">{correctionText}</span>?
            </p>
            <p className="text-[12px] text-orange-700/80 mt-1">We couldn&apos;t find an exact match for the destination you typed.</p>
            <div className="flex items-center gap-2 mt-3">
              <button 
                onClick={handleAcceptCorrection}
                className="text-[12px] font-bold bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" /> Yes, use this
              </button>
              <button 
                onClick={() => setResponseType('none')}
                className="text-[12px] font-bold text-orange-700 hover:bg-orange-100 px-3 py-1.5 rounded-lg transition-colors"
              >
                Ignore
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Question Answer Card */}
      {responseType === 'question' && answerData && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-[#e2e8f0] rounded-xl p-5 shadow-sm relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 p-2.5 rounded-xl text-primary shrink-0 relative">
              <Truck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider mb-2">
                <Check className="w-3 h-3" /> Best Value
              </div>
              <h4 className="text-[16px] font-black text-slate-900">
                {answerData.recommended}
              </h4>
              <p className="text-[13px] text-slate-500 mt-1 font-medium italic">
                &quot;{answerData.confidence}&quot;
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-5 pt-5 border-t border-slate-100">
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Est. Time</p>
                  <p className="text-[14px] font-bold text-slate-800 mt-1">{answerData.estTime}</p>
                </div>
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Alternative</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <Zap className="w-3.5 h-3.5 text-orange-500" />
                    <p className="text-[13px] font-bold text-slate-800">{answerData.fastest}</p>
                  </div>
                </div>
              </div>

              <div className="mt-5 flex items-center justify-end">
                <button
                  onClick={() => {
                    setResponseType('none');
                    onAutoFill({ 
                      originCity: 'Jakarta Selatan', 
                      destCity: 'Singapore, SG' 
                    });
                  }}
                  className="text-[13px] font-bold bg-primary text-white px-4 py-2 rounded-lg shadow-sm hover:bg-primary-600 transition-colors flex items-center gap-2"
                >
                  Start Shipment <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Success Auto-fill Card */}
      {responseType === 'success' && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center gap-3 shadow-sm inline-flex self-start"
        >
          <div className="bg-green-100 p-1.5 rounded-lg text-green-600">
            <Check className="w-4 h-4" />
          </div>
          <p className="text-[13px] text-green-800 font-bold pr-2">
            Details auto-filled! You can review and edit them below.
          </p>
        </motion.div>
      )}
    </div>
  );
}
