
import { getLocalStorageData, setLocalStorageData } from "../localStorage";

export interface Sale {
  id: string;
  customerId: string;
  customerName: string;
  date: string;
  items: SaleItem[];
  total: number;
  paymentStatus: "paid" | "pending" | "overdue";
  paymentMethod: "cash" | "credit_card" | "bank_transfer" | "other";
  notes?: string;
}

export interface SaleItem {
  id: string;
  productId: string;
  name: string;
  quantity: number;
  price: number;
  total: number;
}

const SALES_STORAGE_KEY = "sales";

// Sample initial sales data
const initialSalesData: Sale[] = [
  {
    id: "1",
    customerId: "1",
    customerName: "John Smith",
    date: "2023-09-15",
    items: [
      {
        id: "item1",
        productId: "prod1",
        name: "Wireless Headphones",
        quantity: 2,
        price: 79.99,
        total: 159.98
      },
      {
        id: "item2",
        productId: "prod2",
        name: "Bluetooth Speaker",
        quantity: 1,
        price: 129.99,
        total: 129.99
      }
    ],
    total: 289.97,
    paymentStatus: "paid",
    paymentMethod: "credit_card"
  },
  {
    id: "2",
    customerId: "2",
    customerName: "Sarah Johnson",
    date: "2023-09-20",
    items: [
      {
        id: "item3",
        productId: "prod3",
        name: "USB-C Cable 2m",
        quantity: 5,
        price: 12.99,
        total: 64.95
      }
    ],
    total: 64.95,
    paymentStatus: "pending",
    paymentMethod: "bank_transfer",
    notes: "Waiting for payment confirmation"
  },
  {
    id: "3",
    customerId: "3",
    customerName: "Michael Chen",
    date: "2023-09-25",
    items: [
      {
        id: "item4",
        productId: "prod4",
        name: "Smart Watch",
        quantity: 1,
        price: 249.99,
        total: 249.99
      },
      {
        id: "item5",
        productId: "prod5",
        name: "Wireless Charger",
        quantity: 2,
        price: 34.99,
        total: 69.98
      }
    ],
    total: 319.97,
    paymentStatus: "paid",
    paymentMethod: "cash"
  }
];

// Get sales from localStorage or use initial data if none exists
export function getSales(): Sale[] {
  return getLocalStorageData<Sale[]>(SALES_STORAGE_KEY, initialSalesData);
}

// Save sales to localStorage
export function saveSales(sales: Sale[]): void {
  setLocalStorageData(SALES_STORAGE_KEY, sales);
}

// Add a new sale
export function addSale(sale: Omit<Sale, "id">): Sale {
  const sales = getSales();
  
  const newSale: Sale = {
    ...sale,
    id: Date.now().toString()
  };
  
  sales.push(newSale);
  saveSales(sales);
  return newSale;
}

// Update an existing sale
export function updateSale(id: string, updates: Partial<Omit<Sale, "id">>): Sale | null {
  const sales = getSales();
  const index = sales.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  const updatedSale = {
    ...sales[index],
    ...updates
  };
  
  sales[index] = updatedSale;
  saveSales(sales);
  return updatedSale;
}

// Delete a sale
export function deleteSale(id: string): boolean {
  const sales = getSales();
  const filteredSales = sales.filter(s => s.id !== id);
  
  if (filteredSales.length === sales.length) return false;
  
  saveSales(filteredSales);
  return true;
}

// Get sale by ID
export function getSaleById(id: string): Sale | undefined {
  const sales = getSales();
  return sales.find(s => s.id === id);
}

// Calculate total sales over a period
export function calculateTotalSales(startDate?: string, endDate?: string): number {
  const sales = getSales();
  
  // If no dates provided, return total of all sales
  if (!startDate && !endDate) {
    return sales.reduce((total, sale) => total + sale.total, 0);
  }
  
  // Filter sales by date range
  const filteredSales = sales.filter(sale => {
    const saleDate = new Date(sale.date);
    if (startDate && new Date(startDate) > saleDate) return false;
    if (endDate && new Date(endDate) < saleDate) return false;
    return true;
  });
  
  return filteredSales.reduce((total, sale) => total + sale.total, 0);
}

// Get sales by customer ID
export function getSalesByCustomer(customerId: string): Sale[] {
  const sales = getSales();
  return sales.filter(sale => sale.customerId === customerId);
}

// Get sales by status
export function getSalesByStatus(status: Sale["paymentStatus"]): Sale[] {
  const sales = getSales();
  return sales.filter(sale => sale.paymentStatus === status);
}

// Get recent sales (default to last 30 days)
export function getRecentSales(days = 30): Sale[] {
  const sales = getSales();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);
  
  return sales.filter(sale => new Date(sale.date) >= cutoffDate)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
