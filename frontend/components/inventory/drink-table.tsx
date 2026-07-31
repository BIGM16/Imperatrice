"use client";

import Image from "next/image";
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
import { Card, CardContent } from "@/components/ui/card";
import { Wine, Edit3, Package, Check, AlertTriangle, X } from "lucide-react";
import { Drink } from "@/types/inventory";

interface DrinkTableProps {
  drinks: Drink[];
  onEdit: (drink: Drink) => void;
  onUpdateStock: (drink: Drink) => void;
}

export function DrinkTable({ drinks, onEdit, onUpdateStock }: DrinkTableProps) {
  const getStockStatus = (drink: Drink) => {
    const stockQuantity = drink.stock_quantity ?? drink.stock ?? 0;
    const minStockLevel = drink.min_stock ?? 0;
    if (stockQuantity === 0) {
      return { label: "Out of Stock", color: "text-red-500", bg: "bg-red-500/10", icon: X };
    }
    if (stockQuantity <= minStockLevel) {
      return { label: "Low Stock", color: "text-amber-500", bg: "bg-amber-500/10", icon: AlertTriangle };
    }
    return { label: "In Stock", color: "text-emerald-500", bg: "bg-emerald-500/10", icon: Check };
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Boisson</TableHead>
              <TableHead className="text-muted-foreground">Catégorie</TableHead>
              <TableHead className="text-right text-muted-foreground">Prix Vente</TableHead>
              <TableHead className="text-right text-muted-foreground">Prix Achat</TableHead>
              <TableHead className="text-center text-muted-foreground">Stock</TableHead>
              <TableHead className="text-center text-muted-foreground">Statut</TableHead>
              <TableHead className="text-right text-muted-foreground">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drinks.map((drink) => {
              const status = getStockStatus(drink);
              const StatusIcon = status.icon;
              const stockQuantity = drink.stock_quantity ?? drink.stock ?? 0;

              return (
                <TableRow key={drink.id} className="border-border hover:bg-secondary/30">
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {drink.image_url ? (
                        <div className="relative w-9 h-9 rounded-lg overflow-hidden border border-border">
                          <Image src={drink.image_url} alt={drink.name} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                          <Wine className="w-5 h-5" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-foreground">{drink.name}</p>
                        <p className="text-xs text-muted-foreground">#{drink.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-secondary/50">
                      {drink.category?.name || drink.category_name || "Sans catégorie"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-gold">
                    {(drink.price_sale ?? drink.price ?? 0).toLocaleString()} FC
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {(drink.price_purchase ?? drink.cost ?? 0).toLocaleString()} FC
                  </TableCell>
                  <TableCell className="text-center font-bold text-foreground">
                    {stockQuantity}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className={`${status.bg} ${status.color} border-0`}>
                      <StatusIcon className="w-3 h-3 mr-1 inline" />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-border hover:bg-secondary/50"
                        onClick={() => onUpdateStock(drink)}
                      >
                        <Package className="w-4 h-4 mr-1" />
                        Stock
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-foreground"
                        onClick={() => onEdit(drink)}
                      >
                        <Edit3 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
