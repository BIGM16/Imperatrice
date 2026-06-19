import { User, Category, Drink, Sale, Expense, AuditLog, ChartData, TopSellingDrink, Activity, DashboardStats } from './types';

// Mock user data
export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@imperatrice.com',
    full_name: 'Sophie Laurent',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    email: 'manager@imperatrice.com',
    full_name: 'Jean-Pierre Moreau',
    role: 'manager',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    email: 'staff@imperatrice.com',
    full_name: 'Marie Dubois',
    role: 'staff',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

// Mock categories
export const mockCategories: Category[] = [
  { id: '1', name: 'Spirits', description: 'Whiskey, vodka, gin, rum, tequila' },
  { id: '2', name: 'Wine', description: 'Red, white, sparkling wines' },
  { id: '3', name: 'Beer', description: 'Craft beers, lagers, ales' },
  { id: '4', name: 'Cocktails', description: 'Mixed drinks and signatures' },
  { id: '5', name: 'Non-Alcoholic', description: 'Soft drinks, juices' },
];

// Mock drinks
export const mockDrinks: Drink[] = [
  {
    id: '1',
    name: 'Château Margaux 2015',
    description: 'Premium Bordeaux red wine with rich tannins',
    category_id: '2',
    price: 85.00,
    cost: 35.00,
    stock_quantity: 24,
    min_stock_level: 6,
    image_url: 'https://images.unsplash.com/photo-1510812431401-0d6a5c8b4e6e?w=400',
    is_active: true,
    category: mockCategories.find(c => c.id === '2'),
  },
  {
    id: '2',
    name: 'Dom Pérignon Vintage',
    description: 'Luxury champagne with elegant bubbles',
    category_id: '2',
    price: 320.00,
    cost: 180.00,
    stock_quantity: 8,
    min_stock_level: 3,
    image_url: 'https://images.unsplash.com/photo-1558433887-9be3d2f22adc?w=400',
    is_active: true,
    category: mockCategories.find(c => c.id === '2'),
  },
  {
    id: '3',
    name: 'Macallan 18 Year',
    description: 'Single malt Scotch whisky aged in sherry casks',
    category_id: '1',
    price: 75.00,
    cost: 32.00,
    stock_quantity: 18,
    min_stock_level: 5,
    image_url: 'https://images.unsplash.com/photo-1527281400683-7c6fd2593e3d?w=400',
    is_active: true,
    category: mockCategories.find(c => c.id === '1'),
  },
  {
    id: '4',
    name: 'Hennessy X.O',
    description: 'Premium cognac with complex flavor profile',
    category_id: '1',
    price: 65.00,
    cost: 28.00,
    stock_quantity: 22,
    min_stock_level: 6,
    image_url: 'https://images.unsplash.com/photo-1569529465828-56a83c2a5e0c?w=400',
    is_active: true,
    category: mockCategories.find(c => c.id === '1'),
  },
  {
    id: '5',
    name: 'Belvedere Vodka',
    description: 'Premium Polish rye vodka',
    category_id: '1',
    price: 18.00,
    cost: 8.00,
    stock_quantity: 45,
    min_stock_level: 15,
    image_url: 'https://images.unsplash.com/photo-1608885898951-8b1e7a4c8c9d?w=400',
    is_active: true,
    category: mockCategories.find(c => c.id === '1'),
  },
  {
    id: '6',
    name: 'Imperial Old Fashioned',
    description: 'Bourbon, bitters, orange zest, luxury cherry',
    category_id: '4',
    price: 22.00,
    cost: 8.50,
    stock_quantity: 0,
    min_stock_level: 0,
    image_url: 'https://images.unsplash.com/photo-1514362545857-3bc16c4e7d6b?w=400',
    is_active: true,
    category: mockCategories.find(c => c.id === '4'),
  },
  {
    id: '7',
    name: 'Chimay Blue',
    description: 'Trappist beer with complex flavor profile',
    category_id: '3',
    price: 12.00,
    cost: 5.50,
    stock_quantity: 36,
    min_stock_level: 12,
    image_url: 'https://images.unsplash.com/photo-1535958636474-b021ee883b14?w=400',
    is_active: true,
    category: mockCategories.find(c => c.id === '3'),
  },
  {
    id: '8',
    name: 'Espresso Martini',
    description: 'Vodka, coffee liqueur, fresh espresso',
    category_id: '4',
    price: 18.00,
    cost: 7.00,
    stock_quantity: 0,
    min_stock_level: 0,
    image_url: 'https://images.unsplash.com/photo-1545438102-799c3991ffef?w=400',
    is_active: true,
    category: mockCategories.find(c => c.id === '4'),
  },
  {
    id: '9',
    name: 'Tanqueray No. Ten',
    description: 'Premium gin with fresh citrus notes',
    category_id: '1',
    price: 16.00,
    cost: 7.00,
    stock_quantity: 4,
    min_stock_level: 12,
    image_url: 'https://images.unsplash.com/photo-1558080311-c98a88d5c5b4?w=400',
    is_active: true,
    category: mockCategories.find(c => c.id === '1'),
  },
  {
    id: '10',
    name: 'Fresh Lime Mojito',
    description: 'White rum, fresh mint, lime, soda',
    category_id: '4',
    price: 15.00,
    cost: 5.50,
    stock_quantity: 0,
    min_stock_level: 0,
    image_url: 'https://images.unsplash.com/photo-1551538827-9c037e4c40b0?w=400',
    is_active: true,
    category: mockCategories.find(c => c.id === '4'),
  },
];

// Generate sales for the past 30 days
const generateSales = (): Sale[] => {
  const sales: Sale[] = [];
  const paymentMethods: ('cash' | 'card' | 'transfer')[] = ['cash', 'card', 'transfer'];
  const customerNames = [
    'Monsieur Blanc', 'Madame Rousseau', 'Monsieur Bernard', 'Count de Valois',
    'Madame Laurent', 'Baron Dubois', 'Mademoiselle Claire', 'Monsieur Antoine',
    null, null, null // Some anonymous sales
  ];
  const amounts = [56, 75, 85, 93, 142, 156, 198, 245, 320, 412];

  for (let i = 30; i >= 0; i--) {
    const salesPerDay = Math.floor(Math.random() * 8) + 3;
    for (let j = 0; j < salesPerDay; j++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(Math.floor(Math.random() * 12) + 12);
      date.setMinutes(Math.floor(Math.random() * 60));

      sales.push({
        id: `sale-${i}-${j}`,
        user_id: '3',
        total_amount: amounts[Math.floor(Math.random() * amounts.length)],
        payment_method: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
        customer_name: customerNames[Math.floor(Math.random() * customerNames.length)],
        notes: Math.random() > 0.7 ? 'VIP customer' : null,
        created_at: date.toISOString(),
        user: mockUsers.find(u => u.id === '3'),
      });
    }
  }

  return sales.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
};

export const mockSales = generateSales();

// Mock expenses
export const mockExpenses: Expense[] = [
  {
    id: '1',
    user_id: '1',
    category: 'Inventory',
    amount: 2450.00,
    description: 'Weekly spirits restock - premium whiskey selection',
    receipt_url: null,
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user: mockUsers.find(u => u.id === '1'),
  },
  {
    id: '2',
    user_id: '1',
    category: 'Utilities',
    amount: 380.00,
    description: 'Monthly electricity bill',
    receipt_url: null,
    created_at: new Date(Date.now() - 259200000).toISOString(),
    user: mockUsers.find(u => u.id === '1'),
  },
  {
    id: '3',
    user_id: '1',
    category: 'Staff',
    amount: 1200.00,
    description: 'Staff training and certification program',
    receipt_url: null,
    created_at: new Date(Date.now() - 432000000).toISOString(),
    user: mockUsers.find(u => u.id === '1'),
  },
  {
    id: '4',
    user_id: '1',
    category: 'Maintenance',
    amount: 450.00,
    description: 'HVAC system repair and maintenance',
    receipt_url: null,
    created_at: new Date(Date.now() - 604800000).toISOString(),
    user: mockUsers.find(u => u.id === '1'),
  },
  {
    id: '5',
    user_id: '1',
    category: 'Inventory',
    amount: 1800.00,
    description: 'Wine collection replenishment',
    receipt_url: null,
    created_at: new Date(Date.now() - 604800000).toISOString(),
    user: mockUsers.find(u => u.id === '1'),
  },
  {
    id: '6',
    user_id: '1',
    category: 'Marketing',
    amount: 600.00,
    description: 'Social media advertising campaign',
    receipt_url: null,
    created_at: new Date(Date.now() - 1209600000).toISOString(),
    user: mockUsers.find(u => u.id === '1'),
  },
];

// Mock audit logs
export const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    user_id: '1',
    action: 'CREATE',
    entity_type: 'drink',
    entity_id: 'uuid-1',
    details: { name: 'New Signature Cocktail' },
    ip_address: '192.168.1.1',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    user: mockUsers.find(u => u.id === '1'),
  },
  {
    id: '2',
    user_id: '3',
    action: 'CREATE',
    entity_type: 'sale',
    entity_id: 'uuid-2',
    details: { total: 142.00, payment_method: 'card' },
    ip_address: '192.168.1.24',
    created_at: new Date(Date.now() - 7200000).toISOString(),
    user: mockUsers.find(u => u.id === '3'),
  },
  {
    id: '3',
    user_id: '1',
    action: 'UPDATE',
    entity_type: 'drink',
    entity_id: 'uuid-3',
    details: { field: 'stock_quantity', old: 20, new: 45 },
    ip_address: '192.168.1.1',
    created_at: new Date(Date.now() - 10800000).toISOString(),
    user: mockUsers.find(u => u.id === '1'),
  },
  {
    id: '4',
    user_id: '3',
    action: 'CREATE',
    entity_type: 'sale',
    entity_id: 'uuid-4',
    details: { total: 85.00, payment_method: 'cash' },
    ip_address: '192.168.1.24',
    created_at: new Date(Date.now() - 14400000).toISOString(),
    user: mockUsers.find(u => u.id === '3'),
  },
  {
    id: '5',
    user_id: '1',
    action: 'UPDATE',
    entity_type: 'user',
    entity_id: 'uuid-5',
    details: { field: 'role', old: 'staff', new: 'manager' },
    ip_address: '192.168.1.1',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user: mockUsers.find(u => u.id === '1'),
  },
  {
    id: '6',
    user_id: '1',
    action: 'CREATE',
    entity_type: 'expense',
    entity_id: 'uuid-6',
    details: { category: 'Inventory', amount: 2450.00 },
    ip_address: '192.168.1.1',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user: mockUsers.find(u => u.id === '1'),
  },
  {
    id: '7',
    user_id: '3',
    action: 'CREATE',
    entity_type: 'sale',
    entity_id: 'uuid-7',
    details: { total: 320.00, payment_method: 'card' },
    ip_address: '192.168.1.24',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    user: mockUsers.find(u => u.id === '3'),
  },
  {
    id: '8',
    user_id: '1',
    action: 'DELETE',
    entity_type: 'drink',
    entity_id: 'uuid-8',
    details: { name: 'Discontinued Cocktail' },
    ip_address: '192.168.1.1',
    created_at: new Date(Date.now() - 172800000).toISOString(),
    user: mockUsers.find(u => u.id === '1'),
  },
];

// Dashboard stats
export const mockDashboardStats: DashboardStats = {
  revenueToday: mockSales
    .filter(s => new Date(s.created_at).toDateString() === new Date().toDateString())
    .reduce((sum, s) => sum + s.total_amount, 0),
  expensesToday: 380,
  netProfit: 0,
  salesCount: mockSales.filter(s => new Date(s.created_at).toDateString() === new Date().toDateString()).length,
  lowStockCount: mockDrinks.filter(d => d.stock_quantity > 0 && d.stock_quantity <= d.min_stock_level).length,
};

// Calculate net profit
mockDashboardStats.netProfit = mockDashboardStats.revenueToday - mockDashboardStats.expensesToday;

// Chart data for sales trend (last 7 days)
export const generateSalesTrendData = (): ChartData[] => {
  const data: ChartData[] = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const daySales = mockSales.filter(s =>
      new Date(s.created_at).toDateString() === date.toDateString()
    );

    data.push({
      name: days[date.getDay()],
      value: daySales.reduce((sum, s) => sum + s.total_amount, 0),
    });
  }

  return data;
};

// Revenue vs Expenses chart data
export const generateRevenueExpensesData = (): ChartData[] => {
  const data: ChartData[] = [];
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const daySales = mockSales.filter(s =>
      new Date(s.created_at).toDateString() === date.toDateString()
    );

    data.push({
      name: days[date.getDay()],
      value: daySales.reduce((sum, s) => sum + s.total_amount, 0),
    });
  }

  return data;
};

// Top selling drinks
export const mockTopSellingDrinks: TopSellingDrink[] = [
  { name: 'Macallan 18 Year', quantity: 47, revenue: 3525 },
  { name: 'Dom Pérignon Vintage', quantity: 24, revenue: 7680 },
  { name: 'Château Margaux 2015', quantity: 38, revenue: 3230 },
  { name: 'Hennessy X.O', quantity: 35, revenue: 2275 },
  { name: 'Imperial Old Fashioned', quantity: 52, revenue: 1144 },
];

// Recent activities
export const mockActivities: Activity[] = [
  {
    id: '1',
    type: 'sale',
    description: 'New sale recorded',
    amount: 142.00,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    user: mockUsers.find(u => u.id === '3'),
  },
  {
    id: '2',
    type: 'sale',
    description: 'Payment received via card',
    amount: 320.00,
    timestamp: new Date(Date.now() - 7200000).toISOString(),
    user: mockUsers.find(u => u.id === '3'),
  },
  {
    id: '3',
    type: 'inventory',
    description: 'Stock replenished: Belvedere Vodka',
    timestamp: new Date(Date.now() - 10800000).toISOString(),
    user: mockUsers.find(u => u.id === '1'),
  },
  {
    id: '4',
    type: 'expense',
    description: 'Expense recorded: Weekly spirits restock',
    amount: 2450.00,
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    user: mockUsers.find(u => u.id === '1'),
  },
  {
    id: '5',
    type: 'user',
    description: 'Marie Dubois promoted to manager',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    user: mockUsers.find(u => u.id === '1'),
  },
];

// Sales by category for pie chart
export const salesByCategory: ChartData[] = [
  { name: 'Spirits', value: 45 },
  { name: 'Wine', value: 28 },
  { name: 'Cocktails', value: 18 },
  { name: 'Beer', value: 6 },
  { name: 'Non-Alcoholic', value: 3 },
];

// Sales by seller
export const salesBySeller: ChartData[] = [
  { name: 'Marie Dubois', value: 12500 },
  { name: 'Jean-Pierre Moreau', value: 8900 },
  { name: 'Sophie Laurent', value: 4200 },
];

// Sales by day of week (for reports)
export const salesByDayOfWeek: ChartData[] = [
  { name: 'Monday', value: 2800 },
  { name: 'Tuesday', value: 3100 },
  { name: 'Wednesday', value: 4200 },
  { name: 'Thursday', value: 4800 },
  { name: 'Friday', value: 7100 },
  { name: 'Saturday', value: 9500 },
  { name: 'Sunday', value: 6200 },
];

// Monthly revenue data
export const monthlyRevenueData: ChartData[] = [
  { name: 'Jan', value: 42000 },
  { name: 'Feb', value: 38500 },
  { name: 'Mar', value: 45000 },
  { name: 'Apr', value: 51200 },
  { name: 'May', value: 48700 },
  { name: 'Jun', value: 55800 },
];
