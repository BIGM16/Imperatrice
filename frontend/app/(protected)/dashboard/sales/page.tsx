"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { NewSaleDialog } from "@/components/sales/new-sale-dialog";
import { SalesFilters } from "@/components/sales/sales-filters";
import { SalesTable } from "@/components/sales/sales-table";
import { SaleDetailsDrawer } from "@/components/sales/sale-details-drawer";
import { Sale } from "@/types/sales";
import { Drink } from "@/types/inventory";
import saleService from "@/services/sales";
import inventoryService from "@/services/inventory";

export default function SalesPage() {
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState<string>("all");
  const [showNewSale, setShowNewSale] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sales, setSales] = useState<Sale[]>([]);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadSalesData = async () => {
      try {
        const [salesData, drinksData] = await Promise.all([
          saleService.getSales({ ordering: "-created_at" }),
          inventoryService.getDrinks(),
        ]);
        setSales(salesData || []);
        setDrinks(drinksData || []);
      } catch {
        setSales([]);
        setDrinks([]);
      }
    };

    loadSalesData();
  }, []);

  const filteredSales = (Array.isArray(sales) ? sales : []).filter((sale) => {
    const matchesSearch =
      sale.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      sale.id.toString().toLowerCase().includes(search.toLowerCase());
    const matchesPayment =
      paymentFilter === "all" || sale.payment_method === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  // Paginate
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const handleSaleCreated = async () => {
    const salesData = await saleService.getSales({ ordering: "-created_at" });
    setSales(salesData || []);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-foreground">
              Sales Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all sales transactions
            </p>
          </div>
          <NewSaleDialog
            open={showNewSale}
            onOpenChange={setShowNewSale}
            drinks={drinks}
            onSaleCreated={handleSaleCreated}
          />
        </div>

        {/* Filters */}
        <SalesFilters
          search={search}
          onSearchChange={setSearch}
          paymentFilter={paymentFilter}
          onPaymentFilterChange={setPaymentFilter}
        />

        {/* Sales table */}
        <SalesTable
          sales={paginatedSales}
          currentPage={currentPage}
          totalPages={totalPages}
          itemsPerPage={itemsPerPage}
          totalItems={filteredSales.length}
          onPageChange={setCurrentPage}
          onViewDetails={setSelectedSale}
        />

        {/* Sale details drawer */}
        <SaleDetailsDrawer
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
          drinks={drinks}
        />
      </div>
    </DashboardLayout>
  );
}

