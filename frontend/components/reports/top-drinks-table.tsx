"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Wine } from "lucide-react";

interface TopSellingDrink {
  name: string;
  quantity: number;
  revenue: number;
}

interface TopDrinksTableProps {
  drinks: TopSellingDrink[];
}

export function TopDrinksTable({ drinks }: TopDrinksTableProps) {
  const totalVolume = drinks.reduce((acc, d) => acc + d.quantity, 0);

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground text-lg flex items-center justify-between">
          <span>Top Boissons Vendu</span>
          <span className="text-sm font-normal text-muted-foreground">
            Basé sur le volume des ventes
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">#</TableHead>
              <TableHead className="text-muted-foreground">Boisson</TableHead>
              <TableHead className="text-right text-muted-foreground">
                Quantité vendue
              </TableHead>
              <TableHead className="text-right text-muted-foreground">
                Revenu généré
              </TableHead>
              <TableHead className="text-right text-muted-foreground">
                Part des ventes
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {drinks.map((drink, index) => {
              const share = totalVolume > 0 ? Math.round((drink.quantity / totalVolume) * 100) : 0;
              return (
                <TableRow
                  key={drink.name + index}
                  className="border-border hover:bg-secondary/30"
                >
                  <TableCell className="font-semibold text-gold">
                    #{index + 1}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-md bg-gold/10 flex items-center justify-center text-gold">
                        <Wine className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-foreground">
                        {drink.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium text-foreground">
                    {drink.quantity} bouteilles
                  </TableCell>
                  <TableCell className="text-right font-semibold text-gold">
                    {drink.revenue.toLocaleString()} FC
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gold rounded-full"
                          style={{ width: `${share}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {share}%
                      </span>
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
