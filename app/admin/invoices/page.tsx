'use client';

import { useState } from 'react';
import { Search, Download, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminInvoices() {
  const [searchQuery, setSearchQuery] = useState('');

  const dummyData = [
    { id: 'INV-001', company: 'PT. Makmur', amount: 'Rp 4,200,000', issued: '01 May 2026', due: '15 May 2026', status: 'Unpaid' },
    { id: 'INV-002', company: 'CV. Jaya', amount: 'Rp 1,500,000', issued: '20 Apr 2026', due: '04 May 2026', status: 'Overdue' },
    { id: 'INV-003', company: 'PT. Global E-Commerce', amount: 'Rp 12,500,000', issued: '15 Apr 2026', due: '29 Apr 2026', status: 'Paid' },
  ];

  const filtered = dummyData.filter(item => 
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Invoices</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Manage billing for B2B credit accounts.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-4">
        <div className="p-4 border-b border-slate-200 flex justify-end items-center bg-slate-50/50">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search invoices..."
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
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Invoice ID</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Company</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Issued Date</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Due Date</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{item.company}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{item.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{item.issued}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{item.due}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-bold rounded-lg",
                      item.status === 'Paid' ? "bg-green-100 text-green-800" :
                      item.status === 'Overdue' ? "bg-red-100 text-red-800" :
                      "bg-amber-100 text-amber-800"
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-slate-400 hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5 inline-flex" title="Download">
                      <Download size={18} />
                    </button>
                    {item.status !== 'Paid' && (
                      <button className="text-slate-400 hover:text-green-600 transition-colors p-2 rounded-lg hover:bg-green-50 inline-flex ml-1" title="Mark as Paid">
                        <CheckCircle size={18} />
                      </button>
                    )}
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
