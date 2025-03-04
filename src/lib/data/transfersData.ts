
import { getLocalStorageData, setLocalStorageData } from "../localStorage";

export interface Transfer {
  id: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
  }[];
  sourceLocationId: string;
  sourceLocationName: string;
  destinationLocationId: string;
  destinationLocationName: string;
  status: "Pending" | "In Transit" | "Completed" | "Cancelled";
  notes?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

const TRANSFERS_STORAGE_KEY = "transfers";

// Sample initial transfer data
const initialTransfersData: Transfer[] = [
  {
    id: "1",
    items: [
      {
        productId: "1",
        productName: "Wireless Headphones",
        quantity: 15
      },
      {
        productId: "3",
        productName: "Bluetooth Speaker",
        quantity: 8
      }
    ],
    sourceLocationId: "1",
    sourceLocationName: "Warehouse A",
    destinationLocationId: "2",
    destinationLocationName: "Warehouse B",
    status: "In Transit",
    notes: "Regular stock rebalancing",
    createdAt: "2023-05-08",
    updatedAt: "2023-05-09"
  },
  {
    id: "2",
    items: [
      {
        productId: "2",
        productName: "USB-C Cable 2m",
        quantity: 50
      }
    ],
    sourceLocationId: "2",
    sourceLocationName: "Warehouse B",
    destinationLocationId: "3",
    destinationLocationName: "Downtown Store",
    status: "Completed",
    notes: "Restocking retail location",
    createdAt: "2023-05-05",
    updatedAt: "2023-05-07",
    completedAt: "2023-05-07"
  }
];

// Get transfers from localStorage or use initial data if none exists
export function getTransfers(): Transfer[] {
  return getLocalStorageData<Transfer[]>(TRANSFERS_STORAGE_KEY, initialTransfersData);
}

// Save transfers to localStorage
export function saveTransfers(transfers: Transfer[]): void {
  setLocalStorageData(TRANSFERS_STORAGE_KEY, transfers);
}

// Add a new transfer
export function addTransfer(transfer: Omit<Transfer, "id" | "createdAt" | "updatedAt">): Transfer {
  const transfers = getTransfers();
  const now = new Date().toISOString().split('T')[0];
  
  const newTransfer: Transfer = {
    ...transfer,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now
  };
  
  transfers.push(newTransfer);
  saveTransfers(transfers);
  return newTransfer;
}

// Update an existing transfer
export function updateTransfer(id: string, updates: Partial<Omit<Transfer, "id" | "createdAt">>): Transfer | null {
  const transfers = getTransfers();
  const index = transfers.findIndex(t => t.id === id);
  
  if (index === -1) return null;
  
  const updatedTransfer = {
    ...transfers[index],
    ...updates,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  transfers[index] = updatedTransfer;
  saveTransfers(transfers);
  return updatedTransfer;
}

// Delete a transfer
export function deleteTransfer(id: string): boolean {
  const transfers = getTransfers();
  const filteredTransfers = transfers.filter(t => t.id !== id);
  
  if (filteredTransfers.length === transfers.length) return false;
  
  saveTransfers(filteredTransfers);
  return true;
}

// Get transfer by ID
export function getTransferById(id: string): Transfer | undefined {
  const transfers = getTransfers();
  return transfers.find(t => t.id === id);
}

// Update transfer status
export function updateTransferStatus(
  id: string, 
  status: Transfer["status"], 
  completedAt?: string
): Transfer | null {
  const updates: Partial<Omit<Transfer, "id" | "createdAt">> = { status };
  
  if (status === "Completed" && !completedAt) {
    updates.completedAt = new Date().toISOString().split('T')[0];
  } else if (completedAt) {
    updates.completedAt = completedAt;
  }
  
  return updateTransfer(id, updates);
}
