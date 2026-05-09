'use client';

import { useState } from 'react';
import { Search, Filter, Eye, ChevronRight, CheckCircle2, Clock, Truck, Package, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'motion/react';

type OrderStatus = 'Pending Payment' | 'Confirmed' | 'Cancelled';
type CustomerType = 'B2C' | 'B2B';

interface OrderEvent {
  title: string;
  timestamp: string;
  completed: boolean;
  active: boolean;
}

interface Order {
  id: string;
  customerName: string;
  customerType: CustomerType;
  status: OrderStatus;
  amount: string;
  createdAt: string;
  events: OrderEvent[];
}

const DUMMY_ORDERS: Order[] = [
  {
    id: 'ORD-99231',
    customerName: 'Budi Santoso',
    customerType: 'B2C',
    status: 'Pending Payment',
    amount: 'Rp 850,000',
    createdAt: 'Today, 10:45 AM',
    events: [
      { title: 'Order Created', timestamp: 'Today, 10:45 AM', completed: true, active: false },
      { title: 'Quotation Generated', timestamp: 'Today, 10:45 AM', completed: true, active: false },
      { title: 'Payment Pending', timestamp: 'Waiting for customer', completed: false, active: true },
      { title: 'Payment Completed', timestamp: '', completed: false, active: false },
      { title: 'Order Confirmed', timestamp: '', completed: false, active: false },
      { title: 'AWB Generated', timestamp: '', completed: false, active: false },
      { title: 'Pickup Assigned', timestamp: '', completed: false, active: false },
    ]
  },
  {
    id: 'ORD-99230',
    customerName: 'PT. Makmur Sejahtera',
    customerType: 'B2B',
    status: 'Confirmed',
    amount: 'Rp 4,200,000',
    createdAt: 'Today, 09:12 AM',
    events: [
      { title: 'Order Created', timestamp: 'Today, 09:12 AM', completed: true, active: false },
      { title: 'Quotation Generated', timestamp: 'Today, 09:13 AM', completed: true, active: false },
      { title: 'Credit Approved', timestamp: 'Today, 09:30 AM', completed: true, active: false },
      { title: 'Order Confirmed', timestamp: 'Today, 09:30 AM', completed: true, active: false },
      { title: 'AWB Generated', timestamp: 'Today, 09:31 AM', completed: true, active: false },
      { title: 'Pickup Assigned', timestamp: 'Driver: Ahmad', completed: false, active: true },
      { title: 'Shipment Scanned', timestamp: '', completed: false, active: false },
      { title: 'Manifest Assigned', timestamp: '', completed: false, active: false },
      { title: 'Dispatched', timestamp: '', completed: false, active: false },
      { title: 'Delivered', timestamp: '', completed: false, active: false },
    ]
  },
  {
    id: 'ORD-99229',
    customerName: 'Siti Rahma',
    customerType: 'B2C',
    status: 'Confirmed',
    amount: 'Rp 340,000',
    createdAt: 'Yesterday, 15:20 PM',
    events: [
      { title: 'Order Created', timestamp: 'Yesterday, 15:20 PM', completed: true, active: false },
      { title: 'Quotation Generated', timestamp: 'Yesterday, 15:20 PM', completed: true, active: false },
      { title: 'Payment Completed', timestamp: 'Yesterday, 15:25 PM', completed: true, active: false },
      { title: 'Order Confirmed', timestamp: 'Yesterday, 15:25 PM', completed: true, active: false },
      { title: 'AWB Generated', timestamp: 'Yesterday, 15:26 PM', completed: true, active: false },
      { title: 'Pickup Assigned', timestamp: 'Yesterday, 16:00 PM', completed: true, active: false },
      { title: 'Shipment Scanned', timestamp: 'Hub: CGK', completed: false, active: true },
      { title: 'Manifest Assigned', timestamp: '', completed: false, active: false },
      { title: 'Dispatched', timestamp: '', completed: false, active: false },
      { title: 'Delivered', timestamp: '', completed: false, active: false },
    ]
  },
  {
    id: 'ORD-99228',
    customerName: 'CV. Maju Jaya',
    customerType: 'B2B',
    status: 'Cancelled',
    amount: 'Rp 12,500,000',
    createdAt: 'Yesterday, 10:00 AM',
    events: [
      { title: 'Order Created', timestamp: 'Yesterday, 10:00 AM', completed: true, active: false },
      { title: 'Quotation Generated', timestamp: 'Yesterday, 10:01 AM', completed: true, active: false },
      { title: 'Credit Rejected', timestamp: 'Yesterday, 14:00 PM', completed: true, active: true },
      { title: 'Order Cancelled', timestamp: 'Yesterday, 14:00 PM', completed: true, active: false },
    ]
  }
];

export default function AdminOrders() {
  const [activeTab, setActiveTab] = useState<'All' | OrderStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filteredOrders = DUMMY_ORDERS.filter(order => {
    const matchesTab = activeTab === 'All' || order.status === activeTab;
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <>
      <div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight">Order Management</h1>
        <p className="text-sm font-medium text-slate-500 mt-1">Track and manage all customer & B2B orders.</p>
      </div>

      {/* Detail Modal/Drawer */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setSelectedOrder(null)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-[101] overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                <div>
                  <h2 className="text-xl font-black text-slate-800">{selectedOrder.id}</h2>
                  <p className="text-sm font-medium text-slate-500">{selectedOrder.customerName}</p>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 mb-6">Event Timeline</h3>
                
                <div className="relative">
                  <div className="absolute left-[15px] top-4 bottom-4 w-0.5 bg-slate-200" />
                  <div className="space-y-8 relative">
                    {selectedOrder.events.map((event, idx) => (
                      <div key={idx} className="relative flex items-start group">
                        <div className="h-8 flex items-center">
                          <span className={cn(
                            "relative z-10 w-8 h-8 flex items-center justify-center bg-white border-2 rounded-full transition-colors",
                            event.active ? "border-primary" : event.completed ? "border-green-500" : "border-slate-300"
                          )}>
                            {event.completed ? (
                              <CheckCircle2 className={cn("h-4 w-4", event.active ? "text-primary" : "text-green-500")} />
                            ) : event.active ? (
                              <span className="h-2 w-2 bg-primary rounded-full animate-pulse" />
                            ) : null}
                          </span>
                        </div>
                        <div className="ml-4 min-w-0 flex-1">
                          <div className={cn("text-sm font-bold mb-0.5", event.active ? "text-primary" : event.completed ? "text-slate-800" : "text-slate-400")}>
                            {event.title}
                          </div>
                          {event.timestamp && (
                            <div className="text-xs text-slate-500 font-medium">{event.timestamp}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
          <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {['All', 'Pending Payment', 'Confirmed', 'Cancelled'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors",
                  activeTab === tab ? "bg-white text-slate-900 shadow-sm border border-slate-200" : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <input 
              type="text" 
              placeholder="Search orders..."
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
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Order ID</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Customer</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest">Created At</th>
                <th className="px-6 py-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {filteredOrders.map(order => (
                <tr 
                  key={order.id} 
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">{order.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-600">{order.customerName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-md bg-slate-100",
                      order.customerType === 'B2B' ? "text-blue-700 bg-blue-50" : "text-amber-700 bg-amber-50"
                    )}>
                      {order.customerType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={cn(
                      "px-2.5 py-1 text-xs font-bold rounded-lg",
                      order.status === 'Confirmed' ? "bg-green-100 text-green-800" :
                      order.status === 'Cancelled' ? "bg-red-100 text-red-800" :
                      "bg-orange-100 text-orange-800"
                    )}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">{order.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 font-medium">{order.createdAt}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <button className="text-slate-400 hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/5 inline-flex">
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-sm font-medium text-slate-500">
                    No orders found matching your criteria.
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
