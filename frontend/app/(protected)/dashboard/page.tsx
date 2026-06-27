'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { SalesTrendChart } from '@/components/dashboard/sales-trend-chart';
import { RevenueExpensesChart } from '@/components/dashboard/revenue-expenses-chart';
import { TopSellersTable } from '@/components/dashboard/top-sellers-table';
import { ActivityTimeline } from '@/components/dashboard/activity-timeline';
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart, AlertTriangle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import dashboardService from '@/services/dashboard';
import type { Activity, ChartData, DashboardStats, TopSellingDrink } from '@/types/dashboard';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    revenueToday: 0,
    expensesToday: 0,
    netProfit: 0,
    salesCount: 0,
    lowStockCount: 0,
  });
  const [salesTrendData, setSalesTrendData] = useState<ChartData[]>([]);
  const [revenueExpensesData, setRevenueExpensesData] = useState<ChartData[]>([]);
  const [topSellers, setTopSellers] = useState<TopSellingDrink[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [dashboardStats, salesTrend, topSellersData, activityData] = await Promise.all([
          dashboardService.getDashboardStats(),
          dashboardService.getDashboardSalesTrend(),
          dashboardService.getDashboardTopSellers(),
          dashboardService.getDashboardActivity(),
        ]);

        setStats(dashboardStats);
        setSalesTrendData(salesTrend);
        setRevenueExpensesData([
          { name: 'Revenue', value: dashboardStats.revenueToday, color: '#9C6C29' },
          { name: 'Expenses', value: dashboardStats.expensesToday, color: '#46290C' },
        ]);
        setTopSellers(topSellersData);
        setActivities(activityData);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-foreground">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here&apos;s what&apos;s happening at Chez
              l&apos;Impératrice today.
            </p>
          </div>
          <Link href="/dashboard/sales">
            <Button className="bg-gold hover:bg-gold-light text-pitch font-semibold">
              New Sale
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Low stock alert */}
        {stats.lowStockCount > 0 && !isLoading && (
          <Alert className="bg-amber-500/10 border-amber-500/30">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <AlertTitle className="text-amber-500">Low Stock Alert</AlertTitle>
            <AlertDescription className="text-muted-foreground">
              {stats.lowStockCount} items are running low on stock.{" "}
              <Link
                href="/dashboard/inventory"
                className="text-gold hover:underline"
              >
                View inventory
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Revenue Today"
            value={`${(stats?.revenueToday ?? 0).toLocaleString()} FC`}
            description="from yesterday"
            icon={TrendingUp}
            trend={{ value: 12.5, isPositive: true }}
            isLoading={isLoading}
          />
          <StatCard
            title="Expenses Today"
            value={`${(stats?.expensesToday ?? 0).toLocaleString()} FC`}
            description="from yesterday"
            icon={TrendingDown}
            trend={{ value: 3.2, isPositive: false }}
            isLoading={isLoading}
          />
          <StatCard
            title="Net Profit"
            value={`${(stats?.netProfit ?? 0).toLocaleString()} FC`}
            description="today's margin"
            icon={DollarSign}
            trend={{ value: 8.1, isPositive: (stats?.netProfit ?? 0) > 0 }}
            isLoading={isLoading}
          />
          <StatCard
            title="Sales Count"
            value={(stats?.salesCount ?? 0).toString()}
            description="transactions"
            icon={ShoppingCart}
            trend={{ value: 15.3, isPositive: true }}
            isLoading={isLoading}
          />
        </div>

        {/* Charts row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <SalesTrendChart data={salesTrendData} />
          <RevenueExpensesChart data={revenueExpensesData} />
        </div>

        {/* Bottom row */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TopSellersTable data={topSellers} />
          </div>
          <ActivityTimeline activities={activities} />
        </div>
      </div>
    </DashboardLayout>
  );
}
