
import { getLocalStorageData, setLocalStorageData } from "../localStorage";

export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  location: string;
  quantity: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastUpdated: string;
}

const INVENTORY_STORAGE_KEY = "inventoryItems";

// Sample initial inventory data
const initialInventoryData: InventoryItem[] = [
  {
    id: "1",
    sku: "PRD-001",
    name: "Wireless Headphones",
    location: "Warehouse A",
    quantity: 145,
    status: "In Stock",
    lastUpdated: "2023-05-12"
  },
  {
    id: "2",
    sku: "PRD-002",
    name: "USB-C Cable 2m",
    location: "Warehouse B",
    quantity: 28,
    status: "Low Stock",
    lastUpdated: "2023-05-10"
  },
  {
    id: "3",
    sku: "PRD-003",
    name: "Bluetooth Speaker",
    location: "Warehouse A",
    quantity: 56,
    status: "In Stock",
    lastUpdated: "2023-05-11"
  },
  {
    id: "4",
    sku: "PRD-004",
    name: "Laptop Stand",
    location: "Warehouse C",
    quantity: 0,
    status: "Out of Stock",
    lastUpdated: "2023-05-09"
  },
  {
    id: "5",
    sku: "PRD-005",
    name: "Wireless Mouse",
    location: "Warehouse A",
    quantity: 82,
    status: "In Stock",
    lastUpdated: "2023-05-12"
  },
  {
    id: "6",
    sku: "PRD-006",
    name: "HDMI Adapter",
    location: "Warehouse B",
    quantity: 18,
    status: "Low Stock",
    lastUpdated: "2023-05-10"
  }
];

// Get inventory data from localStorage or use initial data if none exists
export function getInventoryItems(): InventoryItem[] {
  return getLocalStorageData<InventoryItem[]>(INVENTORY_STORAGE_KEY, initialInventoryData);
}

// Save inventory data to localStorage
export function saveInventoryItems(items: InventoryItem[]): void {
  setLocalStorageData(INVENTORY_STORAGE_KEY, items);
}

// Add a new inventory item
export function addInventoryItem(item: Omit<InventoryItem, "id" | "lastUpdated">): InventoryItem {
  const items = getInventoryItems();
  const newItem: InventoryItem = {
    ...item,
    id: Date.now().toString(),
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  
  items.push(newItem);
  saveInventoryItems(items);
  return newItem;
}

// Update an existing inventory item
export function updateInventoryItem(id: string, updates: Partial<Omit<InventoryItem, "id">>): InventoryItem | null {
  const items = getInventoryItems();
  const index = items.findIndex(item => item.id === id);
  
  if (index === -1) return null;
  
  const updatedItem = {
    ...items[index],
    ...updates,
    lastUpdated: new Date().toISOString().split('T')[0]
  };
  
  items[index] = updatedItem;
  saveInventoryItems(items);
  return updatedItem;
}

// Delete an inventory item
export function deleteInventoryItem(id: string): boolean {
  const items = getInventoryItems();
  const filteredItems = items.filter(item => item.id !== id);
  
  if (filteredItems.length === items.length) return false;
  
  saveInventoryItems(filteredItems);
  return true;
}

// Get inventory item by ID
export function getInventoryItemById(id: string): InventoryItem | undefined {
  const items = getInventoryItems();
  return items.find(item => item.id === id);
}

// Determine status based on quantity and threshold
export function calculateInventoryStatus(quantity: number, lowStockThreshold = 30): "In Stock" | "Low Stock" | "Out of Stock" {
  if (quantity <= 0) return "Out of Stock";
  if (quantity <= lowStockThreshold) return "Low Stock";
  return "In Stock";
}

// Update inventory quantities
export function updateInventoryQuantity(id: string, newQuantity: number): InventoryItem | null {
  return updateInventoryItem(id, {
    quantity: newQuantity,
    status: calculateInventoryStatus(newQuantity)
  });
}
