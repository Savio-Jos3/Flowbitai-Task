'use client';

import { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';
import InvoiceTrendsChart from '@/src/components/charts/invoice-trends-chart';
import VendorBarChart from '@/src/components/charts/vendor-bar-chart';
import CategoryDonutChart from '@/src/components/charts/category-donut-chart';
import CashOutflowChart from '@/src/components/charts/cash-outflow-chart';
import InvoiceTable from '@/src/components/dashboard/invoice-table';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [docStats, setDocStats] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cashflow, setCashflow] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  async function fetchData() {
    try {
      const [statsRes, docStatsRes, trendsRes, vendorsRes, categoriesRes, cashflowRes] = await Promise.all([
        dashboardApi.getStats(),
        dashboardApi.getDocumentStats(),
        dashboardApi.getInvoiceTrends(),
        dashboardApi.getTopVendors(),
        dashboardApi.getCategorySpend(),
        dashboardApi.getCashOutflow(),
      ]);
      
      console.log('API Responses:', { statsRes, docStatsRes, trendsRes, vendorsRes, categoriesRes, cashflowRes });
      
      // Extract data - handle axios nesting
      setStats(statsRes.data?.data || statsRes.data);
      setDocStats(docStatsRes.data?.data || docStatsRes.data);
      setTrends(trendsRes.data?.data || trendsRes.data || []);
      setVendors(vendorsRes.data?.data || vendorsRes.data || []);
      setCategories(categoriesRes.data?.data || categoriesRes.data || []);
      setCashflow(cashflowRes.data?.data || cashflowRes.data || []);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }
  fetchData();
}, []);

  if (loading) {
    return <div className="flex items-center justify-center h-full text-gray-600">Loading...</div>;
  }

  const totalSpend = trends.reduce((acc, t) => acc + (t.sum || 0), 0);
  const avgInvoiceValue = stats?.invoiceCount > 0 ? totalSpend / stats.invoiceCount : 0;

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '1164px',
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}
    >
      {/* Stats Row - 4 cards */}
      <div style={{ display: 'flex', gap: '16px', width: '1164px', height: '120px' }}>
        <StatsCard
          title="Total Spend"
          subtitle="(YTD)"
          value={formatCurrency(totalSpend)}
          trend={stats?.trends?.totalSpend?.value ? `${stats.trends.totalSpend.isPositive ? '+' : '-'}${stats.trends.totalSpend.value}%` : "+0%"}
          trendLabel="from last month"
          isPositive={stats?.trends?.totalSpend?.isPositive ?? true}
        />
        <StatsCard
          title="Total Invoices Processed"
          value={String(stats?.invoiceCount || 0)}
          trend={stats?.trends?.invoiceCount?.value ? `${stats.trends.invoiceCount.isPositive ? '+' : '-'}${stats.trends.invoiceCount.value}%` : "+0%"}
          trendLabel="from last month"
          isPositive={stats?.trends?.invoiceCount?.isPositive ?? true}
        />
        <StatsCard
          title="Documents Uploaded"
          subtitle="This Month"
          value={String(docStats?.thisMonth || 0)}
          trend={docStats?.percentChange ? `${docStats.isPositive ? '+' : ''}${docStats.percentChange}%` : "+0%"}
          trendLabel="from last month"
          isPositive={docStats?.isPositive ?? true}
        />
        <StatsCard
          title="Average Invoice Value"
          value={formatCurrency(avgInvoiceValue)}
          trend={stats?.trends?.avgValue?.value ? `${stats.trends.avgValue.isPositive ? '+' : '-'}${stats.trends.avgValue.value}%` : "+0%"}
          trendLabel="from last month"
          isPositive={stats?.trends?.avgValue?.isPositive ?? true}
        />
      </div>

      {/* Middle Row */}
      <div style={{ display: 'flex', gap: '16px', width: '1164px' }}>
        <InvoiceTrendsChart data={trends} />
        <VendorBarChart data={vendors} />
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'flex', gap: '16px', width: '1164px' }}>
        <CategoryDonutChart data={categories} />
        <CashOutflowChart data={cashflow} />
        <InvoiceTable />
      </div>
    </div>
  );
}

// Stats Card Component
function StatsCard({ title, subtitle, value, trend, trendLabel, isPositive }: any) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        padding: '16px',
        gap: '10px',
        width: '279px',
        height: '120px',
        background: '#FFFFFF',
        border: '1px solid #E4E4E7',
        borderRadius: '8px'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '12px', fontWeight: 500, lineHeight: '16px', color: '#000000' }}>
            {title}
          </div>
          {subtitle && (
            <div style={{ fontSize: '12px', fontWeight: 500, lineHeight: '16px', color: '#64748B' }}>
              {subtitle}
            </div>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <div style={{ fontSize: '20px', fontWeight: 600, lineHeight: '24px', color: '#000000' }}>
            {value}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
            <span style={{ 
              fontSize: '12px', 
              fontWeight: 600, 
              lineHeight: '16px', 
              color: isPositive ? '#2F9F02' : '#ED1C24' 
            }}>
              {trend}
            </span>
            <span style={{ fontSize: '12px', fontWeight: 500, lineHeight: '16px', color: '#8598B3' }}>
              {trendLabel}
            </span>
          </div>
        </div>
        <TrendIcon isPositive={isPositive} />
      </div>
    </div>
  );
}

function TrendIcon({ isPositive }: { isPositive: boolean }) {
  return (
    <svg width="46" height="26" viewBox="0 0 46 26" fill="none">
      <path
        d={isPositive ? "M1 25L12 14L23 17L34 8L45 1" : "M1 1L12 12L23 9L34 18L45 25"}
        stroke={isPositive ? '#3AB37E' : '#ED1C24'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
