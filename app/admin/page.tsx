import { FileText, ShoppingCart, CreditCard, Clock, Truck, Printer, Package, CheckCircle2, UserX } from 'lucide-react';

export default function AdminOverview() {
  const KPIS = [
    { label: 'Quotations Today', value: '142', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Confirmed Orders', value: '86', icon: ShoppingCart, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Pending Payment (B2C)', value: '24', icon: CreditCard, color: 'text-orange-500', bg: 'bg-orange-50' },
    { label: 'Pending Credit (B2B)', value: '7', icon: Clock, color: 'text-purple-500', bg: 'bg-purple-50' },
    { label: 'Pickup Tasks Today', value: '53', icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'AWB Generated', value: '79', icon: Printer, color: 'text-slate-700', bg: 'bg-slate-100' },
    { label: 'In Transit', value: '312', icon: Package, color: 'text-primary', bg: 'bg-primary-50' },
    { label: 'Delivered Today', value: '64', icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-50' },
    { label: 'Abandoned Leads', value: '12', icon: UserX, color: 'text-red-500', bg: 'bg-red-50' },
  ];

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Dashboard Overview</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Live operational metrics for today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {KPIS.map((kpi, index) => (
          <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border border-white/20 ${kpi.bg}`}>
                <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
              </div>
            </div>
            <p className="text-[13px] font-bold text-slate-400 uppercase tracking-wider">{kpi.label}</p>
            <p className="text-3xl font-black text-slate-800 mt-1">{kpi.value}</p>
          </div>
        ))}
      </div>
    </>
  );
}
