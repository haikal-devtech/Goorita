'use client';

import { Search, Filter, Download, Printer, Eye, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { AWBModal } from '@/components/shipment/AWBModal';
import { PaymentGateway } from '@/components/shipment/PaymentGateway';
import { ShipmentHistoryItem } from '@/types/shipping';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const MOCK_HISTORY: (ShipmentHistoryItem & { dest: string })[] = [
  { 
    id: 'GORT-2983741', 
    date: 'Oct 21, 2023', 
    customerType: 'B2C',
    b2bStatus: 'None',
    dest: 'Singapore, SG', 
    service: 'Express', 
    items: 2, 
    actualWeight: 10.5,
    chargeableWeight: 12,
    price: 'Rp 980,000', 
    insurance: 'Rp 40,000',
    total: 'Rp 1,020,000',
    status: 'In Transit', 
    statusColor: 'bg-yellow-100 text-yellow-800',
    paymentStatus: 'Paid',
    paymentMethod: 'Wallet',
    shipper: {
      name: 'John Doe',
      street: 'Jl. Kemang Raya No. 12',
      city: 'Jakarta South',
      state: 'DKI Jakarta',
      zip: '12730',
      country: 'Indonesia',
      phone: '+62 812 3456 7890'
    },
    consignee: {
      name: 'Jane Smith',
      street: '123 Orchard Road, #05-12',
      city: 'Singapore',
      state: 'Singapore',
      zip: '238823',
      country: 'Singapore',
      phone: '+65 9123 4567'
    }
  },
  { 
    id: 'GORT-2983740', 
    date: 'Oct 19, 2023', 
    customerType: 'B2B',
    b2bStatus: 'Approved',
    dest: 'New York, USA', 
    service: 'Saver', 
    items: 1, 
    actualWeight: 4.2,
    chargeableWeight: 5,
    price: 'Rp 850,000', 
    insurance: 'Rp 50,000',
    total: 'Rp 900,000',
    status: 'Delivered', 
    statusColor: 'bg-green-100 text-green-800',
    paymentStatus: 'Pending Payment',
    paymentMethod: 'Credit Terms',
    shipper: {
      name: 'PT. Export Sukses',
      street: 'Jl. Kemang Raya No. 12',
      city: 'Jakarta South',
      state: 'DKI Jakarta',
      zip: '12730',
      country: 'Indonesia',
      phone: '+62 812 3456 7890'
    },
    consignee: {
      name: 'Alice Wonders',
      street: '456 Broadway Ave',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
      phone: '+1 212 555 0199'
    }
  },
  { 
    id: 'GORT-2983739', 
    date: 'Oct 15, 2023', 
    customerType: 'B2B',
    b2bStatus: 'Pending',
    dest: 'Tokyo, JPN', 
    service: 'Express', 
    items: 4, 
    actualWeight: 22,
    chargeableWeight: 24,
    price: 'Rp 3,300,000', 
    insurance: 'Rp 180,000',
    total: 'Rp 3,480,000',
    status: 'Order Created', 
    statusColor: 'bg-gray-100 text-gray-800',
    paymentStatus: 'Unpaid',
    shipper: {
      name: 'PT. Makmur Sejahtera',
      street: 'Jl. Kemang Raya No. 12',
      city: 'Jakarta South',
      state: 'DKI Jakarta',
      zip: '12730',
      country: 'Indonesia',
      phone: '+62 812 3456 7890'
    },
    consignee: {
      name: 'Ryosuke Tanaka',
      street: '2-1-1 Nihonbashi',
      city: 'Chuo-ku, Tokyo',
      state: 'Tokyo',
      zip: '103-0027',
      country: 'Japan',
      phone: '+81 3 3272 1311'
    }
  },
  { 
    id: 'GORT-2983738', 
    date: 'Oct 10, 2023', 
    customerType: 'B2C',
    b2bStatus: 'None',
    dest: 'London, UK', 
    service: 'Saver', 
    items: 1, 
    actualWeight: 2,
    chargeableWeight: 2,
    price: 'Rp 450,000', 
    insurance: 'Rp 20,000',
    total: 'Rp 470,000',
    status: 'Waiting for Payment', 
    statusColor: 'bg-orange-100 text-orange-800',
    paymentStatus: 'Unpaid',
    shipper: {
      name: 'John Doe',
      street: 'Jl. Kemang Raya No. 12',
      city: 'Jakarta South',
      state: 'DKI Jakarta',
      zip: '12730',
      country: 'Indonesia',
      phone: '+62 812 3456 7890'
    },
    consignee: {
      name: 'Charlie Brown',
      street: '10 Downing St',
      city: 'London',
      state: 'England',
      zip: 'SW1A 2AA',
      country: 'UK',
      phone: '+44 20 7946 0958'
    }
  },
];

export default function ShipmentHistory() {
  const [selectedShipment, setSelectedShipment] = useState<(ShipmentHistoryItem & { dest: string }) | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isPendingReviewOpen, setIsPendingReviewOpen] = useState(false);

  const openAWB = (item: (ShipmentHistoryItem & { dest: string })) => {
    setSelectedShipment(item);
    setIsModalOpen(true);
  };

  const openPayment = (item: (ShipmentHistoryItem & { dest: string })) => {
    setSelectedShipment(item);
    setIsPaymentOpen(true);
  };

  const handleAWBClick = (item: (ShipmentHistoryItem & { dest: string })) => {
    if (item.customerType === 'B2B' && item.b2bStatus !== 'Approved') {
      setSelectedShipment(item);
      setIsPendingReviewOpen(true);
    } else if (item.customerType === 'B2C' && item.paymentStatus !== 'Paid') {
      toast.info("Please pay to access AWB.");
      openPayment(item);
    } else {
      openAWB(item);
    }
  };

  return (
    <div className="flex-1 min-w-0 overflow-x-hidden overflow-y-auto bg-gray-50 flex flex-col">
      <div className="p-8 w-full flex-1 max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 className="text-[24px] font-black text-slate-800 flex items-center gap-3">
              <span className="w-1.5 h-7 bg-primary rounded-full"></span>
              My Shipments
            </h1>
            <p className="text-slate-500 mt-1 text-[14px] font-medium">View and manage your past global shipments.</p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <button className="inline-flex items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 shadow-sm hover:bg-gray-50 transition-all">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </button>
            <Link href="/shipment/create" className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-[0_4px_10px_rgba(244,77,76,0.3)] hover:bg-primary-600 transition-all hover:-translate-y-0.5">
              New Shipment
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          
          <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row gap-4 justify-between">
            <div className="relative w-full sm:w-80">
              <input 
                type="text" 
                placeholder="Search tracking ID or destination..."
                className="w-full rounded-md border border-gray-300 pl-9 pr-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tracking ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destination</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {MOCK_HISTORY.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/tracking?id=${item.id}`} className="text-sm font-medium text-primary hover:underline">
                        {item.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.dest}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 font-medium">{item.service}</div>
                      <div className="text-xs text-slate-400 font-medium">{item.items} item(s) • {item.actualWeight} kg</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-800">{item.total}</div>
                      <div className="flex items-center gap-1.5 mt-1">
                        {item.customerType === 'B2B' ? (
                          <span className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded",
                            item.b2bStatus === 'Pending' ? "bg-gray-200 text-gray-700" :
                            item.b2bStatus === 'Approved' ? "bg-blue-100 text-blue-700" :
                            item.b2bStatus === 'Rejected' ? "bg-red-100 text-red-700" :
                            "bg-gray-200 text-gray-700"
                          )}>
                            {item.b2bStatus === 'Pending' ? 'Pending Approval' : item.b2bStatus}
                          </span>
                        ) : (
                          <span className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded",
                            item.paymentStatus === 'Paid' ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-700"
                          )}>
                            {item.paymentStatus === 'Paid' ? 'Paid' : 'Pending'}
                          </span>
                        )}
                        {item.paymentMethod && (
                          <span className="text-[10px] text-slate-400 font-medium italic">via {item.paymentMethod}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-[11px] font-bold rounded-full ${item.statusColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        {item.customerType === 'B2B' && item.b2bStatus !== 'Approved' && (
                          <button 
                            onClick={() => {
                              setSelectedShipment(item);
                              setIsPendingReviewOpen(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-300 transition-all shadow-sm active:scale-95"
                          >
                            Under Review
                          </button>
                        )}
                        {item.customerType === 'B2C' && item.paymentStatus !== 'Paid' && (
                          <button 
                            onClick={() => openPayment(item)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-xs font-bold hover:bg-primary-600 transition-all shadow-sm active:scale-95"
                          >
                            Pay Now
                          </button>
                        )}
                        <button 
                          onClick={() => handleAWBClick(item)}
                          className="p-2 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg transition-all"
                          title="Print AWB"
                        >
                          <Printer size={18} />
                        </button>
                        <Link 
                          href={`/tracking?id=${item.id}`}
                          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
                          title="View Details"
                        >
                          <Eye size={18} />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex items-center justify-between sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">3</span> of <span className="font-medium">3</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Previous
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-primary bg-primary-50 text-sm font-bold text-primary">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* AWB Modal */}
      {selectedShipment && (
        <AWBModal 
          shipment={selectedShipment} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      {/* Payment Gateway Modal */}
      {isPendingReviewOpen && selectedShipment && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsPendingReviewOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 text-center z-10 flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-8 w-8 text-blue-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-800 mb-2">Awaiting Credit Approval</h2>
            <p className="text-slate-500 text-sm font-medium mb-6">
              Your application for credit terms on order #{selectedShipment.id} is currently under review. 
              The Airway Bill (AWB) will be available once approved.
            </p>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-4 w-full text-left space-y-2 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Order ID</span>
                <span className="font-bold text-slate-800">{selectedShipment.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <span className="font-bold text-blue-600">Pending Approval</span>
              </div>
            </div>
            <button 
              onClick={() => setIsPendingReviewOpen(false)}
              className="w-full bg-primary text-white p-3.5 rounded-xl font-bold hover:bg-primary-600 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {selectedShipment && (
        <PaymentGateway
          isOpen={isPaymentOpen}
          onClose={() => setIsPaymentOpen(false)}
          shipmentData={{
            id: selectedShipment.id,
            total: parseInt(selectedShipment.total.replace(/[^0-9]/g, '')),
            baseRate: parseInt(selectedShipment.price.replace(/[^0-9]/g, '')),
            insurance: parseInt(selectedShipment.insurance.replace(/[^0-9]/g, '')),
            surcharge: 0, // Simplified for history view
            service: selectedShipment.service,
            incoterm: selectedShipment.incoterm || 'DDU',
            eta: selectedShipment.eta || '3-5 days',
            items: selectedShipment.items,
            weight: selectedShipment.actualWeight,
            consignee: selectedShipment.consignee,
            shipper: selectedShipment.shipper
          }}
          onSuccess={() => setIsPaymentOpen(false)}
        />
      )}
    </div>
  );
}
