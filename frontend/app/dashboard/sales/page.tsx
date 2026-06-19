'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import {
  Search,
  Plus,
  Eye,
  CreditCard,
  Banknote,
  Smartphone,
  Calendar,
  User,
  ShoppingCart,
  X,
} from 'lucide-react';
import { mockSales, mockDrinks, mockUsers } from '@/lib/mock-data';
import { Sale, Drink } from '@/lib/types';
import { format } from 'date-fns';
import { formatDistanceToNow } from 'date-fns';

const paymentMethodIcons = {
  cash: { icon: Banknote, label: 'Cash', color: 'text-green-400' },
  card: { icon: CreditCard, label: 'Card', color: 'text-blue-400' },
  transfer: { icon: Smartphone, label: 'Transfer', color: 'text-purple-400' },
};

export default function SalesPage() {
  const [search, setSearch] = useState('');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [showNewSale, setShowNewSale] = useState(false);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [selectedDrinks, setSelectedDrinks] = useState<{ drink: Drink; quantity: number }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter sales
  const filteredSales = mockSales.filter((sale) => {
    const matchesSearch =
      sale.customer_name?.toLowerCase().includes(search.toLowerCase()) ||
      sale.id.toLowerCase().includes(search.toLowerCase());
    const matchesPayment =
      paymentFilter === 'all' || sale.payment_method === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  // Paginate
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddDrink = (drink: Drink) => {
    const existing = selectedDrinks.find((d) => d.drink.id === drink.id);
    if (existing) {
      setSelectedDrinks(
        selectedDrinks.map((d) =>
          d.drink.id === drink.id ? { ...d, quantity: d.quantity + 1 } : d
        )
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
          d.drink.id === drinkId ? { ...d, quantity } : d
        )
      );
    }
  };

  const calculateTotal = () => {
    return selectedDrinks.reduce(
      (sum, item) => sum + item.drink.price * item.quantity,
      0
    );
  };

  const handleCreateSale = () => {
    if (selectedDrinks.length === 0) {
      toast.error('Please add at least one drink to the sale');
      return;
    }
    toast.success('Sale created successfully');
    setShowNewSale(false);
    setSelectedDrinks([]);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-playfair font-bold text-foreground">Sales Management</h1>
            <p className="text-muted-foreground mt-1">
              Manage and track all sales transactions
            </p>
          </div>
          <Dialog open={showNewSale} onOpenChange={setShowNewSale}>
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
                      {mockDrinks.filter(d => d.is_active).map((drink) => (
                        <div
                          key={drink.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 border border-border hover:border-gold/30 transition-colors"
                        >
                          <div className="flex-1">
                            <p className="font-medium text-foreground text-sm">{drink.name}</p>
                            <p className="text-xs text-muted-foreground">
                              €{drink.price.toFixed(2)} • {drink.category?.name}
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
                                €{item.drink.price.toFixed(2)} x {item.quantity}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() =>
                                    handleUpdateQuantity(item.drink.id, item.quantity - 1)
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
                                    handleUpdateQuantity(item.drink.id, item.quantity + 1)
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
                    <span className="text-gold text-xl">€{calculateTotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowNewSale(false)}>
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
        </div>

        {/* Filters */}
        <Card className="bg-card border-border">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by customer or transaction ID..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 bg-secondary/50 border-border focus:border-gold"
                />
              </div>
              <Select value={paymentFilter} onValueChange={setPaymentFilter}>
                <SelectTrigger className="w-full sm:w-[180px] bg-secondary/50 border-border">
                  <SelectValue placeholder="Payment method" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="card">Card</SelectItem>
                  <SelectItem value="transfer">Transfer</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sales table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Recent Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-border hover:bg-transparent">
                    <TableHead className="text-muted-foreground font-medium">Transaction</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Date</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Customer</TableHead>
                    <TableHead className="text-muted-foreground font-medium">Payment</TableHead>
                    <TableHead className="text-right text-muted-foreground font-medium">Amount</TableHead>
                    <TableHead className="text-right text-muted-foreground font-medium">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedSales.map((sale) => {
                    const PaymentInfo = paymentMethodIcons[sale.payment_method];
                    return (
                      <TableRow
                        key={sale.id}
                        className="border-border hover:bg-secondary/30 cursor-pointer"
                        onClick={() => setSelectedSale(sale)}
                      >
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
                              <ShoppingCart className="w-4 h-4 text-gold" />
                            </div>
                            <span className="font-mono text-sm text-muted-foreground">
                              #{sale.id.split('-').pop()}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p className="text-foreground">{format(new Date(sale.created_at), 'MMM d, yyyy')}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(sale.created_at), { addSuffix: true })}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {sale.customer_name ? (
                            <div className="flex items-center gap-2">
                              <Avatar className="w-6 h-6">
                                <AvatarFallback className="text-[10px] bg-gold/20 text-gold">
                                  {sale.customer_name.split(' ').map(n => n[0]).join('')}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-foreground">{sale.customer_name}</span>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">Walk-in</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="gap-1.5 bg-secondary/50"
                          >
                            <PaymentInfo.icon className={`w-3 h-3 ${PaymentInfo.color}`} />
                            {PaymentInfo.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <span className="font-semibold text-gold">
                            €{sale.total_amount.toLocaleString()}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSale(sale);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredSales.length)} of{' '}
                {filteredSales.length} sales
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sale details drawer */}
        <Drawer
          open={!!selectedSale}
          onOpenChange={(open) => !open && setSelectedSale(null)}
        >
          <DrawerContent className="bg-card border-border">
            <div className="mx-auto w-full max-w-lg">
              <DrawerHeader>
                <DrawerTitle className="text-foreground">Sale Details</DrawerTitle>
                <DrawerDescription>
                  Transaction #{selectedSale?.id.split('-').pop()}
                </DrawerDescription>
              </DrawerHeader>

              {selectedSale && (
                <div className="px-4 pb-6 space-y-6">
                  {/* Summary */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gold" />
                        <span className="text-sm font-medium text-foreground">
                          {format(new Date(selectedSale.created_at), 'PPp')}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Staff Member</p>
                      <div className="flex items-center gap-2">
                        <Avatar className="w-6 h-6">
                          <AvatarImage src={selectedSale.user?.avatar_url || ''} />
                          <AvatarFallback className="text-[10px] bg-gold/20 text-gold">
                            {selectedSale.user?.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground">
                          {selectedSale.user?.full_name}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedSale.customer_name && (
                    <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                      <p className="text-xs text-muted-foreground mb-1">Customer</p>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gold" />
                        <span className="text-sm font-medium text-foreground">
                          {selectedSale.customer_name}
                        </span>
                      </div>
                    </div>
                  )}

                  <Separator className="bg-border" />

                  {/* Items */}
                  <div>
                    <p className="text-sm font-medium text-foreground mb-3">Items</p>
                    <div className="space-y-2">
                      {mockDrinks.slice(0, 2).map((drink) => (
                        <div
                          key={drink.id}
                          className="flex items-center justify-between p-3 rounded-lg bg-secondary/20 border border-border"
                        >
                          <div>
                            <p className="text-sm font-medium text-foreground">{drink.name}</p>
                            <p className="text-xs text-muted-foreground">Qty: 1</p>
                          </div>
                          <span className="font-semibold text-gold">
                            €{drink.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  {/* Totals */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="text-foreground">
                        €{selectedSale.total_amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Payment Method</span>
                      <Badge variant="secondary" className="bg-secondary/50">
                        {paymentMethodIcons[selectedSale.payment_method].label}
                      </Badge>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-border">
                      <span className="font-semibold text-foreground">Total</span>
                      <span className="font-bold text-xl text-gold">
                        €{selectedSale.total_amount.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {selectedSale.notes && (
                    <div className="p-3 rounded-lg bg-gold/10 border border-gold/20">
                      <p className="text-xs text-gold mb-1">Notes</p>
                      <p className="text-sm text-foreground">{selectedSale.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </DashboardLayout>
  );
}
