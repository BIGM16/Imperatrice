"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download } from "lucide-react";

interface ReportsHeaderProps {
  dateRange: string;
  onDateRangeChange: (val: string) => void;
  onExport: (type: "csv" | "pdf") => void;
}

export function ReportsHeader({
  dateRange,
  onDateRangeChange,
  onExport,
}: ReportsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-3xl font-playfair font-bold text-foreground">
          Rapports & Analyses
        </h1>
        <p className="text-muted-foreground mt-1">
          Aperçu des performances, des ventes et des tendances
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Select value={dateRange} onValueChange={onDateRangeChange}>
          <SelectTrigger className="w-[160px] bg-secondary/50 border-border">
            <SelectValue placeholder="Période" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="today">Aujourd&apos;hui</SelectItem>
            <SelectItem value="7days">7 derniers jours</SelectItem>
            <SelectItem value="30days">30 derniers jours</SelectItem>
            <SelectItem value="thisMonth">Ce mois</SelectItem>
            <SelectItem value="lastMonth">Mois dernier</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          className="border-border hover:bg-secondary/50"
          onClick={() => onExport("csv")}
        >
          <Download className="w-4 h-4 mr-2" />
          CSV
        </Button>
        <Button
          className="bg-gold hover:bg-gold-light text-pitch font-semibold"
          onClick={() => onExport("pdf")}
        >
          <Download className="w-4 h-4 mr-2" />
          PDF
        </Button>
      </div>
    </div>
  );
}
