"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { AddExpenseDialog } from "@/components/finance/add-expense-dialog";
import { FinancialSummaryCards } from "@/components/finance/financial-summary-cards";
import { FinancialOverviewCharts } from "@/components/finance/financial-overview-charts";
import { ExpensesTable } from "@/components/finance/expenses-table";
import { Sale } from "@/types/sales";
import { Expense } from "@/types/finance";
import {
  getDepenses,
  depenseToExpense,
} from "@/services/finance";
import { getSales } from "@/services/sales";
import RouteGuard from "@/components/auth/RouteGuard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "lucide-react";

export default function FinancePage() {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [dateRange, setDateRange] = useState("all");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [sales, setSales] = useState<(Sale & { created_at?: string | null })[]>(
    [],
  );

  const loadFinance = async () => {
    try {
      const [depenses, salesData] = await Promise.all([
        getDepenses(),
        getSales({ ordering: "-created_at" }),
      ]);
      setExpenses(depenses.map(depenseToExpense));
      setSales(salesData);
    } catch {
      setExpenses([]);
      setSales([]);
    }
  };

  useEffect(() => {
    loadFinance();
  }, []);

  const filterByDateRange = (dateStr?: string | null) => {
    if (dateRange === "all") return true;
    if (!dateStr) return false;
    const date = new Date(dateStr);
    const now = new Date();
    
    // Clear times for day comparison
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    if (dateRange === "today") {
      return itemDate.getTime() === today.getTime();
    }
    
    if (dateRange === "week") {
      const oneWeekAgo = new Date(today);
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      return itemDate >= oneWeekAgo;
    }
    
    if (dateRange === "month") {
      const oneMonthAgo = new Date(today);
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return itemDate >= oneMonthAgo;
    }
    
    return true;
  };

  const filteredExpenses = expenses.filter((exp) =>
    filterByDateRange(exp.created_at || exp.date),
  );
  const filteredSales = sales.filter((sale) =>
    filterByDateRange(sale.created_at),
  );

  const totalRevenue = filteredSales.reduce(
    (sum, sale) =>
      sum + ((sale.total_amount ?? sale.total_price ?? 0) as number),
    0,
  );
  const totalExpenses = filteredExpenses.reduce(
    (sum, exp) => sum + ((exp as any).montant || exp.amount || 0),
    0,
  );
  const netProfit = totalRevenue - totalExpenses;

  const getPeriodLabel = () => {
    switch (dateRange) {
      case "today":
        return "Aujourd'hui";
      case "week":
        return "Cette semaine";
      case "month":
        return "Ce mois-ci";
      default:
        return "Toutes les périodes";
    }
  };

  return (
    <RouteGuard requireAdmin>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-foreground">
                Gestion financière
              </h1>
              <p className="text-muted-foreground mt-1">
                Suivre les dépenses et afficher les rapports financiers
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-[180px] bg-secondary/50 border-border">
                  <Calendar className="w-4 h-4 mr-2 text-gold" />
                  <SelectValue placeholder="Période" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">Toutes les périodes</SelectItem>
                  <SelectItem value="today">Aujourd'hui</SelectItem>
                  <SelectItem value="week">Cette semaine</SelectItem>
                  <SelectItem value="month">Ce mois-ci</SelectItem>
                </SelectContent>
              </Select>
              <AddExpenseDialog
                open={showAddExpense}
                onOpenChange={setShowAddExpense}
                onExpenseCreated={loadFinance}
              />
            </div>
          </div>

          {/* Financial summary cards */}
          <FinancialSummaryCards
            totalRevenue={totalRevenue}
            totalExpenses={totalExpenses}
            netProfit={netProfit}
            periodLabel={getPeriodLabel()}
          />

          {/* Charts row */}
          <FinancialOverviewCharts
            expenses={filteredExpenses}
            sales={filteredSales}
            totalRevenue={totalRevenue}
          />

          {/* Expenses table */}
          <ExpensesTable expenses={filteredExpenses} />
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
