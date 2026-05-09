'use client';

import { useState } from 'react';
import { Search, MapPin, CheckCircle2, Clock, Package } from 'lucide-react';
import { cn } from '@/lib/utils';

const MOCK_EVENTS = [
  { id: 1, status: 'Out for Delivery', location: 'Singapore, SG', date: 'Oct 24, 2023', time: '08:45 AM', completed: false, current: true },
  { id: 2, status: 'Customs Clearance Completed', location: 'Singapore, SG', date: 'Oct 23, 2023', time: '14:20 PM', completed: true, current: false },
  { id: 3, status: 'Arrived at Destination Hub', location: 'Singapore, SG', date: 'Oct 23, 2023', time: '09:15 AM', completed: true, current: false },
  { id: 4, status: 'In Transit', location: 'Jakarta, ID', date: 'Oct 22, 2023', time: '18:30 PM', completed: true, current: false },
  { id: 5, status: 'Picked Up', location: 'Jakarta, ID', date: 'Oct 22, 2023', time: '10:00 AM', completed: true, current: false },
  { id: 6, status: 'Order Created', location: 'Online', date: 'Oct 21, 2023', time: '15:42 PM', completed: true, current: false },
];

export default function TrackingPage() {
  const [trackingId, setTrackingId] = useState('GORT-2983741');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    // Simulate network request
    setTimeout(() => {
      setIsSearching(false);
      setShowResults(true);
    }, 800);
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-50 flex flex-col">
      <div className="p-8 max-w-4xl mx-auto w-full flex-1">
        <div className="mb-8">
          <h1 className="text-[24px] font-black text-slate-800 flex items-center gap-3">
            <span className="w-1.5 h-7 bg-primary rounded-full"></span>
            Track Shipment
          </h1>
          <p className="text-slate-500 mt-1 text-[14px] font-medium">Enter your tracking ID to see real-time updates.</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8 hover:border-primary/20 transition-all">
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="e.g. GORT-2983741"
                className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
                value={trackingId}
                onChange={(e) => setTrackingId(e.target.value)}
                required
              />
              <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
            </div>
            <button 
              type="submit"
              disabled={isSearching}
              className="rounded-lg bg-primary px-8 py-3 text-sm font-bold text-white shadow-[0_4px_10px_rgba(244,77,76,0.3)] hover:bg-primary-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed hidden sm:block"
            >
              {isSearching ? 'Tracking...' : 'Track'}
            </button>
          </form>
        </div>

        {showResults && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 md:p-10 animate-in fade-in duration-500 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -mr-16 -mt-16"></div>
            <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-gray-100 pb-8 mb-8 relative z-10">
              <div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">Current Shipment ID</p>
                <h2 className="text-3xl font-black text-slate-800 tracking-tight">{trackingId}</h2>
              </div>
              <div className="mt-4 md:mt-0 px-5 py-2 bg-yellow-50 border border-yellow-200 rounded-full inline-flex items-center self-start">
                <Clock className="h-4 w-4 text-yellow-600 mr-2" />
                <span className="text-[13px] font-bold text-yellow-800">In Transit</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin className="h-5 w-5 text-gray-500" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Origin</p>
                  <p className="text-sm font-semibold text-gray-900">Jakarta, Indonesia</p>
                  <p className="text-sm text-gray-600">PT. Export Sukses</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-10 h-10 rounded-full bg-primary-50 flex items-center justify-center mr-4 flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-1">Destination</p>
                  <p className="text-sm font-semibold text-gray-900">Singapore</p>
                  <p className="text-sm text-gray-600">Tech Solutions Pte Ltd</p>
                </div>
              </div>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-4 bottom-4 w-0.5 bg-gray-200" aria-hidden="true"></div>

              <div className="space-y-8 relative">
                {MOCK_EVENTS.map((event) => (
                  <div key={event.id} className="relative flex items-start group">
                    <div className="h-9 flex items-center">
                      <span className={cn(
                        "relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 rounded-full",
                        event.current ? "border-primary" : event.completed ? "border-green-500" : "border-gray-300"
                      )}>
                        {event.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : event.current ? (
                          <span className="h-2.5 w-2.5 bg-primary rounded-full animate-pulse" />
                        ) : null}
                      </span>
                    </div>
                    <div className="ml-4 min-w-0 flex-1">
                      <div className="text-sm font-medium text-gray-900 mb-1">{event.status}</div>
                      <div className="text-sm text-gray-500 mb-1">{event.location}</div>
                      <div className="text-xs text-gray-400">{event.date} • {event.time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
          </div>
        )}
      </div>
    </div>
  );
}
