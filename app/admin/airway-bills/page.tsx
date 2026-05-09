'use client';

import { useState } from 'react';
import { Search, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminAirwayBills() {
  const [searchQuery, setSearchQuery] = useState('');

  const dummyData = [
    { id: 'AWB-1001', shipmentId: 'SHP-5001', generatedAt: 'Today, 10:45 AM', printStatus: 'Printed' },
    { id: 'AWB-1002', shipmentId: 'SHP-5002', generatedAt: 'Today, 11:30 AM', printStatus: 'Not Printed' },
    { id: 'AWB-1003', shipmentId: 'SHP-5003', generatedAt: 'Yesterday, 14:20 PM', printStatus: 'Printed' },
  ];

  const filtered = dummyData.filter(item => 
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.shipmentId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Airway Bills</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Manage and print airway bills.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-4">
        <div className="p-4 border-b border-slate-200 flex justify-end items-center bg-slate-50/50">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search via AWB..."
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
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">AWB Number</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Shipment ID</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Generated At</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Print Status</th>
                <th className="px-6 py-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{item.shipmentId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{item.generatedAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-bold rounded-lg",
                      item.printStatus === 'Printed' ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
                    )}>
                      {item.printStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-slate-400 hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5 inline-flex" title="Print AWB">
                      <Printer size={18} />
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
