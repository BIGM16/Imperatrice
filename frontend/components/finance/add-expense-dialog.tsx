"use client";

import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { createDepense, getUsers } from "@/services/finance";
import { User } from "@/types/auth";

interface AddExpenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onExpenseCreated: () => Promise<void> | void;
}

export function AddExpenseDialog({
  open,
  onOpenChange,
  onExpenseCreated,
}: AddExpenseDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedResponsable, setSelectedResponsable] = useState<string>("");
  const motifRef = useRef<HTMLInputElement>(null);
  const montantRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getUsers().then(setUsers).catch(() => setUsers([]));
  }, []);

  const handleAddExpense = async () => {
    const motif = motifRef.current?.value?.trim();
    const montantRaw = montantRef.current?.value || "0";
    const montant = parseFloat(montantRaw);

    if (!motif) {
      toast.error("Le motif est requis");
      return;
    }
    if (!montant || montant <= 0) {
      toast.error("Montant invalide");
      return;
    }

    setIsSubmitting(true);
    try {
      await createDepense({
        motif,
        montant,
        responsable: selectedResponsable
          ? parseInt(selectedResponsable, 10)
          : null,
      });
      toast.success("Dépense enregistrée avec succès");
      // Reset form
      if (motifRef.current) motifRef.current.value = "";
      if (montantRef.current) montantRef.current.value = "";
      setSelectedResponsable("");
      onOpenChange(false);
      await onExpenseCreated();
    } catch {
      toast.error("Erreur lors de l'ajout de la dépense");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-gold hover:bg-gold-light text-pitch font-semibold">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter une dépense
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Ajouter une dépense
          </DialogTitle>
          <DialogDescription>
            Enregistrer une nouvelle dépense
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Montant */}
          <div className="space-y-2">
            <Label htmlFor="amount" className="text-foreground">
              Montant (FC)
            </Label>
            <Input
              id="amount"
              ref={montantRef}
              type="number"
              step="0.01"
              min="1"
              placeholder="0"
              className="bg-secondary/50 border-border focus:border-gold"
            />
          </div>

          {/* Motif */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-foreground">
              Motif de la dépense
            </Label>
            <Input
              id="description"
              ref={motifRef}
              placeholder="Ex: Achat stock, salaire..."
              className="bg-secondary/50 border-border focus:border-gold"
            />
          </div>

          {/* Date */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-foreground">
              Date
            </Label>
            <Input
              id="date"
              type="date"
              defaultValue={format(new Date(), "yyyy-MM-dd")}
              className="bg-secondary/50 border-border focus:border-gold"
            />
          </div>

          {/* Responsable */}
          <div className="space-y-2">
            <Label htmlFor="responsable" className="text-foreground">
              Responsable
            </Label>
            <Select
              value={selectedResponsable}
              onValueChange={setSelectedResponsable}
            >
              <SelectTrigger className="bg-secondary/50 border-border">
                <SelectValue placeholder="Sélectionner un responsable (optionnel)" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="">— Aucun —</SelectItem>
                {users.map((u) => (
                  <SelectItem key={u.id} value={String(u.id)}>
                    {u.first_name || u.last_name
                      ? `${u.first_name || ""} ${u.last_name || ""}`.trim()
                      : u.username || u.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {users.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Aucun responsable disponible.
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            onClick={handleAddExpense}
            disabled={isSubmitting}
            className="bg-gold hover:bg-gold-light text-pitch font-semibold"
          >
            {isSubmitting ? "Enregistrement..." : "Enregistrer"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
