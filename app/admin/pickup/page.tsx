'use client';

import { useState } from 'react';
import { Search, MapPin, Truck, ScanLine, CheckCircle2, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type PickupStatus = 'Assigned' | 'Scanned' | 'Dispatched';

interface PickupTask {
  id: string;
  orderId: string;
  driverId: string;
  driverName: string;
  pickupAddress: string;
  customerName: string;
  status: PickupStatus;
  scheduledAt: string;
}

const INITIAL_TASKS: PickupTask[] = [
  {
    id: 'TSK-1001',
    orderId: 'ORD-99230',
    driverId: 'DRV-042',
    driverName: 'Ahmad Supriyadi',
    customerName: 'PT. Makmur Sejahtera',
    pickupAddress: 'Jl. Sudirman Kav. 21, Jakarta Selatan',
    status: 'Assigned',
    scheduledAt: '13:00 - 15:00',
  },
  {
    id: 'TSK-1002',
    orderId: 'ORD-99229',
    driverId: 'DRV-018',
    driverName: 'Budi Hartono',
    customerName: 'Siti Rahma',
    pickupAddress: 'Perumahan Indah Blok C/12, Bekasi',
    status: 'Scanned',
    scheduledAt: '10:00 - 12:00',
  },
  {
    id: 'TSK-1003',
    orderId: 'ORD-99150',
    driverId: 'DRV-091',
    driverName: 'Ricky Martin',
    customerName: 'CV. Global Export',
    pickupAddress: 'Kawasan Industri Pulo Gadung, Jakarta Timur',
    status: 'Dispatched',
    scheduledAt: '08:00 - 10:00',
  }
];

export default function AdminPickup() {
  const [tasks, setTasks] = useState<PickupTask[]>(INITIAL_TASKS);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(t => 
    t.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.driverName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.customerName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleScan = (taskId: string) => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1500)),
      {
        loading: 'Simulating scanner integration...',
        success: () => {
          setTasks(prev => prev.map(t => {
            if (t.id === taskId) {
              return { ...t, status: 'Scanned' };
            }
            return t;
          }));
          return 'Package Scanned! AWB Generated & Manifest Assigned.';
        },
        error: 'Scan failed'
      }
    );
  };

  const handleDispatch = (taskId: string) => {
    toast.success('Driver dispatched to hub!');
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: 'Dispatched' };
      }
      return t;
    }));
  };

  return (
    <>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Pickup Operations</h1>
          <p className="text-sm font-medium text-slate-500 mt-1">Manage driver assignments and package scans.</p>
        </div>
        <div className="relative w-full sm:w-64">
          <input 
            type="text" 
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary shadow-sm"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredTasks.map(task => (
          <div key={task.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col hover:border-primary/30 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-1">{task.id}</p>
                <h3 className="text-lg font-bold text-slate-800">Order: {task.orderId}</h3>
              </div>
              <span className={cn(
                "px-3 py-1 text-xs font-bold rounded-lg border",
                task.status === 'Assigned' ? "bg-orange-50 text-orange-700 border-orange-200" :
                task.status === 'Scanned' ? "bg-blue-50 text-blue-700 border-blue-200" :
                "bg-green-50 text-green-700 border-green-200"
              )}>
                {task.status}
              </span>
            </div>

            <div className="space-y-4 mb-6 flex-1">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Truck size={14} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-0.5">Driver</p>
                  <p className="text-sm font-medium text-slate-800">{task.driverName} <span className="text-slate-400 italic">({task.driverId})</span></p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin size={14} className="text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 mb-0.5">Pickup Details</p>
                  <p className="text-sm font-medium text-slate-800">{task.customerName}</p>
                  <p className="text-sm text-slate-500">{task.pickupAddress}</p>
                  <p className="text-xs font-bold mt-1 text-slate-400 bg-slate-100 inline-block px-2 py-0.5 rounded">Schedule: {task.scheduledAt}</p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              {task.status === 'Assigned' && (
                <button 
                  onClick={() => handleScan(task.id)}
                  className="flex-1 bg-slate-900 text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors active:scale-95"
                >
                  <ScanLine size={16} /> Simulate Scan
                </button>
              )}
              {task.status === 'Scanned' && (
                <button 
                  onClick={() => handleDispatch(task.id)}
                  className="flex-1 bg-primary text-white py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 hover:bg-primary-600 transition-colors active:scale-95 shadow-[0_4px_10px_rgba(244,77,76,0.3)]"
                >
                  <Truck size={16} /> Dispatch to Hub
                </button>
              )}
              {task.status === 'Dispatched' && (
                <div className="flex-1 bg-green-50 text-green-700 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center gap-2 border border-green-200">
                  <CheckCircle2 size={16} /> On the way to Hub
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      
      {filteredTasks.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center flex flex-col items-center justify-center">
          <AlertCircle size={48} className="text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-700 mb-1">No tasks found</h3>
          <p className="text-sm text-slate-500 font-medium">Try adjusting your search criteria.</p>
        </div>
      )}
    </>
  );
}
