
import { getLocalStorageData, setLocalStorageData } from "../localStorage";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  address?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

const CUSTOMERS_STORAGE_KEY = "customers";

// Sample initial customer data
const initialCustomersData: Customer[] = [
  {
    id: "1",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "555-123-4567",
    company: "Acme Corporation",
    address: "123 Main St, Anytown, USA",
    notes: "Preferred customer, orders regularly",
    createdAt: "2023-01-10",
    updatedAt: "2023-06-15"
  },
  {
    id: "2",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    phone: "555-987-6543",
    company: "Tech Solutions Inc.",
    address: "456 Oak Ave, Business City, USA",
    createdAt: "2023-02-22",
    updatedAt: "2023-05-30"
  },
  {
    id: "3",
    name: "Michael Chen",
    email: "mchen@example.com",
    phone: "555-456-7890",
    company: "Global Traders",
    address: "789 Pine Blvd, Commerce Town, USA",
    notes: "New customer, interested in bulk orders",
    createdAt: "2023-04-05",
    updatedAt: "2023-04-05"
  }
];

// Get customers from localStorage or use initial data if none exists
export function getCustomers(): Customer[] {
  return getLocalStorageData<Customer[]>(CUSTOMERS_STORAGE_KEY, initialCustomersData);
}

// Save customers to localStorage
export function saveCustomers(customers: Customer[]): void {
  setLocalStorageData(CUSTOMERS_STORAGE_KEY, customers);
}

// Add a new customer
export function addCustomer(customer: Omit<Customer, "id" | "createdAt" | "updatedAt">): Customer {
  const customers = getCustomers();
  const now = new Date().toISOString().split('T')[0];
  
  const newCustomer: Customer = {
    ...customer,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now
  };
  
  customers.push(newCustomer);
  saveCustomers(customers);
  return newCustomer;
}

// Update an existing customer
export function updateCustomer(id: string, updates: Partial<Omit<Customer, "id" | "createdAt" | "updatedAt">>): Customer | null {
  const customers = getCustomers();
  const index = customers.findIndex(c => c.id === id);
  
  if (index === -1) return null;
  
  const updatedCustomer = {
    ...customers[index],
    ...updates,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  customers[index] = updatedCustomer;
  saveCustomers(customers);
  return updatedCustomer;
}

// Delete a customer
export function deleteCustomer(id: string): boolean {
  const customers = getCustomers();
  const filteredCustomers = customers.filter(c => c.id !== id);
  
  if (filteredCustomers.length === customers.length) return false;
  
  saveCustomers(filteredCustomers);
  return true;
}

// Get customer by ID
export function getCustomerById(id: string): Customer | undefined {
  const customers = getCustomers();
  return customers.find(c => c.id === id);
}
