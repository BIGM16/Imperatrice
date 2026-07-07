"use client";

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  User as UserIcon,
  CreditCard,
  Banknote,
  Smartphone,
} from "lucide-react";
import { Sale } from "@/types/sales";
import { Drink } from "@/types/inventory";
import { format } from "date-fns";

const paymentMethodIcons = {
  cash: { icon: Banknote, label: "Cash", color: "text-green-400" },
  card: { icon: CreditCard, label: "Card", color: "text-blue-400" },
  transfer: { icon: Smartphone, label: "Transfer", color: "text-purple-400" },
};

interface SaleDetailsDrawerProps {
  sale: Sale | null;
  onClose: () => void;
  drinks: Drink[];
}

export function SaleDetailsDrawer({
  sale,
  onClose,
  drinks,
}: SaleDetailsDrawerProps) {
  return (
    <Drawer open={!!sale} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="bg-card border-border">
        <div className="mx-auto w-full max-w-lg">
          <DrawerHeader>
            <DrawerTitle className="text-foreground">Détails de la vente</DrawerTitle>
            <DrawerDescription>
              Transaction #
              {String(sale?.id ?? "")
                .split("-")
                .pop()}
            </DrawerDescription>
          </DrawerHeader>

          {sale && (
            <div className="px-4 pb-6 space-y-6">
              {/* Summary */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">
                    Date & Heure
                  </p>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold" />
                    <span className="text-sm font-medium text-foreground">
                      {format(new Date(sale.created_at ?? new Date()), "PPp")}
                    </span>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">
                    Employée
                  </p>
                  <div className="flex items-center gap-2">
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={sale.user?.avatar_url || ""} />
                      <AvatarFallback className="text-[10px] bg-gold/20 text-gold">
                        {sale?.seller_name
                          ? sale.seller_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                          : "U"}{" "}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm font-medium text-foreground">
                      {sale.seller_name}
                    </span>
                  </div>
                </div>
              </div>

              {sale.seller_name && (
                <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-1">Customer</p>
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4 text-gold" />
                    <span className="text-sm font-medium text-foreground">
                      {sale.seller_name}
                    </span>
                  </div>
                </div>
              )}

              <Separator className="bg-border" />

              {/* Items */}
              <div>
                <p className="text-sm font-medium text-foreground mb-3">
                  Articles
                </p>
                <div className="space-y-2">
                  {drinks.slice(0, 2).map((drink) => (
                    <div
                      key={drink.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {drink.name}
                        </p>
                        <p className="text-xs text-muted-foreground">Qté: 1</p>
                      </div>
                      <span className="font-semibold text-gold">
                        {(
                          drink.price ??
                          drink.price_sale ??
                          0
                        ).toLocaleString()}{" "}
                        FC
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span className="text-foreground">
                    {(
                      (sale.total_amount ?? sale.total_price ?? 0) as number
                    ).toLocaleString()}{" "}
                    FC
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Moyen de paiement</span>
                  <Badge variant="secondary" className="bg-secondary/50">
                    {(() => {
                      const paymentMethod = (sale.payment_method ??
                        "cash") as keyof typeof paymentMethodIcons;
                      const info =
                        paymentMethodIcons[paymentMethod] ||
                        paymentMethodIcons.cash;
                      return info.label;
                    })()}
                  </Badge>
                </div>
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="font-bold text-xl text-gold">
                    {(
                      (sale.total_amount ?? sale.total_price ?? 0) as number
                    ).toLocaleString()}{" "}
                    FC
                  </span>
                </div>
              </div>

              {sale.notes && (
                <div className="p-3 rounded-lg bg-gold/10 border border-gold/20">
                  <p className="text-xs text-gold mb-1">Notes</p>
                  <p className="text-sm text-foreground">{sale.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
