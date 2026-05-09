'use client';

import { Plus, ArrowUpRight, ArrowDownRight, CreditCard, Download } from 'lucide-react';

const MOCK_TRANSACTIONS = [
  { id: 'TRX-98231', type: 'Payment', desc: 'Shipment GORT-2983741', amount: '- Rp 1,020,000', date: 'Oct 21, 2023', status: 'Success', isNegative: true },
  { id: 'TRX-98230', type: 'Top Up', desc: 'Bank Transfer (BCA)', amount: '+ Rp 5,000,000', date: 'Oct 20, 2023', status: 'Success', isNegative: false },
  { id: 'TRX-98229', type: 'Payment', desc: 'Shipment GORT-2983740', amount: '- Rp 900,000', date: 'Oct 19, 2023', status: 'Success', isNegative: true },
  { id: 'TRX-98228', type: 'Payment', desc: 'Shipment GORT-2983739', amount: '- Rp 3,480,000', date: 'Oct 15, 2023', status: 'Success', isNegative: true },
  { id: 'TRX-98227', type: 'Top Up', desc: 'Credit Card (Visa)', amount: '+ Rp 10,000,000', date: 'Oct 01, 2023', status: 'Success', isNegative: false },
];

export default function WalletPage() {
  return (
    <div className="flex-1 overflow-auto bg-gray-50 flex flex-col">
      <div className="p-8 max-w-5xl mx-auto w-full flex-1">
        <div className="mb-8">
          <h1 className="text-[24px] font-black text-slate-800 flex items-center gap-3">
            <span className="w-1.5 h-7 bg-primary rounded-full"></span>
            Goorita Wallet
          </h1>
          <p className="text-slate-500 mt-1 text-[14px] font-medium">Manage your balance and view payment history.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Balance Card */}
          <div className="md:col-span-2 bg-[#F44D4C] rounded-2xl shadow-[0_8px_30px_rgba(244,77,76,0.3)] p-8 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/3 group-hover:scale-110 transition-transform duration-700"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-black opacity-5 rounded-full translate-y-1/2 -translate-x-1/4"></div>
            <div className="relative z-10">
              <p className="text-white/80 font-bold text-[12px] uppercase tracking-widest mb-1">Available Balance</p>
              <h2 className="text-4xl font-black mb-10 tracking-tight">Rp 12,450,000</h2>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-white text-primary font-bold py-3.5 px-6 rounded-xl flex items-center justify-center transition-all hover:bg-slate-50 shadow-sm active:scale-[0.98]">
                  <Plus className="h-5 w-5 mr-2" /> Top Up Balance
                </button>
                <button className="flex-1 bg-white/10 hover:bg-white/20 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center transition-all border border-white/30 backdrop-blur-sm active:scale-[0.98]">
                  <CreditCard className="h-5 w-5 mr-2" /> Link Card
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <p className="text-sm font-medium text-gray-500 flex items-center">
                <ArrowDownRight className="h-4 w-4 mr-1 text-green-500" /> Total Top Up (Oct)
              </p>
              <p className="text-xl font-bold text-gray-900 mt-1">Rp 15,000,000</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <p className="text-sm font-medium text-gray-500 flex items-center">
                <ArrowUpRight className="h-4 w-4 mr-1 text-red-500" /> Total Spent (Oct)
              </p>
              <p className="text-xl font-bold text-gray-900 mt-1">Rp 5,400,000</p>
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
            <button className="text-sm font-medium text-gray-500 hover:text-gray-900 flex items-center">
              <Download className="h-4 w-4 mr-1" /> Download Statement
            </button>
          </div>
          
          <div className="divide-y divide-gray-100">
            {MOCK_TRANSACTIONS.map((trx) => (
              <div key={trx.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-4 flex-shrink-0 ${
                    trx.isNegative ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                  }`}>
                    {trx.isNegative ? <ArrowUpRight className="h-5 w-5" /> : <ArrowDownRight className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{trx.desc}</h4>
                    <p className="text-xs text-gray-500 mt-0.5">{trx.date} • {trx.id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${trx.isNegative ? 'text-gray-900' : 'text-green-600'}`}>
                    {trx.amount}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{trx.status}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
