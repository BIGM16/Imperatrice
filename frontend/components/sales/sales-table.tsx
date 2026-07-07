"use client";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  Eye,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react";
import { Sale } from "@/types/sales";
import { format, formatDistanceToNow } from "date-fns";

const paymentMethodIcons = {
  cash: { icon: Banknote, label: "Cash", color: "text-green-400" },
  card: { icon: CreditCard, label: "Card", color: "text-blue-400" },
  transfer: { icon: Smartphone, label: "Transfer", color: "text-purple-400" },
};

interface SalesTableProps {
  sales: Sale[];
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  onViewDetails: (sale: Sale) => void;
}

export function SalesTable({
  sales,
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
  onViewDetails,
}: SalesTableProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-foreground">Ventes récentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-medium">
                  Transaction
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Date
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Client
                </TableHead>
                <TableHead className="text-muted-foreground font-medium">
                  Paiement
                </TableHead>
                <TableHead className="text-right text-muted-foreground font-medium">
                  Montant
                </TableHead>
                <TableHead className="text-right text-muted-foreground font-medium">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sales.map((sale) => {
                const paymentMethod = (sale.payment_method ??
                  "cash") as keyof typeof paymentMethodIcons;
                const PaymentInfo =
                  paymentMethodIcons[paymentMethod] || paymentMethodIcons.cash;
                return (
                  <TableRow
                    key={sale.id}
                    className="border-border hover:bg-secondary/30 cursor-pointer"
                    onClick={() => onViewDetails(sale)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                          <ShoppingCart className="w-4 h-4 text-gold" />
                        </div>
                        <span className="font-mono text-sm text-muted-foreground">
                          #{String(sale.id).split("-").pop()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p className="text-foreground">
                          {format(
                            new Date(sale.created_at ?? new Date()),
                            "MMM d, yyyy",
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(
                            new Date(sale.created_at ?? new Date()),
                            {
                              addSuffix: true,
                            },
                          )}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      {sale.served_by ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarFallback className="text-[10px] bg-gold/20 text-gold">
                              {sale?.seller_name
                                ? sale.seller_name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                : "??"}{" "}
                              {/* 💡 Affiche "??" si le nom du serveur est introuvable */}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-foreground">
                            {sale.seller_name}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">
                          Walk-in
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="gap-1.5 bg-secondary/50"
                      >
                        <PaymentInfo.icon
                          className={`w-3 h-3 ${PaymentInfo.color}`}
                        />
                        {PaymentInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-semibold text-gold">
                        {(
                          sale.total_amount ??
                          sale.total_price ??
                          0
                        ).toLocaleString()}{" "}
                        FC
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-muted-foreground hover:text-foreground"
                        onClick={(e) => {
                          e.stopPropagation();
                          onViewDetails(sale);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
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
            Affichage {totalItems > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}{" "}
            à {Math.min(currentPage * itemsPerPage, totalItems)} de{" "}
            {totalItems} ventes
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1 || totalItems === 0}
              onClick={() => onPageChange(currentPage - 1)}
            >
              Précédent
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => onPageChange(currentPage + 1)}
            >
              Suivant
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
