import { getLocalStorageData, setLocalStorageData } from "../localStorage";

export type AuditStatus = "scheduled" | "inProgress" | "completed" | "cancelled";
export type AuditType = "full" | "partial" | "spot" | "cycle";

export interface Audit {
  id: string;
  location: string;
  type: AuditType;
  scheduledDate: string;
  assignedTo: string;
  productCategories?: string[];
  notes?: string;
  status: AuditStatus;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  discrepancies?: {
    productId: string;
    productName: string;
    expectedQty: number;
    actualQty: number;
    difference: number;
  }[];
}

// Sample data
const initialAudits: Audit[] = [
  {
    id: "AUD-1234-2023",
    location: "Warehouse A",
    type: "full",
    scheduledDate: "2023-08-15",
    assignedTo: "John Smith",
    status: "completed",
    createdAt: "2023-08-01T10:30:00Z",
    startedAt: "2023-08-15T09:00:00Z",
    completedAt: "2023-08-15T14:25:00Z",
    discrepancies: [
      {
        productId: "P-1001",
        productName: "Wireless Headphones",
        expectedQty: 45,
        actualQty: 42,
        difference: -3
      },
      {
        productId: "P-1002",
        productName: "USB-C Cable 2m",
        expectedQty: 120,
        actualQty: 115,
        difference: -5
      }
    ]
  },
  {
    id: "AUD-2345-2023",
    location: "Warehouse B",
    type: "cycle",
    scheduledDate: "2023-09-01",
    assignedTo: "Sarah Johnson",
    productCategories: ["Electronics", "Office"],
    status: "completed",
    createdAt: "2023-08-20T14:15:00Z",
    startedAt: "2023-09-01T08:30:00Z",
    completedAt: "2023-09-01T12:45:00Z",
    discrepancies: [
      {
        productId: "P-3001",
        productName: "Bluetooth Speaker",
        expectedQty: 30,
        actualQty: 32,
        difference: 2
      }
    ]
  },
  {
    id: "AUD-3456-2023",
    location: "Store C",
    type: "partial",
    scheduledDate: "2023-09-15",
    assignedTo: "Mike Brown",
    productCategories: ["Clothing", "Home"],
    notes: "Focus on seasonal items",
    status: "inProgress",
    createdAt: "2023-09-01T09:20:00Z",
    startedAt: "2023-09-15T10:00:00Z"
  },
  {
    id: "AUD-4567-2023",
    location: "Warehouse A",
    type: "spot",
    scheduledDate: "2023-09-30",
    assignedTo: "Lisa Chen",
    notes: "Random sample of high-value items",
    status: "scheduled",
    createdAt: "2023-09-10T11:45:00Z"
  },
  {
    id: "AUD-5678-2023",
    location: "Distribution Center",
    type: "full",
    scheduledDate: "2023-10-15",
    assignedTo: "James Wilson",
    status: "scheduled",
    createdAt: "2023-09-15T15:30:00Z"
  }
];

// Get audits from localStorage or use initial data
export const getAudits = (): Audit[] => {
  const audits = getLocalStorageData("audits", initialAudits);
  return audits;
};

// Save audits to localStorage
export const saveAudits = (audits: Audit[]) => {
  setLocalStorageData("audits", audits);
  return audits;
};

// Add a new audit
export const addAudit = (audit: Omit<Audit, "createdAt" | "status"> & { createdAt?: string, status?: AuditStatus }) => {
  const newAudit: Audit = {
    ...audit,
    status: audit.status || "scheduled",
    createdAt: audit.createdAt || new Date().toISOString()
  };
  
  const audits = getAudits();
  const updatedAudits = [...audits, newAudit];
  saveAudits(updatedAudits);
  return newAudit;
};

// Update an existing audit
export const updateAudit = (id: string, updates: Partial<Audit>) => {
  const audits = getAudits();
  const updatedAudits = audits.map(audit => 
    audit.id === id ? { ...audit, ...updates } : audit
  );
  saveAudits(updatedAudits);
  return updatedAudits.find(audit => audit.id === id);
};

// Delete an audit
export const deleteAudit = (id: string) => {
  const audits = getAudits();
  const updatedAudits = audits.filter(audit => audit.id !== id);
  saveAudits(updatedAudits);
};

// Get a single audit by ID
export const getAuditById = (id: string) => {
  const audits = getAudits();
  return audits.find(audit => audit.id === id);
};
