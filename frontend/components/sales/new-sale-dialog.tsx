"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Plus, ShoppingCart, X } from "lucide-react";
import { Drink } from "@/types/inventory";
import saleService from "@/services/sales";

interface NewSaleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  drinks: Drink[];
  onSaleCreated: () => Promise<void> | void;
}

export function NewSaleDialog({
  open,
  onOpenChange,
  drinks,
  onSaleCreated,
}: NewSaleDialogProps) {
  const [selectedDrinks, setSelectedDrinks] = useState<
    { drink: Drink; quantity: number }[]
  >([]);

  const handleAddDrink = (drink: Drink) => {
    const existing = selectedDrinks.find((d) => d.drink.id === drink.id);
    if (existing) {
      setSelectedDrinks(
        selectedDrinks.map((d) =>
          d.drink.id === drink.id ? { ...d, quantity: d.quantity + 1 } : d,
        ),
      );
    } else {
      setSelectedDrinks([...selectedDrinks, { drink, quantity: 1 }]);
    }
  };

  const handleRemoveDrink = (drinkId: string) => {
    setSelectedDrinks(selectedDrinks.filter((d) => d.drink.id !== drinkId));
  };

  const handleUpdateQuantity = (drinkId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveDrink(drinkId);
    } else {
      setSelectedDrinks(
        selectedDrinks.map((d) =>
          d.drink.id === drinkId ? { ...d, quantity } : d,
        ),
      );
    }
  };

  const calculateTotal = () => {
    return selectedDrinks.reduce(
      (sum, item) =>
        sum + (item.drink.price ?? item.drink.price_sale ?? 0) * item.quantity,
      0,
    );
  };

  const handleCreateSale = async () => {
    if (selectedDrinks.length === 0) {
      toast.error("Please add at least one drink to the sale");
      return;
    }
    try {
      await saleService.createSalesFromCart(selectedDrinks);
      toast.success("Vente créée avec succès");
      onOpenChange(false);
      setSelectedDrinks([]);
      await onSaleCreated();
    } catch {
      toast.error("Erreur lors de la création de la vente");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gold hover:bg-gold-light text-pitch font-semibold">
          <Plus className="w-4 h-4 mr-2" />
          New Sale
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Create New Sale</DialogTitle>
          <DialogDescription>
            Add drinks to the order and complete the transaction
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6 py-4">
          {/* Drink selection */}
          <div className="space-y-4">
            <Label className="text-foreground font-medium">Select Drinks</Label>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-2">
                {(Array.isArray(drinks) ? drinks : []).map((drink) => (
                  <div
                    key={drink.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border hover:border-gold/30 transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">
                        {drink.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(
                          drink.price ??
                          drink.price_sale ??
                          0
                        ).toLocaleString()}{" "}
                        FC • {drink.category?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(drink.stock ?? 0).toLocaleString()}{" "}
                        {drink.stock === 1 ? "bouteille" : "bouteilles"} in stock
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddDrink(drink)}
                      className="text-gold hover:text-gold-light hover:bg-gold/10"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Cart */}
          <div className="space-y-4">
            <Label className="text-foreground font-medium">Order Summary</Label>
            <ScrollArea className="h-[250px] pr-4">
              {selectedDrinks.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                  <ShoppingCart className="w-8 h-8 mb-2 opacity-50" />
                  <p className="text-sm">No drinks added yet</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedDrinks.map((item) => (
                    <div
                      key={item.drink.id}
                      className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 border border-border"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground text-sm truncate">
                          {item.drink.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {(
                            item.drink.price ??
                            item.drink.price_sale ??
                            0
                          ).toLocaleString()}{" "}
                          FC x {item.quantity}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.drink.id,
                                item.quantity - 1,
                              )
                            }
                          >
                            -
                          </Button>
                          <span className="w-6 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={() =>
                              handleUpdateQuantity(
                                item.drink.id,
                                item.quantity + 1,
                              )
                            }
                          >
                            +
                          </Button>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-destructive hover:text-destructive"
                          onClick={() => handleRemoveDrink(item.drink.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <Separator className="bg-border" />

            <div className="flex items-center justify-between font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-gold text-xl">
                {calculateTotal().toLocaleString()} FC
              </span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleCreateSale}
            className="bg-gold hover:bg-gold-light text-pitch font-semibold"
          >
            Complete Sale
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
