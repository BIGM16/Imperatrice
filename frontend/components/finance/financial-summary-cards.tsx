"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FinancialSummaryCardsProps {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  periodLabel?: string;
}

export function FinancialSummaryCards({
  totalRevenue,
  totalExpenses,
  netProfit,
  periodLabel = "Ce mois",
}: FinancialSummaryCardsProps) {
  return (
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
          <p className="text-sm text-muted-foreground mb-1">Revenue Totale</p>
          <p className="text-3xl font-bold text-foreground">
            F.C.{totalRevenue.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{periodLabel}</p>
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
          <p className="text-sm text-muted-foreground mb-1">Total Depenses</p>
          <p className="text-3xl font-bold text-foreground">
            F.C.{totalExpenses.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{periodLabel}</p>
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
              )
            }
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1"> Profit Net</p>
          <p
            className={cn(
              "text-3xl font-bold",
              netProfit >= 0 ? "text-gold" : "text-red-500",
            )}
          >
            F.C.{netProfit.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{periodLabel}</p>
        </CardContent>
      </Card>
    </div>
  );
}
