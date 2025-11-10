'use client';

import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/lib/utils';

interface CategoryData {
  sachkonto: string;
  _sum: {
    totalPrice: number;
  };
}

interface Props {
  data: CategoryData[];
}

const COLORS = ['#3B82F6', '#F97316', '#FCD34D', '#A855F7', '#EC4899'];
const CATEGORY_NAMES: Record<string, string> = {
  '4420': 'Operations',
  '4200': 'Marketing',
  '6300': 'Facilities',
  '4400': 'IT Services',
  '5401': 'Supplies',
};

export default function CategoryDonutChart({ data }: Props) {
  // Safety check: ensure data is an array
  const categoryData = Array.isArray(data) ? data : [];
  
  if (categoryData.length === 0) {
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
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <div style={{ color: '#64748B', fontSize: '14px' }}>No category data available</div>
        </div>
      </div>
    );
  }

  const chartData = categoryData.slice(0, 5).map(item => ({
    name: CATEGORY_NAMES[item.sachkonto] || item.sachkonto,
    value: Math.abs(item._sum.totalPrice),
  }));

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
            Spend by Category
          </div>
          <div style={{ fontSize: '12px', fontWeight: 400, lineHeight: '16px', color: '#64748B', marginTop: '4px' }}>
            Distribution of spending across different categories.
          </div>
        </div>
        
        <div style={{ height: '200px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {chartData.map((item, index) => (
            <div key={item.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ 
                  width: '12px', 
                  height: '12px', 
                  borderRadius: '50%',
                  background: COLORS[index % COLORS.length]
                }} />
                <span style={{ fontSize: '12px', color: '#64748B' }}>{item.name}</span>
              </div>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#000000' }}>
                {formatCurrency(item.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
