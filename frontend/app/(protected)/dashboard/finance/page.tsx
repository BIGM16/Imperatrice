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

export default function FinancePage() {
  const [showAddExpense, setShowAddExpense] = useState(false);
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

  const totalRevenue = sales.reduce(
    (sum, sale) =>
      sum + ((sale.total_amount ?? sale.total_price ?? 0) as number),
    0,
  );
  const totalExpenses = expenses.reduce(
    (sum, exp) => sum + (exp.amount || 0),
    0,
  );
  const netProfit = totalRevenue - totalExpenses;

  return (
    <RouteGuard requireAdmin>
      <DashboardLayout>
        <div className="space-y-6">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-playfair font-bold text-foreground">
                Finance Management
              </h1>
              <p className="text-muted-foreground mt-1">
                Track expenses and view financial reports
              </p>
            </div>
            <AddExpenseDialog
              open={showAddExpense}
              onOpenChange={setShowAddExpense}
              onExpenseCreated={loadFinance}
            />
          </div>

          {/* Financial summary cards */}
          <FinancialSummaryCards
            totalRevenue={totalRevenue}
            totalExpenses={totalExpenses}
            netProfit={netProfit}
          />

          {/* Charts row */}
          <FinancialOverviewCharts
            expenses={expenses}
            sales={sales}
            totalRevenue={totalRevenue}
          />

          {/* Expenses table */}
          <ExpensesTable expenses={expenses} />
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
