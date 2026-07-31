"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Package, Check, AlertTriangle, X } from "lucide-react";
import { Drink } from "@/types/inventory";

interface InventoryStatsCardsProps {
  drinks: Drink[];
}

export function InventoryStatsCards({ drinks }: InventoryStatsCardsProps) {
  const totalDrinks = drinks.length;
  const inStock = drinks.filter((d) => (d.stock_quantity ?? d.stock ?? 0) > (d.min_stock ?? 0)).length;
  const lowStock = drinks.filter(
    (d) => (d.stock_quantity ?? d.stock ?? 0) > 0 && (d.stock_quantity ?? d.stock ?? 0) <= (d.min_stock ?? 0),
  ).length;
  const outOfStock = drinks.filter((d) => (d.stock_quantity ?? d.stock ?? 0) === 0).length;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card className="bg-card border-border card-hover">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
              <Package className="w-5 h-5 text-gold" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Boissons</p>
              <p className="text-2xl font-bold text-foreground">{totalDrinks}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border card-hover">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En Stock</p>
              <p className="text-2xl font-bold text-foreground">{inStock}</p>
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
              <p className="text-sm text-muted-foreground">Stock Bas</p>
              <p className="text-2xl font-bold text-foreground">{lowStock}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-card border-border card-hover">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
              <X className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rupture de Stock</p>
              <p className="text-2xl font-bold text-foreground">{outOfStock}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
