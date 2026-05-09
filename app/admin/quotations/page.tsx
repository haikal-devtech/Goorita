'use client';

import { useState } from 'react';
import { Search, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminQuotations() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const dummyData = [
    { id: 'QT-001', customer: 'Budi Santoso', route: 'CGK → SIN', service: 'Express', price: 'Rp 850,000', date: 'Today, 10:45 AM', status: 'Sent' },
    { id: 'QT-002', customer: 'PT. Makmur', route: 'CGK → TYO', service: 'Economy', price: 'Rp 4,200,000', date: 'Yesterday', status: 'Converted' },
    { id: 'QT-003', customer: 'Siti Rahma', route: 'CGK → KUL', service: 'Express', price: 'Rp 340,000', date: '2 days ago', status: 'Expired' },
    { id: 'QT-004', customer: 'CV. Jaya', route: 'SUB → SIN', service: 'Standard', price: 'Rp 1,500,000', date: 'Today', status: 'Draft' },
  ];

  const filtered = dummyData.filter(item => {
    const matchesTab = activeTab === 'All' || item.status === activeTab;
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Quotations</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Manage price quotations generated for customers.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {['All', 'Active', 'Expired', 'Converted'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors",
                  activeTab === tab ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search quotes..."
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
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Quote ID</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Route</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Service</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{item.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.route}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{item.price}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-bold rounded-lg",
                      item.status === 'Converted' ? "bg-green-100 text-green-800" :
                      item.status === 'Expired' ? "bg-red-100 text-red-800" :
                      item.status === 'Sent' || item.status === 'Active' ? "bg-blue-100 text-blue-800" :
                      "bg-slate-100 text-slate-800"
                    )}>
                      {item.status}
                    </span>
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
