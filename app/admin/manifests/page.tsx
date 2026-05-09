'use client';

import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminManifests() {
  const [searchQuery, setSearchQuery] = useState('');

  const dummyData = [
    { id: 'MNF-8001', originHub: 'CGK-Hub1', destCountry: 'Singapore', cutoffTime: 'Today, 20:00', totalShipments: 45, status: 'Open' },
    { id: 'MNF-8002', originHub: 'CGK-Hub1', destCountry: 'Japan', cutoffTime: 'Yesterday, 18:00', totalShipments: 120, status: 'Dispatched' },
    { id: 'MNF-8003', originHub: 'SUB-Hub1', destCountry: 'Malaysia', cutoffTime: 'Today, 14:00', totalShipments: 32, status: 'Closed' },
  ];

  const filtered = dummyData.filter(item => 
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.destCountry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Manifests</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Manage consolidation manifests for linehaul.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-4">
        <div className="p-4 border-b border-slate-200 flex justify-end items-center bg-slate-50/50">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search via Manifest ID..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Manifest ID</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Origin Hub</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Dest Country</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Cutoff Time</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Shipments</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{item.originHub}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{item.destCountry}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{item.cutoffTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{item.totalShipments}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-bold rounded-lg",
                      item.status === 'Dispatched' ? "bg-green-100 text-green-800" :
                      item.status === 'Closed' ? "bg-slate-100 text-slate-800" :
                      "bg-blue-100 text-blue-800"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-slate-400 hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5 inline-flex" title="View Manifest">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
