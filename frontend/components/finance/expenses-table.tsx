"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, FileText } from "lucide-react";
import { format, subDays } from "date-fns";
import { Expense } from "@/types/finance";
import { expenseCategories } from "./expense-categories";

const getCategoryColor = (category: string) => {
  const cat = expenseCategories.find((c) => c.value === category);
  return cat?.color || "#666";
};

const getCategoryIcon = (category: string) => {
  const cat = expenseCategories.find((c) => c.value === category);
  return cat?.icon || FileText;
};

interface ExpensesTableProps {
  expenses: Expense[];
}

export function ExpensesTable({ expenses }: ExpensesTableProps) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, categoryFilter, dateFilter]);

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
      (expense.description ?? "")
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      (expense.category ?? "").toLowerCase().includes(search.toLowerCase()) ||
      false;
    const matchesCategory =
      categoryFilter === "all" || expense.category === categoryFilter;
    const matchesDate = filterByDate(
      new Date(expense.created_at ?? Date.now()),
    );
    return matchesSearch && matchesCategory && matchesDate;
  });

  const totalPages = Math.ceil(filteredExpenses.length / itemsPerPage);
  const paginatedExpenses = filteredExpenses.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Historique des dépenses</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher une dépense..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 bg-secondary/50 border-border focus:border-gold"
            />
          </div>
          <Select
            value={categoryFilter}
            onValueChange={setCategoryFilter}
          >
            <SelectTrigger className="w-full sm:w-[180px] bg-secondary/50 border-border">
              <SelectValue placeholder="Catégorie" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">Toutes les catégories</SelectItem>
              {expenseCategories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-[180px] bg-secondary/50 border-border">
              <SelectValue placeholder="Période" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">Toutes les périodes</SelectItem>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois-ci</SelectItem>
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
                  Catégorie
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Date
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Enregistré par
                </TableHead>
                <TableHead className="text-right text-muted-foreground font-medium">
                  Montant
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
                            {expense.motif || expense.description ||
                              `${expense.category} dépense`}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            #{expense.id}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-secondary/50">
                        {expense.category || "Non-catégorisé"}
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
                      {expense.responsable_nom ? (
                        <div className="flex items-center gap-2">
                          <div
                            className="w-7 h-7 rounded-full bg-gold/20 flex items-center justify-center text-gold font-semibold text-xs"
                          >
                            {expense.responsable_nom.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm text-foreground">
                            {expense.responsable_nom}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-red-400">
                        -F.C.{(expense?.amount ?? 0).toLocaleString()}
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
            Affichage de {filteredExpenses.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0} à{" "}
            {Math.min(
              currentPage * itemsPerPage,
              filteredExpenses.length,
            )}{" "}
            de {filteredExpenses.length} dépenses
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || filteredExpenses.length === 0}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
