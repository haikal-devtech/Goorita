'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('General');

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">System Settings</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Configure platform defaults and integrations.</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row mt-4 min-h-[500px]">
        {/* Settings Sidebar */}
        <div className="w-full md:w-64 border-r border-slate-200 bg-slate-50 p-4">
          <nav className="flex flex-row md:flex-col space-x-2 md:space-x-0 md:space-y-1 overflow-x-auto md:overflow-visible">
            {['General', 'Shipping Rates', 'Notifications', 'Integrations', 'Users'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-3 py-2.5 rounded-lg text-sm font-bold whitespace-nowrap text-left transition-colors",
                  activeTab === tab 
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200" 
                    : "text-slate-500 hover:bg-slate-200 hover:text-slate-700 border border-transparent"
                )}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="flex-1 p-6 md:p-8">
          {activeTab === 'General' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-lg font-black text-slate-800 tracking-tight border-b border-slate-100 pb-2">General Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Company Name</label>
                  <input type="text" defaultValue="Goorita Send" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Support Email</label>
                  <input type="email" defaultValue="support@goorita.com" className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm" />
                </div>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">Default Currency</label>
                  <select className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm bg-white">
                    <option>IDR - Indonesian Rupiah</option>
                    <option>USD - US Dollar</option>
                  </select>
                </div>
              </div>
              
              <div className="pt-4">
                <button type="button" className="bg-primary text-white font-bold px-6 py-2 rounded-lg text-sm hover:bg-primary/90 transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'Shipping Rates' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h2 className="text-lg font-black text-slate-800 tracking-tight">Shipping Rates & ETA Management</h2>
                <button className="text-xs font-bold bg-primary text-white px-3 py-1.5 rounded-lg shadow-sm">Add New Zone</button>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-lg">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="p-3 text-[10px] font-black uppercase text-slate-400">Zone</th>
                      <th className="p-3 text-[10px] font-black uppercase text-slate-400 text-center">Saver Rate/kg</th>
                      <th className="p-3 text-[10px] font-black uppercase text-slate-400 text-center">Saver ETA</th>
                      <th className="p-3 text-[10px] font-black uppercase text-slate-400 text-center">Express Rate/kg</th>
                      <th className="p-3 text-[10px] font-black uppercase text-slate-400 text-center">Express ETA</th>
                      <th className="p-3 text-[10px] font-black uppercase text-slate-400 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { zone: 'Zone A (SG, MY)', saver: 45000, saverEta: '3-5 days', express: 85000, expressEta: '1-2 days' },
                      { zone: 'Zone B (JP, KR)', saver: 75000, saverEta: '4-6 days', express: 145000, expressEta: '2-3 days' },
                      { zone: 'Zone C (AU, NZ)', saver: 110000, saverEta: '5-7 days', express: 190000, expressEta: '3-4 days' },
                      { zone: 'Zone D (US, CA)', saver: 180000, saverEta: '7-10 days', express: 320000, expressEta: '4-5 days' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3 text-[13px] font-bold text-slate-700">{row.zone}</td>
                        <td className="p-3 text-center">
                          <input type="text" defaultValue={row.saver} className="w-16 text-center border rounded px-1 py-0.5 text-xs font-medium" />
                        </td>
                        <td className="p-3 text-center">
                          <input type="text" defaultValue={row.saverEta} className="w-20 text-center border rounded px-1 py-0.5 text-xs font-medium" />
                        </td>
                        <td className="p-3 text-center">
                          <input type="text" defaultValue={row.express} className="w-16 text-center border rounded px-1 py-0.5 text-xs font-medium" />
                        </td>
                        <td className="p-3 text-center">
                          <input type="text" defaultValue={row.expressEta} className="w-20 text-center border rounded px-1 py-0.5 text-xs font-medium" />
                        </td>
                        <td className="p-3 text-right">
                          <button className="text-[10px] font-black text-primary hover:underline bg-primary/5 px-2 py-1 rounded">SAVE</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg flex gap-3">
                <Info className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                <p className="text-xs text-blue-800 font-medium leading-relaxed">
                  Changes to rates and ETA will be applied immediately to the customer-facing booking engine.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-6 max-w-2xl">
              <h2 className="text-lg font-black text-slate-800 tracking-tight border-b border-slate-100 pb-2">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Order Confirmations</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Send email when a new order is received.</p>
                  </div>
                  <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full transition-transform"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-slate-50">
                  <div>
                    <h3 className="font-bold text-slate-800 text-sm">Failed Payments</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Alert admins on payment failure.</p>
                  </div>
                  <div className="h-6 w-11 bg-slate-300 rounded-full relative cursor-pointer">
                    <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition-transform"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(activeTab === 'Integrations' || activeTab === 'Users') && (
            <div className="flex flex-col items-center justify-center h-48 text-slate-400">
              <p className="text-sm font-medium">This section is currently under development.</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
