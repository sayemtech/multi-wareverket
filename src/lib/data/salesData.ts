
import { getLocalStorageData, setLocalStorageData } from "../localStorage";
import { getProductById } from "./productsData";
import { getCustomerById } from "./customersData";

export interface SaleItem {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export interface Sale {
  id: string;
  customerId: string;
  items: SaleItem[];
  totalAmount: number;
  status: "pending" | "completed" | "cancelled";
  paymentMethod?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const SALES_STORAGE_KEY = "sales";

// Sample initial sales data
const initialSalesData: Sale[] = [
  {
    id: "1",
    customerId: "1",
    items: [
      { productId: "1", quantity: 2, unitPrice: 129.99 },
      { productId: "2", quantity: 1, unitPrice: 19.99 }
    ],
    totalAmount: 279.97,
    status: "completed",
    paymentMethod: "Credit Card",
    createdAt: "2023-05-10",
    updatedAt: "2023-05-10"
  },
  {
    id: "2",
    customerId: "2",
    items: [
      { productId: "3", quantity: 1, unitPrice: 79.99 }
    ],
    totalAmount: 79.99,
    status: "completed",
    paymentMethod: "PayPal",
    createdAt: "2023-05-15",
    updatedAt: "2023-05-15"
  },
  {
    id: "3",
    customerId: "3",
    items: [
      { productId: "2", quantity: 3, unitPrice: 19.99 }
    ],
    totalAmount: 59.97,
    status: "pending",
    paymentMethod: "Bank Transfer",
    notes: "Awaiting payment confirmation",
    createdAt: "2023-05-20",
    updatedAt: "2023-05-20"
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
export function addSale(sale: Omit<Sale, "id" | "createdAt" | "updatedAt">): Sale {
  const sales = getSales();
  const now = new Date().toISOString().split('T')[0];
  
  const newSale: Sale = {
    ...sale,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now
  };
  
  sales.push(newSale);
  saveSales(sales);
  return newSale;
}

// Update an existing sale
export function updateSale(id: string, updates: Partial<Omit<Sale, "id" | "createdAt" | "updatedAt">>): Sale | null {
  const sales = getSales();
  const index = sales.findIndex(s => s.id === id);
  
  if (index === -1) return null;
  
  const updatedSale = {
    ...sales[index],
    ...updates,
    updatedAt: new Date().toISOString().split('T')[0]
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

// Get sales enriched with product and customer data
export function getEnrichedSales() {
  const sales = getSales();
  
  return sales.map(sale => {
    const customer = getCustomerById(sale.customerId);
    const enrichedItems = sale.items.map(item => {
      const product = getProductById(item.productId);
      return {
        ...item,
        productName: product?.name || "Unknown Product",
        productSku: product?.sku || "N/A"
      };
    });
    
    return {
      ...sale,
      customer: customer?.name || "Unknown Customer",
      items: enrichedItems
    };
  });
}
