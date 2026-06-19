'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TopSellingDrink } from '@/lib/types';
import { Wine, TrendingUp } from 'lucide-react';

interface TopSellersTableProps {
  data: TopSellingDrink[];
}

export function TopSellersTable({ data }: TopSellersTableProps) {
  return (
    <Card className="bg-card border-border card-hover">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-foreground">Top Selling Drinks</CardTitle>
            <CardDescription>Best performers this week</CardDescription>
          </div>
          <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-gold" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground font-medium">Drink</TableHead>
              <TableHead className="text-right text-muted-foreground font-medium">Qty Sold</TableHead>
              <TableHead className="text-right text-muted-foreground font-medium">Revenue</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((drink, index) => (
              <TableRow key={drink.name} className="border-border hover:bg-secondary/30">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center text-gold font-semibold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex items-center gap-2">
                      <Wine className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium text-foreground">{drink.name}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Badge variant="secondary" className="bg-secondary/50">
                    {drink.quantity} units
                  </Badge>
                </TableCell>
                <TableCell className="text-right font-semibold text-gold">
                  €{drink.revenue.toLocaleString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
