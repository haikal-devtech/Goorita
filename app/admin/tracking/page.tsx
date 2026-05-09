'use client';

import { useState } from 'react';
import { Search, Map } from 'lucide-react';

export default function AdminTracking() {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setHasSearched(true);
    }
  };

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Tracking</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Trace shipments by AWB or Order ID.</p>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-4">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <input 
              type="text" 
              placeholder="Enter AWB or Order ID"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 pl-10 pr-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
              required
            />
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
          </div>
          <button type="submit" className="bg-primary text-white font-bold px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors shadow-sm">
            Track
          </button>
        </form>

        {hasSearched ? (
          <div className="mt-8">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Timeline for {searchQuery}</h3>
            <div className="relative border-l-2 border-slate-200 ml-4 pl-8 space-y-6">
              <div className="relative">
                <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full bg-slate-200 border-4 border-white" />
                <p className="font-bold text-slate-800">Delivered</p>
                <p className="text-sm text-slate-600 mt-1">Pending delivery to recipient.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full bg-slate-200 border-4 border-white" />
                <p className="font-bold text-slate-800">Dispatched</p>
                <p className="text-sm text-slate-600 mt-1">Pending carrier pick-up.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[41px] top-1 h-5 w-5 rounded-full bg-primary border-4 border-white shadow-sm" />
                <p className="font-bold text-primary">Order Created</p>
                <p className="text-sm text-slate-600 mt-1">Order has been successfully registered in our system.</p>
                <p className="text-xs font-bold text-slate-500 mt-2">Today, 10:45 AM</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-12 mb-8 flex flex-col items-center justify-center text-slate-400">
            <Map size={48} className="mb-4 text-slate-300" />
            <p className="text-sm font-medium">Enter a tracking number to view its history</p>
          </div>
        )}
      </div>
    </>
  );
}
