"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search } from "lucide-react";

interface SalesFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
}

export function SalesFilters({
  search,
  onSearchChange,
}: SalesFiltersProps) {
  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Rechercher par ID de transaction..."
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-secondary/50 border-border focus:border-gold"
            />
          </div>
          {/* <Select value={paymentFilter} onValueChange={onPaymentFilterChange}>
            <SelectTrigger className="w-full sm:w-[180px] bg-secondary/50 border-border">
              <SelectValue placeholder="Moyen de paiement" />
            </SelectTrigger>
            <SelectContent className="bg-card border-border">
              <SelectItem value="all">Tous les moyens</SelectItem>
              <SelectItem value="cash">Espèces</SelectItem>
              <SelectItem value="card">Carte</SelectItem>
              <SelectItem value="orange_money">Orange money</SelectItem>
              <SelectItem value="mtn_money">Mtn money</SelectItem>
              <SelectItem value="afrimall">Afrimall</SelectItem>
            </SelectContent>
          </Select> */}
        </div>
      </CardContent>
    </Card>
  );
}
