'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency, formatMonth } from '@/lib/utils';

interface TrendData {
  month: string;
  count: number;
  sum: number;
}

interface Props {
  data: TrendData[];
}

export default function InvoiceTrendsChart({ data }: Props) {
  // Safety check: ensure data is an array
  const trendsData = Array.isArray(data) ? data : [];
  
  // Sort by month chronologically
  const sortedTrends = trendsData.sort((a, b) => {
    return new Date(a.month + '-01').getTime() - new Date(b.month + '-01').getTime();
  });
  
  const [selectedMonth, setSelectedMonth] = useState<TrendData | null>(
    sortedTrends[sortedTrends.length - 1] || null
  );

  if (sortedTrends.length === 0) {
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
          <div style={{ color: '#64748B', fontSize: '14px' }}>No trend data available</div>
        </div>
      </div>
    );
  }

  const chartData = sortedTrends.map(item => ({
    month: formatMonth(item.month).split(' ')[0],
    fullMonth: formatMonth(item.month),
    invoiceCount: item.count,
    totalSpend: item.sum,
    originalData: item,
  }));

  const displayData = selectedMonth || sortedTrends[sortedTrends.length - 1];

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
            Invoice Volume + Value Trend
          </div>
          <div style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px', color: '#64748B', marginTop: '4px' }}>
            Invoice count and total spend over 12 months. Hover to see details.
          </div>
        </div>
        
        <div style={{ position: 'relative', height: '307px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart 
              data={chartData}
              onMouseMove={(e: any) => {
                if (e?.activePayload?.[0]?.payload?.originalData) {
                  setSelectedMonth(e.activePayload[0].payload.originalData);
                }
              }}
              onMouseLeave={() => {
                setSelectedMonth(trendsData[trendsData.length - 1]);
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
              <XAxis 
                dataKey="month"
                tick={{ fontSize: 11, fill: '#64748B' }}
                stroke="#E4E4E7"
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#64748B' }}
                stroke="#E4E4E7"
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  background: 'white',
                  border: '1px solid #E4E4E7',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '12px'
                }}
                formatter={(value: any, name: string) => {
                  if (name === 'invoiceCount') return [value, 'Invoice Count'];
                  return [formatCurrency(value), 'Total Spend'];
                }}
              />
              <Line
                type="monotone"
                dataKey="invoiceCount"
                stroke="#1B1464"
                strokeWidth={2}
                dot={{ fill: '#1B1464', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>

          {displayData && (
            <div style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: '#F8F9FA',
              border: '1px solid #E4E4E7',
              borderRadius: '8px',
              padding: '12px',
              minWidth: '140px',
              transition: 'all 0.2s ease'
            }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#1B1464' }}>
                {formatMonth(displayData.month)}
              </div>
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Invoice count:</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#3B82F6' }}>
                  {displayData.count}
                </div>
              </div>
              <div style={{ marginTop: '8px' }}>
                <div style={{ fontSize: '11px', color: '#64748B' }}>Total Spend:</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#3B82F6' }}>
                  {formatCurrency(displayData.sum)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
