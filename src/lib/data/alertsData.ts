
import { getLocalStorageData, setLocalStorageData } from "../localStorage";

export interface AlertItem {
  id: string;
  type: "low_stock" | "reorder_needed" | "stock_received" | "expiring_soon";
  message: string;
  item: string;
  location: string;
  quantity?: number;
  timestamp: string;
  isRead: boolean;
}

const ALERTS_STORAGE_KEY = "inventoryAlerts";

// Sample initial alert data
const initialAlertsData: AlertItem[] = [
  {
    id: "1",
    type: "low_stock",
    message: "Item is running low on stock",
    item: "USB-C Cable 2m",
    location: "Warehouse B",
    quantity: 28,
    timestamp: "2023-05-10 09:15:00",
    isRead: false
  },
  {
    id: "2",
    type: "reorder_needed",
    message: "Reorder needed for out of stock item",
    item: "Laptop Stand",
    location: "Warehouse C",
    quantity: 0,
    timestamp: "2023-05-09 14:30:00",
    isRead: false
  },
  {
    id: "3",
    type: "stock_received",
    message: "New stock received",
    item: "Wireless Headphones",
    location: "Warehouse A",
    quantity: 50,
    timestamp: "2023-05-12 11:45:00",
    isRead: true
  },
  {
    id: "4",
    type: "expiring_soon",
    message: "Items approaching expiration date",
    item: "Battery Pack",
    location: "Warehouse B",
    quantity: 15,
    timestamp: "2023-05-11 16:20:00",
    isRead: false
  }
];

// Get alerts from localStorage or use initial data if none exists
export function getAlerts(): AlertItem[] {
  return getLocalStorageData<AlertItem[]>(ALERTS_STORAGE_KEY, initialAlertsData);
}

// Save alerts to localStorage
export function saveAlerts(alerts: AlertItem[]): void {
  setLocalStorageData(ALERTS_STORAGE_KEY, alerts);
}

// Add a new alert
export function addAlert(alert: Omit<AlertItem, "id" | "timestamp" | "isRead">): AlertItem {
  const alerts = getAlerts();
  
  const newAlert: AlertItem = {
    ...alert,
    id: Date.now().toString(),
    timestamp: new Date().toLocaleString(),
    isRead: false
  };
  
  alerts.push(newAlert);
  saveAlerts(alerts);
  return newAlert;
}

// Mark an alert as read
export function markAlertAsRead(id: string): AlertItem | null {
  const alerts = getAlerts();
  const index = alerts.findIndex(alert => alert.id === id);
  
  if (index === -1) return null;
  
  const updatedAlert = { ...alerts[index], isRead: true };
  alerts[index] = updatedAlert;
  
  saveAlerts(alerts);
  return updatedAlert;
}

// Delete an alert
export function deleteAlert(id: string): boolean {
  const alerts = getAlerts();
  const filteredAlerts = alerts.filter(alert => alert.id !== id);
  
  if (filteredAlerts.length === alerts.length) return false;
  
  saveAlerts(filteredAlerts);
  return true;
}

// Clear all alerts
export function clearAllAlerts(): void {
  saveAlerts([]);
}

// Generate alerts based on inventory data
export function generateLowStockAlerts(thresholdQuantity: number = 30): void {
  // This would typically check inventory data and generate alerts
  // For demonstration purposes, we're not implementing this logic yet
  console.log(`Would generate alerts for items with quantity below ${thresholdQuantity}`);
}
