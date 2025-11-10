'use client';

import { useEffect, useState } from 'react';
import StatsCard from './stats-card';
import { dashboardApi } from '@/lib/api';
import { formatCurrency } from '@/lib/utils';

export default function StatsGrid() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const response = await dashboardApi.getStats();
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to load');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 bg-gray-100 animate-pulse rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-600 rounded-lg">
        Error loading stats: {error}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Invoices"
        value={stats?.invoiceCount || 0}
        icon="📄"
        description="All time invoices"
      />
      <StatsCard
        title="Total Revenue"
        value={formatCurrency(0)}
        icon="💰"
        description="Calculated from all invoices"
      />
      <StatsCard
        title="Pending"
        value="0"
        icon="⏳"
        description="Awaiting payment"
      />
      <StatsCard
        title="Paid"
        value="0"
        icon="✅"
        description="Successfully paid"
      />
    </div>
  );
}
