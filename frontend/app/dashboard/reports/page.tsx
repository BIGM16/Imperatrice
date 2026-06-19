'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  TooltipProps,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import {
  Download,
  FileSpreadsheet,
  BarChart3,
  TrendingUp,
  Calendar,
  Wine,
  Users,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  mockTopSellingDrinks,
  salesByCategory,
  salesBySeller,
  salesByDayOfWeek,
  monthlyRevenueData,
} from '@/lib/mock-data';
import { format } from 'date-fns';

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} className="text-sm">
            <span
              className="inline-block w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color as string }}
            />
            {entry.name}: €{entry.value?.toLocaleString()}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const categoryColors = ['#9C6C29', '#46290C', '#B8923A', '#35220D', '#7C5520'];

export default function ReportsPage() {
  const [dateRange, setDateRange] = useState('month');

  const handleExport = (type: 'csv' | 'pdf') => {
    toast.success(`Report exported as ${type.toUpperCase()}`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-foreground">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">
              Comprehensive insights and performance metrics
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px] bg-secondary/50 border-border">
                <Calendar className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Date range" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="border-border"
              onClick={() => handleExport('csv')}
            >
              <FileSpreadsheet className="w-4 h-4 mr-2" />
              CSV
            </Button>
            <Button
              variant="outline"
              className="border-border"
              onClick={() => handleExport('pdf')}
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold text-foreground">€165,200</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-500 text-sm">
                <TrendingUp className="w-3 h-3" />
                +12.5% from last period
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Wine className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Drinks Sold</p>
                  <p className="text-2xl font-bold text-foreground">2,847</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-500 text-sm">
                <TrendingUp className="w-3 h-3" />
                +8.3% from last period
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                  <p className="text-2xl font-bold text-foreground">892</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-500 text-sm">
                <TrendingUp className="w-3 h-3" />
                +15.7% from last period
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-gold" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Transaction</p>
                  <p className="text-2xl font-bold text-foreground">€185</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-emerald-500 text-sm">
                <TrendingUp className="w-3 h-3" />
                +5.2% from last period
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts row 1 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Sales by category */}
          <Card className="bg-card border-border card-hover">
            <CardHeader>
              <CardTitle className="text-foreground">Sales by Category</CardTitle>
              <CardDescription>Distribution across drink categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="h-[220px] flex-1">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={salesByCategory}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={3}
                        dataKey="value"
                      >
                        {salesByCategory.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={categoryColors[index % categoryColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: number) => `${value}%`}
                        contentStyle={{
                          backgroundColor: '#1a1a1a',
                          border: '1px solid #35220D',
                          borderRadius: '8px',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {salesByCategory.map((category, index) => (
                    <div key={category.name} className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: categoryColors[index] }}
                      />
                      <span className="text-sm text-foreground min-w-[80px]">{category.name}</span>
                      <span className="text-sm font-semibold text-gold ml-auto">
                        {category.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sales by day of week */}
          <Card className="bg-card border-border card-hover">
            <CardHeader>
              <CardTitle className="text-foreground">Sales by Day of Week</CardTitle>
              <CardDescription>Weekly performance breakdown</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={salesByDayOfWeek} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#35220D" />
                    <XAxis
                      dataKey="name"
                      stroke="#8B7355"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#8B7355"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `€${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Revenue" fill="#9C6C29" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts row 2 */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Revenue trend */}
          <Card className="bg-card border-border card-hover">
            <CardHeader>
              <CardTitle className="text-foreground">Monthly Revenue Trend</CardTitle>
              <CardDescription>6-month revenue comparison</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#35220D" />
                    <XAxis
                      dataKey="name"
                      stroke="#8B7355"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#8B7355"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `€${value / 1000}k`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      name="Revenue"
                      stroke="#9C6C29"
                      strokeWidth={3}
                      dot={{ fill: '#9C6C29', strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, fill: '#B8923A' }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sales by seller */}
          <Card className="bg-card border-border card-hover">
            <CardHeader>
              <CardTitle className="text-foreground">Sales by Staff Member</CardTitle>
              <CardDescription>Individual performance ranking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[220px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesBySeller}
                    layout="vertical"
                    margin={{ top: 10, right: 10, left: 80, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#35220D" />
                    <XAxis
                      type="number"
                      stroke="#8B7355"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(value) => `€${value / 1000}k`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      stroke="#8B7355"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" name="Revenue" fill="#9C6C29" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top drinks table */}
        <Card className="bg-card border-border card-hover">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-foreground">Top Performing Drinks</CardTitle>
                <CardDescription>Best sellers ranked by revenue</CardDescription>
              </div>
              <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-gold" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="text-muted-foreground font-medium">Rank</TableHead>
                  <TableHead className="text-muted-foreground font-medium">Drink</TableHead>
                  <TableHead className="text-right text-muted-foreground font-medium">Units Sold</TableHead>
                  <TableHead className="text-right text-muted-foreground font-medium">Revenue</TableHead>
                  <TableHead className="text-right text-muted-foreground font-medium">Share</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockTopSellingDrinks.map((drink, index) => {
                  const totalRevenue = mockTopSellingDrinks.reduce((sum, d) => sum + d.revenue, 0);
                  const share = ((drink.revenue / totalRevenue) * 100).toFixed(1);
                  return (
                    <TableRow key={drink.name} className="border-border hover:bg-secondary/30">
                      <TableCell>
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm',
                          index === 0 && 'bg-gold text-pitch',
                          index === 1 && 'bg-muted text-foreground',
                          index === 2 && 'bg-amber-700/30 text-amber-400',
                          index > 2 && 'bg-secondary text-muted-foreground'
                        )}>
                          {index + 1}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Wine className="w-5 h-5 text-muted-foreground" />
                          <span className="font-medium text-foreground">{drink.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary" className="bg-secondary/50">
                          {drink.quantity} units
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-gold">
                        €{drink.revenue.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div
                            className="h-2 w-20 rounded-full bg-secondary overflow-hidden"
                          >
                            <div
                              className="h-full bg-gold rounded-full"
                              style={{ width: `${share}%` }}
                            />
                          </div>
                          <span className="text-sm text-muted-foreground">{share}%</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
