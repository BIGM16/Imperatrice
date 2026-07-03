"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Search,
  Plus,
  Package,
  AlertTriangle,
  Check,
  X,
  Edit3,
  ArrowUp,
  ArrowDown,
  Wine,
  Grid3X3,
  List,
} from "lucide-react";
import { Drink } from "@/types/inventory";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import inventoryService from "@/services/inventory";

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [stockFilter, setStockFilter] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showAddDrink, setShowAddDrink] = useState(false);
  const [editingDrink, setEditingDrink] = useState<Drink | null>(null);
  const [updatingStock, setUpdatingStock] = useState<Drink | null>(null);
  const [drinks, setDrinks] = useState<Drink[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addCategory, setAddCategory] = useState<string>("");

  // Refs pour les champs de formulaire
  const addNameRef = useRef<HTMLInputElement>(null);
  const addPriceRef = useRef<HTMLInputElement>(null);
  const addCostRef = useRef<HTMLInputElement>(null);
  const addStockRef = useRef<HTMLInputElement>(null);
  const editNameRef = useRef<HTMLInputElement>(null);
  const editPriceRef = useRef<HTMLInputElement>(null);
  const editCostRef = useRef<HTMLInputElement>(null);
  const editMinStockRef = useRef<HTMLInputElement>(null);
  const newStockRef = useRef<HTMLInputElement>(null);

  const loadInventory = async () => {
    try {
      const [drinksData, categoriesData] = await Promise.all([
        inventoryService.getDrinks(),
        inventoryService.getCategories(),
      ]);
      setDrinks(drinksData || []);
      setCategories(
        categoriesData.map((cat) => ({
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
    const min_stock = parseInt(newStockRef.current?.value || "0");
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
      });
      toast.success("Boisson ajoutée avec succès");
      setShowAddDrink(false);
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
    const newQty = parseInt(newStockRef.current?.value || "0");
    setIsSubmitting(true);
    try {
      await inventoryService.updateDrinkStock(updatingStock.id, newQty, "set");
      toast.success("Stock mis à jour");
      setUpdatingStock(null);
      await loadInventory();
    } catch {
      toast.error("Erreur lors de la mise à jour du stock");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDrinks = (Array.isArray(drinks) ? drinks : []).filter(
    (drink) => {
      const matchesSearch = drink.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        categoryFilter === "all" || drink.category_id === categoryFilter;
      const stockQuantity = drink.stock_quantity ?? drink.stock ?? 0;
      const minStockLevel = drink.min_stock ?? 0;
      const matchesStock =
        stockFilter === "all" ||
        (stockFilter === "low" &&
          stockQuantity > 0 &&
          stockQuantity <= minStockLevel) ||
        (stockFilter === "out" && stockQuantity === 0) ||
        (stockFilter === "ok" && stockQuantity > minStockLevel);
      return matchesSearch && matchesCategory && matchesStock;
    },
  );

  const getStockStatus = (drink: Drink) => {
    const stockQuantity = drink.stock_quantity ?? drink.stock ?? 0;
    const minStockLevel = drink.min_stock ?? 0;
    if (stockQuantity === 0) {
      return {
        label: "Out of Stock",
        color: "text-red-500",
        bg: "bg-red-500/10",
        icon: X,
      };
    }
    if (stockQuantity <= minStockLevel) {
      return {
        label: "Low Stock",
        color: "text-amber-500",
        bg: "bg-amber-500/10",
        icon: AlertTriangle,
      };
    }
    return {
      label: "In Stock",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      icon: Check,
    };
  };

  const getStockPercentage = (drink: Drink) => {
    const stockQuantity = drink.stock_quantity ?? drink.stock ?? 0;
    const minStockLevel = drink.min_stock ?? 0;
    const maxStock = Math.max(minStockLevel * 3, 50);
    return Math.min(100, (stockQuantity / maxStock) * 100);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-foreground">
              Inventory Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage drinks and track stock levels
            </p>
          </div>
          <Dialog open={showAddDrink} onOpenChange={setShowAddDrink}>
            <DialogTrigger asChild>
              <Button className="bg-gold hover:bg-gold-light text-pitch font-semibold">
                <Plus className="w-4 h-4 mr-2" />
                Add Drink
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md bg-card border-border">
              <DialogHeader>
                <DialogTitle className="text-foreground">
                  Add New Drink
                </DialogTitle>
                <DialogDescription>
                  Enter the details for the new drink
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground">
                    Nom
                  </Label>
                  <Input
                    id="name"
                    ref={addNameRef}
                    placeholder="Drink name"
                    className="bg-secondary/50 border-border focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-foreground">
                    Categorie
                  </Label>
                  <Select onValueChange={setAddCategory}>
                    <SelectTrigger className="bg-secondary/50 border-border">
                      <SelectValue placeholder="Select category" />
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price" className="text-foreground">
                      Prix de vente (FC)
                    </Label>
                    <Input
                      id="price"
                      ref={addPriceRef}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="bg-secondary/50 border-border focus:border-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost" className="text-foreground">
                      Prix d&apos;achat (FC)
                    </Label>
                    <Input
                      id="cost"
                      ref={addCostRef}
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className="bg-secondary/50 border-border focus:border-gold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock" className="text-foreground">
                      Stock initial
                    </Label>
                    <Input
                      id="stock"
                      ref={addStockRef}
                      type="number"
                      placeholder="0"
                      className="bg-secondary/50 border-border focus:border-gold"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-stock" className="text-foreground">
                      Stock minimum
                    </Label>
                    <Input
                      id="min_stock"
                      type="number"
                      ref={newStockRef}
                      placeholder="10"
                      className="bg-secondary/50 border-border focus:border-gold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-foreground">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Drink description"
                    className="bg-secondary/50 border-border focus:border-gold resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setShowAddDrink(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddDrink}
                  disabled={isSubmitting}
                  className="bg-gold hover:bg-gold-light text-pitch font-semibold"
                >
                  {isSubmitting ? "Ajout..." : "Add Drink"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="bg-card border-border card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Items</p>
                  <p className="text-2xl font-bold text-foreground">
                    {drinks.length}
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-gold/10 flex items-center justify-center">
                  <Package className="w-5 h-5 text-gold" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">En Stock</p>
                  <p className="text-2xl font-bold text-emerald-500">
                    {
                      drinks.filter((d) => {
                        const stockQuantity = d.stock_quantity ?? d.stock ?? 0;
                        const minStockLevel = d.min_stock ?? 0;
                        return stockQuantity > minStockLevel;
                      }).length
                    }
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <Check className="w-5 h-5 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock</p>
                  <p className="text-2xl font-bold text-amber-500">
                    {
                      drinks.filter((d) => {
                        const stockQuantity = d.stock_quantity ?? d.stock ?? 0;
                        const minStockLevel = d.min_stock ?? 0;
                        return (
                          stockQuantity > 0 && stockQuantity <= minStockLevel
                        );
                      }).length
                    }
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border card-hover">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Stock vidé</p>
                  <p className="text-2xl font-bold text-red-500">
                    {
                      drinks.filter(
                        (d) => (d.stock_quantity ?? d.stock ?? 0) === 0,
                      ).length
                    }
                  </p>
                </div>
                <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search drinks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border focus:border-gold"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[160px] bg-secondary/50 border-border">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger className="w-full sm:w-[160px] bg-secondary/50 border-border">
                  <SelectValue placeholder="Stock status" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ok">In Stock</SelectItem>
                  <SelectItem value="low">Low Stock</SelectItem>
                  <SelectItem value="out">Out of Stock</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex gap-1">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "bg-gold text-pitch" : ""}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "bg-gold text-pitch" : ""}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory grid/list */}
        {viewMode === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredDrinks.map((drink) => {
              const status = getStockStatus(drink);
              return (
                <Card
                  key={drink.id}
                  className="bg-card border-border card-hover overflow-hidden"
                >
                  {/* Image placeholder */}
                  <div className="h-32 bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center">
                    <Wine className="w-12 h-12 text-muted-foreground/30" />
                  </div>
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base font-semibold text-foreground truncate">
                          {drink.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {drink.category?.name}
                        </p>
                      </div>
                      <Badge className={cn("text-xs", status.bg, status.color)}>
                        {status.label}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {/* Price row */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Prix
                        </span>
                        <span className="font-semibold text-gold">
                          {(
                            drink.price ??
                            drink.price_sale ??
                            0
                          ).toLocaleString()}{" "}
                          FC
                        </span>
                      </div>

                      {/* Stock progress */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Stock</span>
                          <span className="font-medium text-foreground">
                            {drink.stock_quantity ?? drink.stock ?? 0} units
                          </span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-secondary overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full transition-all",
                              (drink.stock_quantity ?? drink.stock ?? 0) <=
                                (drink.min_stock ?? 0)
                                ? (drink.stock_quantity ?? drink.stock ?? 0) ===
                                  0
                                  ? "bg-red-500"
                                  : "bg-amber-500"
                                : "bg-gold",
                            )}
                            style={{ width: `${getStockPercentage(drink)}%` }}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Min: {drink.min_stock ?? 0} units
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 border-border hover:border-gold/30"
                          onClick={() => setUpdatingStock(drink)}
                        >
                          Update Stock
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingDrink(drink)}
                        >
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="bg-card border-border">
            <CardContent className="pt-6">
              <ScrollArea className="h-[600px]">
                <div className="space-y-2">
                  {filteredDrinks.map((drink) => {
                    const status = getStockStatus(drink);
                    return (
                      <div
                        key={drink.id}
                        className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 border border-border hover:border-gold/30 transition-colors"
                      >
                        <Wine className="w-8 h-8 text-muted-foreground flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground truncate">
                              {drink.name}
                            </p>
                            <Badge
                              className={cn("text-xs", status.bg, status.color)}
                            >
                              {status.label}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {drink.category?.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gold">
                            {(
                              drink.price ??
                              drink.price_sale ??
                              0
                            ).toLocaleString()}{" "}
                            FC
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Stock: {drink.stock_quantity ?? drink.stock ?? 0}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setUpdatingStock(drink)}
                          >
                            Update
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setEditingDrink(drink)}
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Update stock dialog */}
        <Dialog
          open={!!updatingStock}
          onOpenChange={(open) => !open && setUpdatingStock(null)}
        >
          <DialogContent className="max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Update Stock
              </DialogTitle>
              <DialogDescription>{updatingStock?.name}</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/30 border border-border">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Current Stock</p>
                  <p className="text-2xl font-bold text-foreground">
                    {updatingStock
                      ? (updatingStock.stock_quantity ??
                        updatingStock.stock ??
                        0)
                      : 0}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Min Level</p>
                  <p className="text-lg font-semibold text-muted-foreground">
                    {updatingStock?.min_stock ?? 0}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-stock" className="text-foreground">
                  New Stock Quantity
                </Label>
                <Input
                  id="new-stock"
                  type="number"
                  defaultValue={
                    updatingStock
                      ? (updatingStock.stock_quantity ??
                        updatingStock.stock ??
                        0)
                      : 0
                  }
                  className="bg-secondary/50 border-border focus:border-gold"
                />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (updatingStock) {
                      setUpdatingStock({
                        ...updatingStock,
                        stock_quantity:
                          (updatingStock.stock_quantity ??
                            updatingStock.stock ??
                            0) + 10,
                      });
                    }
                  }}
                >
                  <ArrowUp className="w-4 h-4 mr-2" />
                  Add 10
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => {
                    if (updatingStock) {
                      setUpdatingStock({
                        ...updatingStock,
                        stock_quantity: Math.max(
                          0,
                          (updatingStock.stock_quantity ??
                            updatingStock.stock ??
                            0) - 10,
                        ),
                      });
                    }
                  }}
                >
                  <ArrowDown className="w-4 h-4 mr-2" />
                  Remove 10
                </Button>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setUpdatingStock(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleUpdateStock}
                disabled={isSubmitting}
                className="bg-gold hover:bg-gold-light text-pitch font-semibold"
              >
                {isSubmitting ? "Mise à jour..." : "Update Stock"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit drink dialog */}
        <Dialog
          open={!!editingDrink}
          onOpenChange={(open) => !open && setEditingDrink(null)}
        >
          <DialogContent className="max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Modifier boisson
              </DialogTitle>
              <DialogDescription>
                Mettre à jour les détails de la boisson
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name" className="text-foreground">
                  Nom
                </Label>
                <Input
                  id="edit-name"
                  ref={editNameRef}
                  defaultValue={editingDrink?.name}
                  className="bg-secondary/50 border-border focus:border-gold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-price" className="text-foreground">
                    Prix de vente (FC)
                  </Label>
                  <Input
                    id="edit-price"
                    ref={editPriceRef}
                    type="number"
                    step="0.01"
                    defaultValue={
                      editingDrink?.price_sale ?? editingDrink?.price
                    }
                    className="bg-secondary/50 border-border focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-cost" className="text-foreground">
                    Prix d&apos;achat (FC)
                  </Label>
                  <Input
                    id="edit-cost"
                    ref={editCostRef}
                    type="number"
                    step="0.01"
                    defaultValue={
                      editingDrink?.price_purchase ?? editingDrink?.cost
                    }
                    className="bg-secondary/50 border-border focus:border-gold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-min-stock" className="text-foreground">
                    Stock minimal (FC)
                  </Label>
                  <Input
                    id="edit-min-stock"
                    ref={editMinStockRef}
                    type="number"
                    step="0.01"
                    defaultValue={
                      editingDrink?.min_stock ?? 0
                    }
                    className="bg-secondary/50 border-border focus:border-gold"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingDrink(null)}>
                Cancel
              </Button>
              <Button
                onClick={handleEditDrink}
                disabled={isSubmitting}
                className="bg-gold hover:bg-gold-light text-pitch font-semibold"
              >
                {isSubmitting ? "Sauvegarde..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
