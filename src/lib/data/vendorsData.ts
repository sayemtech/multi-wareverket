
import { getLocalStorageData, setLocalStorageData } from "../localStorage";

export interface Vendor {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  category: string;
  status: "Active" | "Inactive";
  website?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const VENDORS_STORAGE_KEY = "vendors";

// Sample initial vendor data
const initialVendorsData: Vendor[] = [
  {
    id: "1",
    name: "Tech Distributors Inc",
    contactName: "Michael Chen",
    email: "michael@techdist.com",
    phone: "415-555-1234",
    address: "101 Supply Chain Rd",
    city: "San Francisco",
    state: "California",
    zipCode: "94107",
    country: "USA",
    category: "Electronics",
    status: "Active",
    website: "https://techdistributors.example.com",
    notes: "Primary supplier for all headphones and speakers",
    createdAt: "2022-09-15",
    updatedAt: "2023-04-20"
  },
  {
    id: "2",
    name: "Global Accessories Ltd",
    contactName: "Sarah Johnson",
    email: "sarah@globalacc.com",
    phone: "212-555-7890",
    address: "222 Component Ave",
    city: "New York",
    state: "New York",
    zipCode: "10001",
    country: "USA",
    category: "Accessories",
    status: "Active",
    website: "https://globalaccessories.example.com",
    createdAt: "2023-01-10",
    updatedAt: "2023-03-25"
  },
  {
    id: "3",
    name: "Quality Packaging Co",
    contactName: "David Park",
    email: "david@qualitypack.com",
    phone: "312-555-4567",
    address: "333 Box Street",
    city: "Chicago",
    state: "Illinois",
    zipCode: "60607",
    country: "USA",
    category: "Packaging",
    status: "Inactive",
    notes: "Formerly used for custom packaging solutions",
    createdAt: "2022-11-05",
    updatedAt: "2023-05-02"
  }
];

// Get vendors from localStorage or use initial data if none exists
export function getVendors(): Vendor[] {
  return getLocalStorageData<Vendor[]>(VENDORS_STORAGE_KEY, initialVendorsData);
}

// Save vendors to localStorage
export function saveVendors(vendors: Vendor[]): void {
  setLocalStorageData(VENDORS_STORAGE_KEY, vendors);
}

// Add a new vendor
export function addVendor(vendor: Omit<Vendor, "id" | "createdAt" | "updatedAt">): Vendor {
  const vendors = getVendors();
  const now = new Date().toISOString().split('T')[0];
  
  const newVendor: Vendor = {
    ...vendor,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now
  };
  
  vendors.push(newVendor);
  saveVendors(vendors);
  return newVendor;
}

// Update an existing vendor
export function updateVendor(id: string, updates: Partial<Omit<Vendor, "id" | "createdAt">>): Vendor | null {
  const vendors = getVendors();
  const index = vendors.findIndex(v => v.id === id);
  
  if (index === -1) return null;
  
  const updatedVendor = {
    ...vendors[index],
    ...updates,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  vendors[index] = updatedVendor;
  saveVendors(vendors);
  return updatedVendor;
}

// Delete a vendor
export function deleteVendor(id: string): boolean {
  const vendors = getVendors();
  const filteredVendors = vendors.filter(v => v.id !== id);
  
  if (filteredVendors.length === vendors.length) return false;
  
  saveVendors(filteredVendors);
  return true;
}

// Get vendor by ID
export function getVendorById(id: string): Vendor | undefined {
  const vendors = getVendors();
  return vendors.find(v => v.id === id);
}

// Toggle vendor active status
export function toggleVendorStatus(id: string): Vendor | null {
  const vendor = getVendorById(id);
  if (!vendor) return null;
  
  const newStatus: Vendor["status"] = vendor.status === "Active" ? "Inactive" : "Active";
  return updateVendor(id, { status: newStatus });
}
