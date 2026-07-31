"use client";

import { RefObject } from "react";
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

interface EditDrinkDialogProps {
  drink: Drink | null;
  onOpenChange: (open: boolean) => void;
  editImageUrl: string;
  onEditImageUrlChange: (val: string) => void;
  isSubmitting: boolean;
  onEditDrink: () => void;
  nameRef: RefObject<HTMLInputElement | null>;
  priceRef: RefObject<HTMLInputElement | null>;
  costRef: RefObject<HTMLInputElement | null>;
  minStockRef: RefObject<HTMLInputElement | null>;
}

export function EditDrinkDialog({
  drink,
  onOpenChange,
  editImageUrl,
  onEditImageUrlChange,
  isSubmitting,
  onEditDrink,
  nameRef,
  priceRef,
  costRef,
  minStockRef,
}: EditDrinkDialogProps) {
  return (
    <Dialog open={!!drink} onOpenChange={(open) => !open && onOpenChange(false)}>
      <DialogContent className="bg-card border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">
            Modifier la boisson
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Modifiez les informations de {drink?.name}.
          </DialogDescription>
        </DialogHeader>

        {drink && (
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name" className="text-foreground">
                Nom
              </Label>
              <Input
                id="edit-name"
                ref={nameRef}
                defaultValue={drink.name}
                className="bg-secondary/50 border-border focus:border-gold"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-image" className="text-foreground">
                URL de l&apos;image
              </Label>
              <Input
                id="edit-image"
                placeholder="https://..."
                value={editImageUrl}
                onChange={(e) => onEditImageUrlChange(e.target.value)}
                className="bg-secondary/50 border-border focus:border-gold"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-price" className="text-foreground">
                  Prix de vente (FC)
                </Label>
                <Input
                  id="edit-price"
                  ref={priceRef}
                  type="number"
                  defaultValue={drink.price_sale ?? drink.price ?? 0}
                  className="bg-secondary/50 border-border focus:border-gold"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-cost" className="text-foreground">
                  Prix d&apos;achat (FC)
                </Label>
                <Input
                  id="edit-cost"
                  ref={costRef}
                  type="number"
                  defaultValue={drink.price_purchase ?? drink.cost ?? 0}
                  className="bg-secondary/50 border-border focus:border-gold"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-min-stock" className="text-foreground">
                Seuil d&apos;alerte stock
              </Label>
              <Input
                id="edit-min-stock"
                ref={minStockRef}
                type="number"
                defaultValue={drink.min_stock ?? 5}
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
            onClick={onEditDrink}
            disabled={isSubmitting}
            className="bg-gold hover:bg-gold-light text-pitch font-semibold"
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer les modifications"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
