'use client';

import { useState } from 'react';
import { Search, Mail, Zap, Send, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isPromoting, setIsPromoting] = useState(false);
  const [promoForm, setPromoForm] = useState({ subject: '', message: '' });
  const [automations, setAutomations] = useState({
    emailOnDelivery: true,
    emailOnPickup: false,
    welcomeEmail: true
  });

  const dummyData = [
    { name: 'PT. Makmur', type: 'B2B', totalOrders: 42, spent: 'Rp 142.5M', lastOrder: 'Yesterday', status: 'Active' },
    { name: 'CV. Jaya', type: 'B2B', totalOrders: 18, spent: 'Rp 45.2M', lastOrder: '2 weeks ago', status: 'Active' },
    { name: 'Budi Santoso', type: 'B2C', totalOrders: 3, spent: 'Rp 1.2M', lastOrder: 'Today', status: 'Active' },
    { name: 'Ahmad Susanto', type: 'B2C', totalOrders: 1, spent: 'Rp 0', lastOrder: '1 month ago', status: 'Inactive' },
  ];

  const filtered = dummyData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Customers (CRM)</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Manage B2B partners and B2C clients.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col mt-4">
        <div className="p-4 border-b border-slate-200 flex justify-end items-center bg-slate-50/50">
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search customers..."
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
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer Name</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Orders</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Total Spent</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Last Order</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filtered.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{item.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md",
                      item.type === 'B2B' ? "bg-blue-50 text-blue-700" : "bg-amber-50 text-amber-700"
                    )}>
                      {item.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{item.totalOrders}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{item.spent}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{item.lastOrder}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-bold rounded-lg",
                      item.status === 'Active' ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-600"
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

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Automations */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-black text-slate-800 tracking-tight">CRM Automations</h2>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Email on Delivered</p>
                <p className="text-xs text-slate-500">Automatically notify customers when shipment arrives.</p>
              </div>
              <button 
                onClick={() => setAutomations(prev => ({ ...prev, emailOnDelivery: !prev.emailOnDelivery }))}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  automations.emailOnDelivery ? "bg-primary" : "bg-slate-300"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  automations.emailOnDelivery ? "left-7" : "left-1"
                )} />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 border border-slate-100">
              <div>
                <p className="font-bold text-slate-800">Welcome Promotion</p>
                <p className="text-xs text-slate-500">Send 10% discount code to new registrants.</p>
              </div>
              <button 
                onClick={() => setAutomations(prev => ({ ...prev, welcomeEmail: !prev.welcomeEmail }))}
                className={cn(
                  "w-12 h-6 rounded-full transition-colors relative",
                  automations.welcomeEmail ? "bg-primary" : "bg-slate-300"
                )}
              >
                <div className={cn(
                  "absolute top-1 w-4 h-4 bg-white rounded-full transition-all",
                  automations.welcomeEmail ? "left-7" : "left-1"
                )} />
              </button>
            </div>
          </div>
        </div>

        {/* Promotions */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <Mail className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Send Promotion</h2>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 block">Email Subject</label>
              <input 
                type="text" 
                placeholder="e.g. Special Eid Sale 15% OFF"
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
                value={promoForm.subject}
                onChange={e => setPromoForm(prev => ({ ...prev, subject: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1.5 block">Message Body</label>
              <textarea 
                rows={3}
                placeholder="Write your promotional message here..."
                className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none resize-none"
                value={promoForm.message}
                onChange={e => setPromoForm(prev => ({ ...prev, message: e.target.value }))}
              />
            </div>
            <button 
              disabled={isPromoting || !promoForm.subject || !promoForm.message}
              onClick={() => {
                setIsPromoting(true);
                setTimeout(() => {
                  toast.success("Promotion sent to all active customers!");
                  setPromoForm({ subject: '', message: '' });
                  setIsPromoting(false);
                }, 1500);
              }}
              className="w-full bg-slate-900 text-white font-bold py-2.5 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors disabled:opacity-50"
            >
              {isPromoting ? "Sending..." : <><Send size={16} /> Send to All Customers</>}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-black text-slate-800 tracking-tight mb-4">Abandoned Leads</h2>
        <div className="bg-amber-50 rounded-xl border border-amber-100 p-6 flex items-center justify-between">
          <div>
            <p className="font-bold text-amber-900">Follow up required</p>
            <p className="text-sm font-medium text-amber-700 mt-1">12 users created quotes today but did not complete payment.</p>
          </div>
          <button className="bg-white border border-amber-200 text-amber-800 font-bold px-4 py-2 rounded-lg text-sm hover:bg-amber-100 transition-colors">
            View Leads
          </button>
        </div>
      </div>
    </>
  );
}
