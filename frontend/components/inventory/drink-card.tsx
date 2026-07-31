"use client";

import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wine, Edit3, Package, Check, AlertTriangle, X } from "lucide-react";
import { Drink } from "@/types/inventory";

interface DrinkCardProps {
  drink: Drink;
  onEdit: (drink: Drink) => void;
  onUpdateStock: (drink: Drink) => void;
}

export function DrinkCard({ drink, onEdit, onUpdateStock }: DrinkCardProps) {
  const stockQuantity = drink.stock_quantity ?? drink.stock ?? 0;
  const minStockLevel = drink.min_stock ?? 0;

  const getStockStatus = () => {
    if (stockQuantity === 0) {
      return { label: "Out of Stock", color: "text-red-500", bg: "bg-red-500/10", icon: X };
    }
    if (stockQuantity <= minStockLevel) {
      return { label: "Low Stock", color: "text-amber-500", bg: "bg-amber-500/10", icon: AlertTriangle };
    }
    return { label: "In Stock", color: "text-emerald-500", bg: "bg-emerald-500/10", icon: Check };
  };

  const getStockPercentage = () => {
    const maxStock = Math.max(minStockLevel * 3, 50);
    return Math.min(100, (stockQuantity / maxStock) * 100);
  };

  const status = getStockStatus();
  const StatusIcon = status.icon;
  const percentage = getStockPercentage();

  return (
    <Card className="bg-card border-border card-hover overflow-hidden flex flex-col justify-between">
      <CardContent className="p-5 space-y-4">
        {/* Drink Image / Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {drink.image_url ? (
              <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-border">
                <Image src={drink.image_url} alt={drink.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                <Wine className="w-6 h-6" />
              </div>
            )}
            <div>
              <h3 className="font-semibold text-foreground leading-tight">{drink.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {drink.category?.name || drink.category_name || "Sans catégorie"}
              </p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" onClick={() => onEdit(drink)}>
            <Edit3 className="w-4 h-4" />
          </Button>
        </div>

        {/* Pricing */}
        <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-secondary/30 border border-border text-sm">
          <div>
            <p className="text-xs text-muted-foreground">Prix Vente</p>
            <p className="font-semibold text-gold">{(drink.price_sale ?? drink.price ?? 0).toLocaleString()} FC</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Prix Achat</p>
            <p className="font-medium text-foreground">{(drink.price_purchase ?? drink.cost ?? 0).toLocaleString()} FC</p>
          </div>
        </div>

        {/* Stock Level Progress */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Quantité en Stock</span>
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className={`${status.bg} ${status.color} border-0 text-[10px]`}>
                <StatusIcon className="w-3 h-3 mr-1 inline" />
                {status.label}
              </Badge>
              <span className="font-bold text-foreground">{stockQuantity}</span>
            </div>
          </div>

          <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                stockQuantity === 0 ? "bg-red-500" : stockQuantity <= minStockLevel ? "bg-amber-500" : "bg-emerald-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>

          <p className="text-[10px] text-muted-foreground text-right">Seuil d&apos;alerte: {minStockLevel}</p>
        </div>
      </CardContent>

      {/* Action Footer */}
      <div className="p-4 pt-0">
        <Button variant="outline" className="w-full border-border hover:bg-secondary/50" onClick={() => onUpdateStock(drink)}>
          <Package className="w-4 h-4 mr-2" />
          Mettre à jour le stock
        </Button>
      </div>
    </Card>
  );
}
