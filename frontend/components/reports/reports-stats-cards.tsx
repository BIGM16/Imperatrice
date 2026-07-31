"use client";

import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, ShoppingCart, AlertTriangle, TrendingUp } from "lucide-react";

interface SummaryStats {
  totalRevenue: number;
  salesCount: number;
  lowStockCount: number;
  netProfit: number;
}

interface ReportsStatsCardsProps {
  stats: SummaryStats;
}

export function ReportsStatsCards({ stats }: ReportsStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-card border-border card-hover">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">CA Mensuel</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.totalRevenue.toLocaleString()} FC
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border card-hover">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ventes aujourd&apos;hui</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.salesCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border card-hover">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stock bas</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.lowStockCount}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border card-hover">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Bénéfice Net</p>
              <p className="text-2xl font-bold text-foreground">
                {stats.netProfit.toLocaleString()} FC
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
