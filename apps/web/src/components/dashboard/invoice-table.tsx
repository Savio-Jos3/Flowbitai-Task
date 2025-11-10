'use client';

import { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function InvoiceTable() {
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await dashboardApi.getInvoices({ pageSize: 8 });
        
        // Axios returns: response.data = { success: true, data: { invoices: [...] } }
        const invoiceData = response.data?.data?.invoices || [];
        setInvoices(invoiceData);
      } catch (error) {
        console.error('Failed to fetch invoices:', error);
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div style={{ width: '462px', height: '437px' }}>
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
            Invoices by Vendor
          </div>
          <div style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px', color: '#64748B', marginTop: '4px' }}>
            Top invoices by date and net value.
          </div>
        </div>
        
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <table style={{ width: '100%', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #E4E4E7' }}>
                <th style={{ 
                  textAlign: 'left', 
                  padding: '8px 4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#64748B'
                }}>
                  Vendor
                </th>
                <th style={{ 
                  textAlign: 'left', 
                  padding: '8px 4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#64748B'
                }}>
                  # Invoices
                </th>
                <th style={{ 
                  textAlign: 'right', 
                  padding: '8px 4px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#64748B'
                }}>
                  Net Value
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: '#64748B' }}>
                    Loading...
                  </td>
                </tr>
              ) : invoices.length === 0 ? (
                <tr>
                  <td colSpan={3} style={{ textAlign: 'center', padding: '20px', color: '#64748B' }}>
                    No invoices found
                  </td>
                </tr>
              ) : (
                invoices.map((invoice) => (
                  <tr 
                    key={invoice.id} 
                    style={{ 
                      borderBottom: '1px solid #F1F5F9'
                    }}
                  >
                    <td style={{ padding: '10px 4px', color: '#000000', fontSize: '11px' }}>
                      Phunix GmbH
                    </td>
                    <td style={{ padding: '10px 4px', color: '#64748B', fontSize: '10px' }}>
                      {new Date(invoice.invoiceDate).toLocaleDateString('de-DE')}
                    </td>
                    <td style={{ 
                      padding: '10px 4px', 
                      textAlign: 'right',
                      fontWeight: 600,
                      color: '#000000',
                      fontSize: '12px'
                    }}>
                      € {Math.abs(invoice.invoiceTotal).toFixed(2).replace('.', ',')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
