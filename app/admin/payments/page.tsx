'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminPayments() {
  const [searchQuery, setSearchQuery] = useState('');

  const dummyData = [
    { id: 'PAY-001', orderId: 'ORD-99231', customer: 'Budi Santoso', method: 'Bank Transfer', amount: 'Rp 850,000', status: 'Pending', date: 'Today, 10:45 AM' },
    { id: 'PAY-002', orderId: 'ORD-99230', customer: 'PT. Makmur', method: 'Credit Term', amount: 'Rp 4,200,000', status: 'Paid', date: 'Yesterday' },
    { id: 'PAY-003', orderId: 'ORD-99229', customer: 'Siti Rahma', method: 'Credit Card', amount: 'Rp 340,000', status: 'Paid', date: '2 days ago' },
    { id: 'PAY-004', orderId: 'ORD-99228', customer: 'CV. Jaya', method: 'Virtual Account', amount: 'Rp 1,500,000', status: 'Failed', date: 'Today' },
  ];

  const filtered = dummyData.filter(item => 
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Payments</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Track incoming payments from customers and B2B orders.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-slate-500 mb-2">Total Collected Today</p>
          <p className="text-3xl font-black text-slate-800">Rp 12.4M</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-slate-500 mb-2">Pending Verification</p>
          <p className="text-3xl font-black text-amber-600">Rp 4.2M</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-slate-500 mb-2">Failed / Expired</p>
          <p className="text-3xl font-black text-red-600">Rp 1.5M</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-4">
        <div className="p-4 border-b border-slate-200 flex justify-end items-center bg-slate-50/50">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search payments..."
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
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Payment ID</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Method</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filtered.map(item => (
                <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{item.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{item.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{item.method}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{item.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{item.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-bold rounded-lg",
                      item.status === 'Paid' ? "bg-green-100 text-green-800" :
                      item.status === 'Failed' ? "bg-red-100 text-red-800" :
                      "bg-amber-100 text-amber-800"
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
