"use client";

import { useState, useEffect, useRef } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Drink } from "@/types/inventory";
import inventoryService from "@/services/inventory";

import { InventoryStatsCards } from "@/components/inventory/inventory-stats-cards";
import { InventoryFilters } from "@/components/inventory/inventory-filters";
import { DrinkCard } from "@/components/inventory/drink-card";
import { DrinkTable } from "@/components/inventory/drink-table";
import { AddDrinkDialog } from "@/components/inventory/add-drink-dialog";
import { EditDrinkDialog } from "@/components/inventory/edit-drink-dialog";
import { UpdateStockDialog } from "@/components/inventory/update-stock-dialog";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddDrink, setShowAddDrink] = useState(false);
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null);
  const [updatingStock, setUpdatingStock] = useState<Drink | null>(null);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addCategory, setAddCategory] = useState<string>("");
  const [addImageUrl, setAddImageUrl] = useState<string>("");
  const [editImageUrl, setEditImageUrl] = useState<string>("");
  const [newStockValue, setNewStockValue] = useState<number>(0);

  // Refs pour les champs de formulaire
  const addNameRef = useRef<HTMLInputElement>(null);
  const addPriceRef = useRef<HTMLInputElement>(null);
  const addCostRef = useRef<HTMLInputElement>(null);
  const addStockRef = useRef<HTMLInputElement>(null);
  const addMinStockRef = useRef<HTMLInputElement>(null);

  const editNameRef = useRef<HTMLInputElement>(null);
  const editPriceRef = useRef<HTMLInputElement>(null);
  const editCostRef = useRef<HTMLInputElement>(null);
  const editMinStockRef = useRef<HTMLInputElement>(null);

  const loadInventory = async () => {
    try {
      const [drinksData, categoriesData] = await Promise.all([
        inventoryService.getDrinks(),
        inventoryService.getCategories(),
      ]);
      setDrinks(drinksData || []);
      setCategories(
        (categoriesData || []).map((cat) => ({
          id: String(cat.id),
          name: cat.name,
        })),
      );
    } catch {
      setDrinks([]);
      setCategories([]);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleAddDrink = async () => {
    const name = addNameRef.current?.value?.trim();
    const price_sale = parseFloat(addPriceRef.current?.value || "0");
    const price_purchase = parseFloat(addCostRef.current?.value || "0");
    const stock = parseInt(addStockRef.current?.value || "0");
    const min_stock = parseInt(addMinStockRef.current?.value || "0");

    if (!name) {
      toast.error("Le nom est requis");
      return;
    }
    setIsSubmitting(true);
    try {
      await inventoryService.createDrink({
        name,
        price_sale,
        price_purchase,
        stock,
        min_stock,
        category_id: addCategory || undefined,
        ...(addImageUrl ? { image_url: addImageUrl } : {}),
      });
      toast.success("Boisson ajoutée avec succès");
      setShowAddDrink(false);
      setAddImageUrl("");
      await loadInventory();
    } catch {
      toast.error("Erreur lors de l'ajout de la boisson");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditDrink = async () => {
    if (!editingDrink) return;
    const name = editNameRef.current?.value?.trim();
    const price_sale = parseFloat(editPriceRef.current?.value || "0");
    const price_purchase = parseFloat(editCostRef.current?.value || "0");
    const min_stock = parseInt(editMinStockRef.current?.value || "0");
    setIsSubmitting(true);
    try {
      await inventoryService.updateDrink(editingDrink.id, {
        name,
        price_sale,
        price_purchase,
        min_stock,
        ...(editImageUrl !== "" ? { image_url: editImageUrl } : {}),
      });
      toast.success("Boisson modifiée avec succès");
      setEditingDrink(null);
      await loadInventory();
    } catch {
      toast.error("Erreur lors de la modification");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStock = async () => {
    if (!updatingStock) return;
    setIsSubmitting(true);
    try {
      await inventoryService.updateDrinkStock(updatingStock.id, newStockValue, "set");
      toast.success("Stock mis à jour");
      setUpdatingStock(null);
      await loadInventory();
    } catch {
      toast.error("Erreur lors de la mise à jour du stock");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDrinks = (Array.isArray(drinks) ? drinks : []).filter((drink) => {
    const matchesSearch = drink.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory =
      categoryFilter === "all" ||
      String(drink.category_id) === categoryFilter ||
      String(drink.category?.id) === categoryFilter;
    const stockQuantity = drink.stock_quantity ?? drink.stock ?? 0;
    const minStockLevel = drink.min_stock ?? 0;
    const matchesStock =
      stockFilter === "all" ||
      (stockFilter === "low" && stockQuantity > 0 && stockQuantity <= minStockLevel) ||
      (stockFilter === "out" && stockQuantity === 0) ||
      (stockFilter === "ok" && stockQuantity > minStockLevel);
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-foreground">
              Gestion des stocks
            </h1>
            <p className="text-muted-foreground mt-1">
              Gérer les boissons et suivre les niveaux de stock
            </p>
          </div>
          <Button
            onClick={() => setShowAddDrink(true)}
            className="bg-gold hover:bg-gold-light text-pitch font-semibold"
          >
            <Plus className="w-4 h-4 mr-2" />
            Ajouter une boisson
          </Button>
        </div>

        {/* Stats Cards */}
        <InventoryStatsCards drinks={drinks} />

        {/* Filters */}
        <InventoryFilters
          search={search}
          onSearchChange={setSearch}
          categoryFilter={categoryFilter}
          onCategoryFilterChange={setCategoryFilter}
          stockFilter={stockFilter}
          onStockFilterChange={setStockFilter}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          categories={categories}
        />

        {/* Drink Items Content */}
        {viewMode === "grid" ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDrinks.map((drink) => (
              <DrinkCard
                key={drink.id}
                drink={drink}
                onEdit={(d) => {
                  setEditingDrink(d);
                  setEditImageUrl(d.image_url || "");
                }}
                onUpdateStock={(d) => {
                  setUpdatingStock(d);
                  setNewStockValue(d.stock_quantity ?? d.stock ?? 0);
                }}
              />
            ))}
          </div>
        ) : (
          <DrinkTable
            drinks={filteredDrinks}
            onEdit={(d) => {
              setEditingDrink(d);
              setEditImageUrl(d.image_url || "");
            }}
            onUpdateStock={(d) => {
              setUpdatingStock(d);
              setNewStockValue(d.stock_quantity ?? d.stock ?? 0);
            }}
          />
        )}
      </div>

      {/* Modals */}
      <AddDrinkDialog
        open={showAddDrink}
        onOpenChange={setShowAddDrink}
        categories={categories}
        addCategory={addCategory}
        onAddCategoryChange={setAddCategory}
        addImageUrl={addImageUrl}
        onAddImageUrlChange={setAddImageUrl}
        isSubmitting={isSubmitting}
        onAddDrink={handleAddDrink}
        nameRef={addNameRef}
        priceRef={addPriceRef}
        costRef={addCostRef}
        stockRef={addStockRef}
        minStockRef={addMinStockRef}
      />

      <EditDrinkDialog
        drink={editingDrink}
        onOpenChange={(open) => !open && setEditingDrink(null)}
        editImageUrl={editImageUrl}
        onEditImageUrlChange={setEditImageUrl}
        isSubmitting={isSubmitting}
        onEditDrink={handleEditDrink}
        nameRef={editNameRef}
        priceRef={editPriceRef}
        costRef={editCostRef}
        minStockRef={editMinStockRef}
      />

      <UpdateStockDialog
        drink={updatingStock}
        onOpenChange={(open) => !open && setUpdatingStock(null)}
        newStockValue={newStockValue}
        onNewStockValueChange={setNewStockValue}
        isSubmitting={isSubmitting}
        onUpdateStock={handleUpdateStock}
      />
    </DashboardLayout>
  );
}
