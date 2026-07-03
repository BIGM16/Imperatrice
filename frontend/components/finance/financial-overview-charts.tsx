"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  Calendar,
} from "lucide-react";
import { subDays } from "date-fns";
import { Expense } from "@/types/finance";
import { Sale } from "@/types/sales";
import { ChartData } from "@/types/dashboard";
import { expenseCategories } from "./expense-categories";

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
        <p className="text-sm text-gold font-semibold">
          {payload[0].value?.toLocaleString()} FC
        </p>
      </div>
    );
  }
  return null;
};

interface FinancialOverviewChartsProps {
  expenses: Expense[];
  sales: Sale[];
  totalRevenue: number;
}

export function FinancialOverviewCharts({
  expenses,
  sales,
  totalRevenue,
}: FinancialOverviewChartsProps) {
  // Get expenses by category
  const expensesByCategory: ChartData[] = expenseCategories
    .map((cat) => ({
      name: cat.value,
      value: expenses
        .filter((e) => e.category === cat.value)
        .reduce((sum, e) => sum + (e.amount || 0), 0),
      color: cat.color,
    }))
    .filter((item) => item.value > 0);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Expense by category pie chart */}
      <Card className="bg-card border-border card-hover">
        <CardHeader>
          <CardTitle className="text-foreground">
            Expenses by Category
          </CardTitle>
          <CardDescription>
            Distribution of expenses this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-6">
            <div className="h-[200px] flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {expensesByCategory.map((category) => (
                <div
                  key={category.name}
                  className="flex items-center gap-2"
                >
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-foreground">
                    {category.name}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    €{category.value.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick stats */}
      <Card className="bg-card border-border card-hover">
        <CardHeader>
          <CardTitle className="text-foreground">
            Financial Overview
          </CardTitle>
          <CardDescription>Key financial metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-gold" />
                <span className="text-sm text-muted-foreground">
                  Card Sales
                </span>
              </div>
              <p className="text-xl font-bold text-foreground">
                €{(totalRevenue * 0.65).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                65% of transactions
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-gold" />
                <span className="text-sm text-muted-foreground">
                  Cash Sales
                </span>
              </div>
              <p className="text-xl font-bold text-foreground">
                €{(totalRevenue * 0.28).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                28% of transactions
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-gold" />
                <span className="text-sm text-muted-foreground">
                  Avg. Transaction
                </span>
              </div>
              <p className="text-xl font-bold text-foreground">€156</p>
              <p className="text-xs text-muted-foreground mt-1">
                Per sale
              </p>
            </div>
            <div className="p-4 rounded-lg bg-secondary/30 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-gold" />
                <span className="text-sm text-muted-foreground">
                  This Month
                </span>
              </div>
              <p className="text-xl font-bold text-foreground">
                {
                  sales.filter(
                    (s) =>
                      new Date(s.created_at ?? Date.now()).getTime() >=
                      subDays(new Date(), 30).getTime(),
                  ).length
                }
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Sales recorded
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
