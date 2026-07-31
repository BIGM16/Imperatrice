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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CategoryOption {
  id: string;
  name: string;
}

interface AddDrinkDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategoryOption[];
  addCategory: string;
  onAddCategoryChange: (val: string) => void;
  addImageUrl: string;
  onAddImageUrlChange: (val: string) => void;
  isSubmitting: boolean;
  onAddDrink: () => void;
  nameRef: RefObject<HTMLInputElement | null>;
  priceRef: RefObject<HTMLInputElement | null>;
  costRef: RefObject<HTMLInputElement | null>;
  stockRef: RefObject<HTMLInputElement | null>;
  minStockRef: RefObject<HTMLInputElement | null>;
}

export function AddDrinkDialog({
  open,
  onOpenChange,
  categories,
  addCategory,
  onAddCategoryChange,
  addImageUrl,
  onAddImageUrlChange,
  isSubmitting,
  onAddDrink,
  nameRef,
  priceRef,
  costRef,
  stockRef,
  minStockRef,
}: AddDrinkDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card border-border sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-foreground text-xl">
            Ajouter une nouvelle boisson
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Remplissez les détails pour ajouter une boisson au menu et au stock.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="add-name" className="text-foreground">
              Nom de la boisson *
            </Label>
            <Input
              id="add-name"
              ref={nameRef}
              placeholder="ex: Moët & Chandon Brut"
              className="bg-secondary/50 border-border focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="add-category" className="text-foreground">
                Catégorie
              </Label>
              <Select value={addCategory} onValueChange={onAddCategoryChange}>
                <SelectTrigger id="add-category" className="bg-secondary/50 border-border">
                  <SelectValue placeholder="Sélectionner" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-image" className="text-foreground">
                URL de l&apos;image (optionnel)
              </Label>
              <Input
                id="add-image"
                placeholder="https://..."
                value={addImageUrl}
                onChange={(e) => onAddImageUrlChange(e.target.value)}
                className="bg-secondary/50 border-border focus:border-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="add-price" className="text-foreground">
                Prix de vente (FC) *
              </Label>
              <Input
                id="add-price"
                ref={priceRef}
                type="number"
                placeholder="0"
                className="bg-secondary/50 border-border focus:border-gold"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-cost" className="text-foreground">
                Prix d&apos;achat (FC)
              </Label>
              <Input
                id="add-cost"
                ref={costRef}
                type="number"
                placeholder="0"
                className="bg-secondary/50 border-border focus:border-gold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="add-stock" className="text-foreground">
                Stock initial *
              </Label>
              <Input
                id="add-stock"
                ref={stockRef}
                type="number"
                placeholder="0"
                className="bg-secondary/50 border-border focus:border-gold"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="add-min-stock" className="text-foreground">
                Seuil d&apos;alerte *
              </Label>
              <Input
                id="add-min-stock"
                ref={minStockRef}
                type="number"
                placeholder="5"
                className="bg-secondary/50 border-border focus:border-gold"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-border"
          >
            Annuler
          </Button>
          <Button
            onClick={onAddDrink}
            disabled={isSubmitting}
            className="bg-gold hover:bg-gold-light text-pitch font-semibold"
          >
            {isSubmitting ? "Ajout..." : "Ajouter la boisson"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
