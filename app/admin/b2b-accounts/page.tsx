'use client';

import { useState } from 'react';
import { Search, Check, X, FileText, Building2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type B2BStatus = 'Pending' | 'Approved' | 'Rejected';

interface B2BAccount {
  id: string;
  companyName: string;
  taxId: string;
  picName: string;
  email: string;
  status: B2BStatus;
  creditLimit: string | null;
  outstanding: string | null;
  dueDate: string | null;
}

const INITIAL_ACCOUNTS: B2BAccount[] = [
  {
    id: 'ACC-101',
    companyName: 'PT. Makmur Sejahtera',
    taxId: '01.234.567.8-012.000',
    picName: 'Budi Santoso',
    email: 'budi@makmur.co.id',
    status: 'Pending',
    creditLimit: null,
    outstanding: null,
    dueDate: null,
  },
  {
    id: 'ACC-098',
    companyName: 'CV. Global Export',
    taxId: '02.444.111.9-001.000',
    picName: 'Andi Wijaya',
    email: 'finance@globalexport.com',
    status: 'Approved',
    creditLimit: 'Rp 50,000,000',
    outstanding: 'Rp 12,450,000',
    dueDate: '14 Days',
  },
  {
    id: 'ACC-082',
    companyName: 'PT. Karya Cipta',
    taxId: '04.555.222.1-023.000',
    picName: 'Siti Aminah',
    email: 'billing@karyacipta.id',
    status: 'Rejected',
    creditLimit: null,
    outstanding: null,
    dueDate: null,
  }
];

export default function AdminB2BAccounts() {
  const [accounts, setAccounts] = useState<B2BAccount[]>(INITIAL_ACCOUNTS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAccounts = accounts.filter(acc => 
    acc.companyName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    acc.taxId.includes(searchQuery) ||
    acc.picName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApprove = (id: string) => {
    toast.success('B2B Application Approved! Credit Limit: Rp 20,000,000 assigned.');
    setAccounts(prev => prev.map(a => {
      if (a.id === id) {
        return { 
          ...a, 
          status: 'Approved', 
          creditLimit: 'Rp 20,000,000', 
          outstanding: 'Rp 0', 
          dueDate: '14 Days' 
        };
      }
      return a;
    }));
  };

  const handleReject = (id: string) => {
    toast.error('B2B Application Rejected.');
    setAccounts(prev => prev.map(a => {
      if (a.id === id) {
        return { ...a, status: 'Rejected' };
      }
      return a;
    }));
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">B2B Credit Accounts</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Review credit applications and manage B2B terms.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search accounts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Company Info</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">PIC & Contact</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Credit Details</th>
                <th className="px-6 py-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredAccounts.map(acc => (
                <tr key={acc.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500">
                        <Building2 size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{acc.companyName}</p>
                        <p className="text-xs text-slate-500 font-medium">Corporate ID: {acc.taxId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <p className="text-sm font-medium text-slate-800">{acc.picName}</p>
                    <p className="text-xs text-slate-500">{acc.email}</p>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2.5 py-1 text-[11px] font-black uppercase tracking-wider rounded-md",
                      acc.status === 'Approved' ? "bg-blue-100 text-blue-700" :
                      acc.status === 'Rejected' ? "bg-red-100 text-red-700" :
                      "bg-slate-200 text-slate-700"
                    )}>
                      {acc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {acc.status === 'Approved' ? (
                      <div>
                        <p className="text-xs font-bold text-slate-500 mb-0.5">Limit: <span className="text-slate-800">{acc.creditLimit}</span></p>
                        <p className="text-xs font-bold text-slate-500">Due: <span className="text-slate-800">{acc.outstanding}</span> <span className="text-orange-500">({acc.dueDate})</span></p>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Not applicable</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    {acc.status === 'Pending' ? (
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleReject(acc.id)}
                          className="w-8 h-8 rounded-lg border border-red-200 text-red-500 flex items-center justify-center hover:bg-red-50 hover:text-red-700 transition-colors"
                          title="Reject"
                        >
                          <X size={16} />
                        </button>
                        <button 
                          onClick={() => handleApprove(acc.id)}
                          className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                          title="Approve"
                        >
                          <Check size={16} />
                        </button>
                      </div>
                    ) : acc.status === 'Approved' ? (
                      <button 
                        className="text-slate-600 bg-slate-100 hover:bg-slate-200 text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors ml-auto"
                      >
                        <FileText size={14} /> View Invoice
                      </button>
                    ) : null}
                  </td>
                </tr>
              ))}
              {filteredAccounts.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-sm font-medium text-slate-500">
                    No accounts found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
