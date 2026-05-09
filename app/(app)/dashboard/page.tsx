'use client';

import Link from 'next/link';
import { ArrowRight, Package, Truck, Clock, AlertCircle } from 'lucide-react';
import * as motion from 'motion/react-client';

export default function Dashboard() {
  const stats = [
    { name: 'Total Shipments', value: '1,248', icon: Package, change: '+12%', changeType: 'positive' },
    { name: 'In Transit', value: '42', icon: Truck, change: '-2%', changeType: 'negative' },
    { name: 'Action Needed', value: '3', icon: AlertCircle, change: '0%', changeType: 'neutral', color: 'text-orange-600' },
  ];

  return (
    <div className="flex-1 overflow-auto bg-[#f8f9fa] flex flex-col">
      <div className="p-8 max-w-6xl mx-auto w-full">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-[24px] font-black text-slate-800 flex items-center gap-3">
              <span className="w-1.5 h-7 bg-primary rounded-full"></span>
              Welcome back, John
            </h1>
            <p className="text-slate-500 mt-1 text-[14px] font-medium">Manage your global shipments with Indonesia&apos;s leading platform.</p>
          </div>
          <Link 
            href="/shipment/create"
            className="inline-flex items-center justify-center rounded-lg bg-primary px-6 py-3 text-[14px] font-bold text-white hover:bg-primary-600 transition-all duration-200 shadow-[0_4px_14px_0_rgba(244,77,76,0.39)] hover:shadow-[0_6px_20px_rgba(244,77,76,0.23)] hover:-translate-y-0.5"
          >
            Create Shipment
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>

        {/* Wallet Summary */}
        <div className="bg-white rounded-xl border-l-[6px] border-primary shadow-sm p-6 mb-8 flex items-center justify-between group hover:shadow-md transition-shadow">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-400 mb-1 flex items-center gap-1.5">
               Goorita Wallet
            </h2>
            <p className="text-[32px] font-black text-slate-800 tracking-tight">Rp 12,450,000</p>
          </div>
          <Link href="/wallet" className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-50 text-primary hover:bg-primary text-[13px] font-bold rounded-lg transition-all group-hover:px-6">
            Top up balance <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-sm hover:border-primary/30 transition-all group">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center border border-primary-100 group-hover:bg-primary group-hover:text-white transition-colors">
                  <stat.icon className={`h-6 w-6 ${stat.color ? 'text-orange-600 group-hover:text-white' : 'text-primary group-hover:text-white'}`} />
                </div>
                <span className={`text-[12px] font-bold px-2 py-1 rounded bg-slate-50 ${
                  stat.changeType === 'positive' ? 'text-green-600 bg-green-50' : 
                  stat.changeType === 'negative' ? 'text-red-500 bg-red-50' : 'text-slate-500'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">{stat.name}</p>
              <p className="text-[26px] font-black text-slate-800 mt-1">{stat.value}</p>
            </div>
          ))}
        </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-bold text-slate-800 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            </span>
            Recent Shipments
          </h2>
          <Link href="/shipment/history" className="text-[13px] font-bold text-primary hover:text-primary-600 flex items-center gap-1 transition-all hover:gap-2">
            View all shipments <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="bg-white rounded-xl border border-[#e2e8f0] shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-[#f0f2f5]">
            <thead className="bg-[#fcfcfd]">
              <tr>
                <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Tracking ID</th>
                <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Destination</th>
                <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Service</th>
                <th scope="col" className="px-6 py-4 text-left text-[11px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              <tr className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">GORT-2983741</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Singapore, SG</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Express</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    In Transit
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">GORT-2983740</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">New York, USA</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Saver</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    Delivered
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-gray-50 cursor-pointer">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">GORT-2983739</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tokyo, JPN</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Express</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                    Customs Clearance
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </div>
  );
}
