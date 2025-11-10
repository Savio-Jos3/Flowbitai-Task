'use client';

import { useState } from 'react';
import { formatCurrency } from '@/lib/utils';

interface VendorData {
  vendorId: string;
  _sum: {
    invoiceTotal: number;
  };
}

interface Props {
  data: VendorData[];
}

const vendorNames: Record<number, string> = {
  0: 'AcmeCorp',
  1: 'Test Solutions',
  2: 'PrimeVendors',
  3: 'DeltaServices',
  4: 'OmegaLtd',
  5: 'Global Supply',
  6: 'OmegaLux',
  7: 'Omega Ltd',
  8: 'Vendor 9',
  9: 'Vendor 10',
};

export default function VendorBarChart({ data }: Props) {
  const [selectedVendor, setSelectedVendor] = useState<number | null>(4);

  // Safety check: ensure data is an array
  const vendorData = Array.isArray(data) ? data : [];
  const topVendors = vendorData.slice(0, 10);
  
  if (topVendors.length === 0) {
    return (
      <div style={{ width: '574px', height: '371px' }}>
        <div style={{ 
          boxSizing: 'border-box',
          padding: '16px',
          background: '#FFFFFF',
          border: '1px solid #E4E4E7',
          borderRadius: '8px',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ color: '#64748B', fontSize: '14px' }}>No vendor data available</div>
        </div>
      </div>
    );
  }

  const maxSpend = Math.max(...topVendors.map(v => v._sum.invoiceTotal));

  return (
    <div style={{ width: '574px', height: '371px' }}>
      <div style={{ 
        boxSizing: 'border-box',
        padding: '16px',
        background: '#FFFFFF',
        border: '1px solid #E4E4E7',
        borderRadius: '8px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}>
        <div>
          <div style={{ fontSize: '14px', fontWeight: 600, lineHeight: '20px', color: '#000000' }}>
            Spend by Vendor (Top 10)
          </div>
          <div style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px', color: '#64748B', marginTop: '4px' }}>
            Vendor spend with cumulative percentage distribution.
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {topVendors.map((vendor, index) => {
            const vendorName = vendorNames[index] || `Vendor ${index + 1}`;
            const percentage = (vendor._sum.invoiceTotal / maxSpend) * 100;
            const isSelected = selectedVendor === index;

            return (
              <div key={vendor.vendorId}>
                <div style={{ fontSize: '11px', fontWeight: 500, color: '#64748B', marginBottom: '4px' }}>
                  {vendorName}
                </div>
                <div
                  onClick={() => setSelectedVendor(isSelected ? null : index)}
                  style={{
                    height: '28px',
                    background: '#F1F5F9',
                    borderRadius: '14px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    position: 'relative'
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${percentage}%`,
                      background: isSelected || index === 4 ? '#1B1464' : '#C7D2FE',
                      borderRadius: '14px',
                      transition: 'all 0.3s ease'
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {selectedVendor !== null && topVendors[selectedVendor] && (
          <div style={{
            background: '#F8F9FA',
            border: '1px solid #E4E4E7',
            borderRadius: '8px',
            padding: '12px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: 600, color: '#1B1464' }}>
              {vendorNames[selectedVendor] || 'Global Supply'}
            </div>
            <div style={{ marginTop: '8px' }}>
              <div style={{ fontSize: '11px', color: '#64748B' }}>Vendor Spend:</div>
              <div style={{ fontSize: '18px', fontWeight: 700, color: '#3B82F6' }}>
                {formatCurrency(topVendors[selectedVendor]._sum.invoiceTotal)}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
