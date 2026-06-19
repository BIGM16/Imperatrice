'use client';

import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { StatCard } from '@/components/dashboard/stat-card';
import { SalesTrendChart } from '@/components/dashboard/sales-trend-chart';
import { RevenueExpensesChart } from '@/components/dashboard/revenue-expenses-chart';
import { TopSellersTable } from '@/components/dashboard/top-sellers-table';
import { ActivityTimeline } from '@/components/dashboard/activity-timeline';
import { mockDashboardStats, generateSalesTrendData, generateRevenueExpensesData, mockTopSellingDrinks, mockActivities } from '@/lib/mock-data';
import { DollarSign, TrendingUp, TrendingDown, ShoppingCart, AlertTriangle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(mockDashboardStats);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const salesTrendData = generateSalesTrendData();
  const revenueExpensesData = generateRevenueExpensesData();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">
              Welcome back! Here&apos;s what&apos;s happening at Chez l&apos;Impératrice today.
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
              {stats.lowStockCount} items are running low on stock.{' '}
              <Link href="/dashboard/inventory" className="text-gold hover:underline">
                View inventory
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {/* Stats cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Revenue Today"
            value={`€${stats.revenueToday.toLocaleString()}`}
            description="from yesterday"
            icon={TrendingUp}
            trend={{ value: 12.5, isPositive: true }}
            isLoading={isLoading}
          />
          <StatCard
            title="Expenses Today"
            value={`€${stats.expensesToday.toLocaleString()}`}
            description="from yesterday"
            icon={TrendingDown}
            trend={{ value: 3.2, isPositive: false }}
            isLoading={isLoading}
          />
          <StatCard
            title="Net Profit"
            value={`€${stats.netProfit.toLocaleString()}`}
            description="today's margin"
            icon={DollarSign}
            trend={{ value: 8.1, isPositive: stats.netProfit > 0 }}
            isLoading={isLoading}
          />
          <StatCard
            title="Sales Count"
            value={stats.salesCount.toString()}
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
            <TopSellersTable data={mockTopSellingDrinks} />
          </div>
          <ActivityTimeline activities={mockActivities} />
        </div>
      </div>
    </DashboardLayout>
  );
}
