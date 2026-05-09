'use client';

import { useState } from 'react';
import { Search, MoreHorizontal, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminShipments() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [shipments, setShipments] = useState([
    { id: 'AWB-1001', orderId: 'ORD-99230', origin: 'Jakarta', dest: 'Singapore', service: 'Express', weight: '12 kg', status: 'In Transit' },
    { id: 'AWB-1002', orderId: 'ORD-99229', origin: 'Surabaya', dest: 'Tokyo', service: 'Economy', weight: '5 kg', status: 'Delivered' },
    { id: 'AWB-1003', orderId: 'ORD-99231', origin: 'Jakarta', dest: 'Kuala Lumpur', service: 'Express', weight: '2 kg', status: 'Created' },
  ]);

  const updateStatus = (id: string, newStatus: string) => {
    setShipments(prev => prev.map(s => {
      if (s.id === id) {
        if (newStatus === 'Delivered') {
          toast.success(`Automation: Delivery email sent for ${id}`, {
            icon: <CheckCircle2 className="text-green-500" />
          });
        }
        return { ...s, status: newStatus };
      }
      return s;
    }));
  };

  const filtered = shipments.filter(item => {
    const matchesTab = activeTab === 'All' || item.status === activeTab;
    const matchesSearch = item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.orderId.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Shipments</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Monitor all active and completed shipments.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-4">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {['All', 'Created', 'In Transit', 'Delivered'].map(tab => (
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
              placeholder="Search via AWB or Order ID..."
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
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">AWB</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Origin</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Destination</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Service</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Weight</th>
                 <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{item.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.origin}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.dest}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.service}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{item.weight}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-bold rounded-lg",
                      item.status === 'Delivered' ? "bg-green-100 text-green-800" :
                      item.status === 'In Transit' ? "bg-blue-100 text-blue-800" :
                      "bg-amber-100 text-amber-800"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <select 
                      className="text-xs font-bold border rounded p-1"
                      value={item.status}
                      onChange={(e) => updateStatus(item.id, e.target.value)}
                    >
                      <option value="Created">Created</option>
                      <option value="In Transit">In Transit</option>
                      <option value="Delivered">Delivered</option>
                    </select>
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
