"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Drink } from "@/types/inventory";

interface UpdateStockDialogProps {
  drink: Drink | null;
  onOpenChange: (open: boolean) => void;
  newStockValue: number;
  onNewStockValueChange: (val: number) => void;
  isSubmitting: boolean;
  onUpdateStock: () => void;
}

export function UpdateStockDialog({
  drink,
  onOpenChange,
  newStockValue,
  onNewStockValueChange,
  isSubmitting,
  onUpdateStock,
}: UpdateStockDialogProps) {
  const currentStock = drink?.stock_quantity ?? drink?.stock ?? 0;

  return (
    <Dialog open={!!drink} onOpenChange={(open) => !open && onOpenChange(false)}>
      <DialogContent className="bg-card border-border sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">
            Mettre à jour le stock
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Ajuster le niveau de stock pour {drink?.name}.
          </DialogDescription>
        </DialogHeader>

        {drink && (
          <div className="space-y-4 py-4">
            <div className="p-3 rounded-lg bg-secondary/30 border border-border flex justify-between items-center text-sm">
              <span className="text-muted-foreground">Stock actuel:</span>
              <span className="font-bold text-foreground">{currentStock}</span>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="new-stock" className="text-foreground">
                Nouveau niveau de stock
              </Label>
              <Input
                id="new-stock"
                type="number"
                min="0"
                value={newStockValue}
                onChange={(e) => onNewStockValueChange(parseInt(e.target.value) || 0)}
                className="bg-secondary/50 border-border focus:border-gold"
              />
            </div>
          </div>
        )}

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border"
          >
            Annuler
          </Button>
          <Button
            onClick={onUpdateStock}
            disabled={isSubmitting}
            className="bg-gold hover:bg-gold-light text-pitch font-semibold"
          >
            {isSubmitting ? "Mise à jour..." : "Confirmer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
