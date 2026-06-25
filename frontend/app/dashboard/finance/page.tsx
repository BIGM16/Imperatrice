"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  TooltipProps,
} from "recharts";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";
import {
  Search,
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  FileText,
  Wallet,
  Package,
  Wrench,
  Users,
  Megaphone,
  Home,
} from "lucide-react";
import { Expense, ChartData, Sale } from "@/types/types";
import api from "@/lib/axios";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

const expenseCategories = [
  { value: "Inventory", icon: Package, color: "#9C6C29" },
  { value: "Utilities", icon: Home, color: "#46290C" },
  { value: "Staff", icon: Users, color: "#B8923A" },
  { value: "Maintenance", icon: Wrench, color: "#35220D" },
  { value: "Marketing", icon: Megaphone, color: "#7C5520" },
  { value: "Other", icon: FileText, color: "#666" },
];

const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
        <p className="text-sm font-medium text-foreground">{payload[0].name}</p>
        <p className="text-sm text-gold font-semibold">
          €{payload[0].value?.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};

export default function FinancePage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [sales, setSales] = useState<(Sale & { created_at?: string | null })[]>([]);
  const itemsPerPage = 8;

  useEffect(() => {
    const loadFinance = async () => {
      try {
        const [expensesResponse, salesResponse] = await Promise.all([
          api.get<Expense[]>("/expenses/"),
          api.get<Sale[]>("/sales/"),
        ]);
        setExpenses(expensesResponse.data || []);
        setSales(salesResponse.data || []);
      } catch {
        setExpenses([]);
        setSales([]);
      }
    };

    loadFinance();
  }, []);

  const totalRevenue = sales.reduce((sum, sale) => sum + ((sale.total_amount ?? sale.total_price ?? 0) as number), 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);
  const netProfit = totalRevenue - totalExpenses;

  // Get expenses by category
  const getCategoryColor = (category: string) => {
    const cat = expenseCategories.find((c) => c.value === category);
    return cat?.color || "#666";
  };

  const expensesByCategory: ChartData[] = expenseCategories
    .map((cat) => ({
      name: cat.value,
      value: expenses
        .filter((e) => e.category === cat.value)
        .reduce((sum, e) => sum + (e.amount || 0), 0),
      color: cat.color,
    }))
    .filter((item) => item.value > 0);

  // Filter expenses
  const filterByDate = (date: Date) => {
    const now = new Date();
    switch (dateFilter) {
      case "today":
        return date.toDateString() === now.toDateString();
      case "week":
        return date >= subDays(now, 7);
      case "month":
        return date >= subDays(now, 30);
      default:
        return true;
    }
  };

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.description?.toLowerCase().includes(search.toLowerCase()) ||
      expense.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" || expense.category === categoryFilter;
    const matchesDate = filterByDate(new Date(expense.created_at ?? Date.now()));
    return matchesSearch && matchesCategory && matchesDate;
  });

  // Paginate
  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const getCategoryIcon = (category: string) => {
    const cat = expenseCategories.find((c) => c.value === category);
    return cat?.icon || FileText;
  };

  return (
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
          <Dialog open={showAddExpense} onOpenChange={setShowAddExpense}>
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold-light text-pitch font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Add Expense
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Add New Expense
                </DialogTitle>
                <DialogDescription>
                  Record a new expense entry
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-foreground">
                    Category
                  </Label>
                  <Select>
                    <SelectTrigger className="bg-secondary/50 border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      {expenseCategories.map((cat) => (
                        <SelectItem key={cat.value} value={cat.value}>
                          <div className="flex items-center gap-2">
                            <cat.icon
                              className="w-4 h-4"
                              style={{ color: cat.color }}
                            />
                            {cat.value}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-foreground">
                    Amount (€)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="bg-secondary/50 border-border focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-foreground">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    defaultValue={format(new Date(), "yyyy-MM-dd")}
                    className="bg-secondary/50 border-border focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Expense details..."
                    className="bg-secondary/50 border-border focus:border-gold resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddExpense(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    toast.success("Expense added successfully");
                    setShowAddExpense(false);
                  }}
                  className="bg-gold hover:bg-gold-light text-pitch font-semibold"
                >
                  Save Expense
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Financial summary cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card className="bg-card border-border card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-500" />
                </div>
                <div className="flex items-center gap-1 text-emerald-500 text-sm font-medium">
                  <ArrowUpRight className="w-4 h-4" />
                  +18.2%
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-foreground">
                €{totalRevenue.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card className="bg-card border-border card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-red-500" />
                </div>
                <div className="flex items-center gap-1 text-red-500 text-sm font-medium">
                  <ArrowDownRight className="w-4 h-4" />
                  +5.4%
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">
                Total Expenses
              </p>
              <p className="text-3xl font-bold text-foreground">
                €{totalExpenses.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>

          <Card
            className={cn(
              "bg-card border-border card-hover",
              netProfit >= 0
                ? "border-l-4 border-l-emerald-500"
                : "border-l-4 border-l-red-500",
            )}
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center",
                    netProfit >= 0 ? "bg-gold/10" : "bg-red-500/10",
                  )}
                >
                  <Wallet
                    className={cn(
                      "w-6 h-6",
                      netProfit >= 0 ? "text-gold" : "text-red-500",
                    )}
                  />
                </div>
                <div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium",
                    netProfit >= 0 ? "text-emerald-500" : "text-red-500",
                  )}
                >
                  {netProfit >= 0 ? (
                    <>
                      <ArrowUpRight className="w-4 h-4" />
                      +12.8%
                    </>
                  ) : (
                    <>
                      <ArrowDownRight className="w-4 h-4" />
                      -8.3%
                    </>
                  )}
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-1">Net Profit</p>
              <p
                className={cn(
                  "text-3xl font-bold",
                  netProfit >= 0 ? "text-gold" : "text-red-500",
                )}
              >
                €{netProfit.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        {/* Charts row */}
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
                  <p className="text-xs text-muted-foreground mt-1">Per sale</p>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-gold" />
                    <span className="text-sm text-muted-foreground">
                      This Month
                    </span>
                  </div>
                  <p className="text-xl font-bold text-foreground">
                    {sales.filter((s) => new Date(s.created_at ?? Date.now()).getTime() >= subDays(new Date(), 30).getTime()).length}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Sales recorded
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Expenses table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Expense History</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search expenses..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border focus:border-gold"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[160px] bg-secondary/50 border-border">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Categories</SelectItem>
                  {expenseCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="w-full sm:w-[160px] bg-secondary/50 border-border">
                  <SelectValue placeholder="Date range" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-medium">
                      Description
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium">
                      Category
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium">
                      Date
                    </TableHead>
                    <TableHead className="text-muted-foreground font-medium">
                      Recorded By
                    </TableHead>
                    <TableHead className="text-right text-muted-foreground font-medium">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedExpenses.map((expense) => {
                    const CategoryIcon = getCategoryIcon(expense.category);
                    return (
                      <TableRow
                        key={expense.id}
                        className="border-border hover:bg-secondary/30"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div
                              className="w-10 h-10 rounded-lg flex items-center justify-center"
                              style={{
                                backgroundColor: `${getCategoryColor(expense.category)}20`,
                              }}
                            >
                              <CategoryIcon
                                className="w-5 h-5"
                                style={{
                                  color: getCategoryColor(expense.category),
                                }}
                              />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">
                                {expense.description ||
                                  `${expense.category} expense`}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                #{expense.id.split("-")[0]}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-secondary/50"
                          >
                            {expense.category}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <p className="text-sm text-foreground">
                            {format(
                              new Date(expense.created_at ?? Date.now()),
                              "MMM d, yyyy",
                            )}
                          </p>
                        </TableCell>
                        <TableCell>
                          {expense.user && (
                            <div className="flex items-center gap-2">
                              <div
                                className="w-6 h-6 rounded-full bg-cover bg-center"
                                style={{
                                  backgroundImage: `url(${expense.user.avatar_url})`,
                                }}
                              />
                              <span className="text-sm text-foreground">
                                {expense.user.full_name}
                              </span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-red-400">
                            -€{expense.amount.toLocaleString()}
                          </span>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, filteredExpenses.length)}{" "}
                of {filteredExpenses.length} expenses
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
