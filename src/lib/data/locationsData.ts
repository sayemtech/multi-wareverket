
import { getLocalStorageData, setLocalStorageData } from "../localStorage";

export interface Location {
  id: string;
  name: string;
  type: "Warehouse" | "Store" | "Distribution Center" | "Other";
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  capacity?: number;
  createdAt: string;
  updatedAt: string;
}

const LOCATIONS_STORAGE_KEY = "locations";

// Sample initial location data
const initialLocationsData: Location[] = [
  {
    id: "1",
    name: "Warehouse A",
    type: "Warehouse",
    address: "123 Storage Ave",
    city: "Portland",
    state: "Oregon",
    zipCode: "97201",
    country: "USA",
    contactName: "Alex Johnson",
    contactEmail: "alex@example.com",
    contactPhone: "503-555-1234",
    capacity: 5000,
    createdAt: "2022-11-05",
    updatedAt: "2023-04-10"
  },
  {
    id: "2",
    name: "Warehouse B",
    type: "Warehouse",
    address: "456 Inventory Rd",
    city: "Seattle",
    state: "Washington",
    zipCode: "98101",
    country: "USA",
    contactName: "Sam Wilson",
    contactEmail: "sam@example.com",
    contactPhone: "206-555-5678",
    capacity: 3500,
    createdAt: "2023-01-15",
    updatedAt: "2023-03-22"
  },
  {
    id: "3",
    name: "Downtown Store",
    type: "Store",
    address: "789 Retail St",
    city: "Chicago",
    state: "Illinois",
    zipCode: "60601",
    country: "USA",
    contactName: "Jamie Smith",
    contactEmail: "jamie@example.com",
    contactPhone: "312-555-9012",
    capacity: 500,
    createdAt: "2023-02-28",
    updatedAt: "2023-05-01"
  }
];

// Get locations from localStorage or use initial data if none exists
export function getLocations(): Location[] {
  return getLocalStorageData<Location[]>(LOCATIONS_STORAGE_KEY, initialLocationsData);
}

// Save locations to localStorage
export function saveLocations(locations: Location[]): void {
  setLocalStorageData(LOCATIONS_STORAGE_KEY, locations);
}

// Add a new location
export function addLocation(location: Omit<Location, "id" | "createdAt" | "updatedAt">): Location {
  const locations = getLocations();
  const now = new Date().toISOString().split('T')[0];
  
  const newLocation: Location = {
    ...location,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now
  };
  
  locations.push(newLocation);
  saveLocations(locations);
  return newLocation;
}

// Update an existing location
export function updateLocation(id: string, updates: Partial<Omit<Location, "id" | "createdAt">>): Location | null {
  const locations = getLocations();
  const index = locations.findIndex(loc => loc.id === id);
  
  if (index === -1) return null;
  
  const updatedLocation = {
    ...locations[index],
    ...updates,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  locations[index] = updatedLocation;
  saveLocations(locations);
  return updatedLocation;
}

// Delete a location
export function deleteLocation(id: string): boolean {
  const locations = getLocations();
  const filteredLocations = locations.filter(loc => loc.id !== id);
  
  if (filteredLocations.length === locations.length) return false;
  
  saveLocations(filteredLocations);
  return true;
}

// Get location by ID
export function getLocationById(id: string): Location | undefined {
  const locations = getLocations();
  return locations.find(loc => loc.id === id);
}
