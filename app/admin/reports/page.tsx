'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AdminReports() {
  const chartData = [
    { day: 'Mon', shipments: 45 },
    { day: 'Tue', shipments: 52 },
    { day: 'Wed', shipments: 38 },
    { day: 'Thu', shipments: 65 },
    { day: 'Fri', shipments: 48 },
    { day: 'Sat', shipments: 20 },
    { day: 'Sun', shipments: 15 },
  ];

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Reports & Analytics</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Key metrics and performance overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-slate-500 mb-2">Revenue This Month</p>
          <p className="text-3xl font-black text-slate-800">Rp 485.2M</p>
          <p className="text-xs font-bold text-green-600 mt-2">+12.5% vs last month</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-slate-500 mb-2">Total Shipments (MTD)</p>
          <p className="text-3xl font-black text-slate-800">1,245</p>
          <p className="text-xs font-bold text-green-600 mt-2">+5.2% vs last month</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-center">
          <p className="text-sm font-bold text-slate-500 mb-2">Avg. Order Value</p>
          <p className="text-3xl font-black text-slate-800">Rp 389K</p>
          <p className="text-xs font-bold text-slate-400 mt-2">Stable</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-6">
        <h2 className="text-lg font-black text-slate-800 tracking-tight mb-6">Shipments (Last 7 Days)</h2>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis 
                dataKey="day" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#64748B', fontWeight: 500 }}
              />
              <Tooltip 
                cursor={{ fill: '#F1F5F9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar 
                dataKey="shipments" 
                fill="#EF4444" 
                radius={[4, 4, 0, 0]}
                barSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
