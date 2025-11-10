'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from 'recharts';

interface CashflowData {
  range: string;
  _sum: {
    amount: number;
  };
  paymentDate: string;
}

interface Props {
  data: CashflowData[];
}

export default function CashOutflowChart({ data }: Props) {
  // Ensure data is an array and format for chart
  const cashflowData = Array.isArray(data) ? data : [];
  
  const chartData = cashflowData.map(item => ({
    range: item.range,
    amount: item._sum?.amount || 0
  }));

  // If no data, show empty state
  if (chartData.length === 0 || chartData.every(d => d.amount === 0)) {
    return (
      <div style={{ width: '335px', height: '437px' }}>
        <div style={{ 
          boxSizing: 'border-box',
          padding: '16px',
          background: '#FFFFFF',
          border: '1px solid #E4E4E7',
          borderRadius: '8px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: '#000000' }}>
              Cash Outflow Forecast
            </div>
            <div style={{ fontSize: '12px', color: '#64748B', marginTop: '8px' }}>
              No upcoming payment obligations
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ width: '335px', height: '437px' }}>
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
            Cash Outflow Forecast
          </div>
          <div style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px', color: '#64748B', marginTop: '4px' }}>
            Expected payment obligations grouped by due date ranges.
          </div>
        </div>
        
        <div style={{ height: '340px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E4E7" vertical={false} />
              <XAxis 
                dataKey="range" 
                tick={{ fontSize: 10, fill: '#64748B' }}
                stroke="#E4E4E7"
                axisLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#64748B' }}
                stroke="#E4E4E7"
                axisLine={false}
                tickFormatter={(value) => `€${(value/1000).toFixed(0)}k`}
              />
              <Bar 
                dataKey="amount" 
                radius={[8, 8, 0, 0]}
                maxBarSize={60}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={index === 3 ? '#1B1464' : '#64748B'} 
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Summary at bottom */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: '1fr 1fr',
          gap: '8px',
          paddingTop: '8px',
          borderTop: '1px solid #E4E4E7'
        }}>
          {chartData.map((item, index) => (
            <div key={index} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '9px', color: '#64748B' }}>{item.range}</div>
              <div style={{ fontSize: '12px', fontWeight: 600, color: '#000000' }}>
                €{(item.amount / 1000).toFixed(1)}k
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
