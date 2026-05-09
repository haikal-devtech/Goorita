'use client';

import React from 'react';
import Image from 'next/image';
import { ShipmentHistoryItem } from '@/types/shipping';

interface AirwayBillProps {
  shipment: ShipmentHistoryItem;
}

export function AirwayBill({ shipment }: AirwayBillProps) {
  return (
    <div id={`awb-${shipment.id}`} className="bg-white p-8 max-w-[800px] mx-auto border border-gray-200 text-slate-900 font-sans print:border-0 print:p-0">
      {/* Header */}
      <div className="flex justify-between items-start border-b-2 border-black pb-6 mb-6">
        <div>
          <Image 
            src="https://send.goorita.com/logo-red.png" 
            alt="Goorita Send" 
            width={150} 
            height={40} 
            className="mb-2"
            priority
          />
          <p className="text-[10px] text-slate-500 font-medium">International Door-to-Door Delivery</p>
        </div>
          <div className="text-right">
            <h1 className="text-2xl font-black tracking-tighter">AIRWAY BILL</h1>
            <p className="text-sm font-bold text-primary mt-1">{shipment.id}</p>
            <p className="text-[10px] text-slate-500 font-medium">Date: {shipment.date}</p>
            {shipment.eta && <p className="text-[10px] text-primary font-black uppercase mt-0.5 whitespace-nowrap">ETA: {shipment.eta}</p>}
          </div>
      </div>

      {/* Addresses */}
      <div className="grid grid-cols-2 gap-0 border border-black mb-6">
        <div className="p-4 border-r border-black">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Shipper (From)</h2>
          <div className="space-y-0.5">
            <p className="font-bold text-sm uppercase">{shipment.shipper.name}</p>
            {shipment.shipper.company && <p className="text-xs">{shipment.shipper.company}</p>}
            <p className="text-xs">{shipment.shipper.street}</p>
            <p className="text-xs">{shipment.shipper.city}, {shipment.shipper.state} {shipment.shipper.zip}</p>
            <p className="text-xs font-bold">{shipment.shipper.country}</p>
            <p className="text-xs mt-2 italic">Tel: {shipment.shipper.phone}</p>
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Consignee (To)</h2>
          <div className="space-y-0.5">
            <p className="font-bold text-sm uppercase">{shipment.consignee.name}</p>
            {shipment.consignee.company && <p className="text-xs">{shipment.consignee.company}</p>}
            <p className="text-xs">{shipment.consignee.street}</p>
            <p className="text-xs">{shipment.consignee.city}, {shipment.consignee.state} {shipment.consignee.zip}</p>
            <p className="text-xs font-bold">{shipment.consignee.country}</p>
            <p className="text-xs mt-2 italic">Tel: {shipment.consignee.phone}</p>
          </div>
        </div>
      </div>

      {/* Shipment Specs */}
      <div className="border border-black mb-6">
        <div className="grid grid-cols-5 bg-slate-50 border-b border-black">
          <div className="px-3 py-2 text-[10px] font-bold uppercase border-r border-black">Service</div>
          <div className="px-3 py-2 text-[10px] font-bold uppercase border-r border-black">Incoterm</div>
          <div className="px-3 py-2 text-[10px] font-bold uppercase border-r border-black">Pieces</div>
          <div className="px-3 py-2 text-[10px] font-bold uppercase border-r border-black">Act. Weight</div>
          <div className="px-3 py-2 text-[10px] font-bold uppercase">Chg. Weight</div>
        </div>
        <div className="grid grid-cols-5">
          <div className="px-3 py-3 text-xs font-bold border-r border-black">{shipment.service}</div>
          <div className="px-3 py-3 text-xs font-black border-r border-black">{shipment.incoterm || 'DDU'}</div>
          <div className="px-3 py-3 text-xs font-medium border-r border-black">{shipment.items} BOX</div>
          <div className="px-3 py-3 text-xs font-medium border-r border-black">{shipment.actualWeight} KG</div>
          <div className="px-3 py-3 text-xs font-bold">{shipment.chargeableWeight} KG</div>
        </div>
      </div>

      {/* Cost & Barcode */}
      <div className="grid grid-cols-12 gap-6 mb-8">
        <div className="col-span-7">
          <div className="border border-black h-full">
            <div className="bg-slate-50 px-3 py-1 border-b border-black text-[10px] font-bold uppercase">Billing Summary</div>
            <div className="p-3 space-y-2">
              <div className="flex justify-between text-xs font-medium">
                <span>Shipping Cost</span>
                <span>{shipment.price}</span>
              </div>
              <div className="flex justify-between text-xs font-medium">
                <span>Insurance Fee</span>
                <span>{shipment.insurance}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-dashed border-slate-300">
                <span>Total Amount</span>
                <span className="text-primary">{shipment.total}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-span-5">
          <div className="flex flex-col items-center justify-center p-4 border border-black h-full bg-white">
            {/* Fake Barcode - Pure version */}
            <div className="w-full h-16 bg-black mb-2 flex items-center justify-between px-1">
              {[...Array(40)].map((_, i) => {
                // Deterministic "random" based on index and shipment id
                const width = (i * 7 + 3) % 4 + 1;
                const visible = (i * 3 + 1) % 5 !== 0;
                return (
                  <div 
                    key={i} 
                    className="bg-white" 
                    style={{ 
                      width: `${width}px`, 
                      height: '100%', 
                      opacity: visible ? 1 : 0 
                    }}
                  />
                );
              })}
            </div>
            <p className="text-[12px] font-mono font-bold tracking-[0.2em]">{shipment.id}</p>
            <p className="text-[10px] text-slate-400 mt-2">TRACKING BARCODE</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 pt-6">
        <div className="flex justify-between items-end">
          <div className="max-w-xs">
            <p className="text-[9px] text-slate-400 leading-relaxed font-medium">
              Terms & Conditions apply. Goorita Send is a platform provided by Goorita for international shipping. 
              This document is a system-generated Airway Bill valid for international logistics handling.
            </p>
          </div>
          <div className="text-right">
            <div className="border-2 border-black inline-block px-4 py-1 font-black text-xs uppercase italic transform -rotate-1 opacity-20">
              ORIGINAL COPY
            </div>
          </div>
        </div>
      </div>

      {/* Print Helpers */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden;
          }
          #awb-${shipment.id}, #awb-${shipment.id} * {
            visibility: visible;
          }
          #awb-${shipment.id} {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            border: 0 !important;
            padding: 0 !important;
          }
        }
      `}} />
    </div>
  );
}
