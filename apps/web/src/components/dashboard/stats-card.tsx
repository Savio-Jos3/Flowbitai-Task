'use client';

import { useEffect, useState } from 'react';
import { dashboardApi } from '@/lib/api';
import StatsCard from '@/src/components/dashboard/stats-card';
import InvoiceTrendsChart from '@/src/components/charts/invoice-trends-chart';
import VendorBarChart from '@/src/components/charts/vendor-bar-chart';
import CategoryDonutChart from '@/src/components/charts/category-donut-chart';
import CashOutflowChart from '@/src/components/charts/cash-outflow-chart';
import InvoiceTable from '@/src/components/dashboard/invoice-table';
import { formatCurrency } from '@/lib/utils';

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [trends, setTrends] = useState<any[]>([]);
  const [vendors, setVendors] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [cashflow, setCashflow] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [statsRes, trendsRes, vendorsRes, categoriesRes, cashflowRes] = await Promise.all([
          dashboardApi.getStats(),
          dashboardApi.getInvoiceTrends(),
          dashboardApi.getTopVendors(),
          dashboardApi.getCategorySpend(),
          dashboardApi.getCashOutflow(),
        ]);

        setStats(statsRes.data);
        setTrends(trendsRes.data);
        setVendors(vendorsRes.data);
        setCategories(categoriesRes.data);
        setCashflow(cashflowRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  // Calculate total spend from trends
  const totalSpend = trends.reduce((acc, t) => acc + (t.sum || 0), 0);
  const avgInvoiceValue = stats?.invoiceCount > 0 ? totalSpend / stats.invoiceCount : 0;

  return (
    <div className="space-y-6">
      {/* Top Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Spend"
          subtitle="(YTD)"
          value={formatCurrency(totalSpend)}
          trend={{ value: 8.2, isPositive: true }}
          trendLabel="from last month"
        />
        <StatsCard
          title="Total Invoices Processed"
          value={stats?.invoiceCount || 0}
          trend={{ value: 8.2, isPositive: true }}
          trendLabel="from last month"
        />
        <StatsCard
          title="Documents Uploaded"
          subtitle="This Month"
          value={17}
          trend={{ value: 8, isPositive: false }}
          trendLabel="less from last month"
        />
        <StatsCard
          title="Average Invoice Value"
          value={formatCurrency(avgInvoiceValue)}
          trend={{ value: 8.2, isPositive: true }}
          trendLabel="from last month"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Invoice Volume Chart - Takes 2 columns */}
        <div className="lg:col-span-2">
          <InvoiceTrendsChart data={trends} />
        </div>

        {/* Vendor Bar Chart - Takes 1 column */}
        <div className="lg:col-span-1">
          <VendorBarChart data={vendors} />
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Category Donut Chart */}
        <div className="lg:col-span-1">
          <CategoryDonutChart data={categories} />
        </div>

        {/* Cash Outflow Forecast */}
        <div className="lg:col-span-1">
          <CashOutflowChart data={cashflow} />
        </div>

        {/* Invoices by Vendor Table */}
        <div className="lg:col-span-1">
          <InvoiceTable />
        </div>
      </div>
    </div>
  );
}
