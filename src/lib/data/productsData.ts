
import { getLocalStorageData, setLocalStorageData } from "../localStorage";

export interface Product {
  id: string;
  name: string;
  sku: string;
  description: string;
  category: string;
  price: number;
  cost: number;
  imageUrl?: string;
  barcode?: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  createdAt: string;
  updatedAt: string;
}

const PRODUCTS_STORAGE_KEY = "products";

// Sample initial product data
const initialProductsData: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    sku: "PRD-001",
    description: "High-quality wireless headphones with noise cancellation",
    category: "Electronics",
    price: 129.99,
    cost: 75.50,
    imageUrl: "/placeholder.svg",
    barcode: "123456789012",
    weight: 0.3,
    dimensions: {
      length: 18,
      width: 14,
      height: 8
    },
    createdAt: "2023-01-15",
    updatedAt: "2023-05-12"
  },
  {
    id: "2",
    name: "USB-C Cable 2m",
    sku: "PRD-002",
    description: "Durable USB-C cable for fast charging",
    category: "Accessories",
    price: 19.99,
    cost: 5.25,
    imageUrl: "/placeholder.svg",
    barcode: "223456789012",
    weight: 0.1,
    dimensions: {
      length: 200,
      width: 1,
      height: 1
    },
    createdAt: "2023-02-10",
    updatedAt: "2023-05-10"
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    sku: "PRD-003",
    description: "Portable Bluetooth speaker with 12-hour battery life",
    category: "Electronics",
    price: 79.99,
    cost: 45.00,
    imageUrl: "/placeholder.svg",
    barcode: "323456789012",
    weight: 0.5,
    dimensions: {
      length: 15,
      width: 7,
      height: 7
    },
    createdAt: "2023-03-05",
    updatedAt: "2023-05-11"
  }
];

// Get products from localStorage or use initial data if none exists
export function getProducts(): Product[] {
  return getLocalStorageData<Product[]>(PRODUCTS_STORAGE_KEY, initialProductsData);
}

// Save products to localStorage
export function saveProducts(products: Product[]): void {
  setLocalStorageData(PRODUCTS_STORAGE_KEY, products);
}

// Add a new product
export function addProduct(product: Omit<Product, "id" | "createdAt" | "updatedAt">): Product {
  const products = getProducts();
  const now = new Date().toISOString().split('T')[0];
  
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
    createdAt: now,
    updatedAt: now
  };
  
  products.push(newProduct);
  saveProducts(products);
  return newProduct;
}

// Update an existing product
export function updateProduct(id: string, updates: Partial<Omit<Product, "id" | "createdAt">>): Product | null {
  const products = getProducts();
  const index = products.findIndex(p => p.id === id);
  
  if (index === -1) return null;
  
  const updatedProduct = {
    ...products[index],
    ...updates,
    updatedAt: new Date().toISOString().split('T')[0]
  };
  
  products[index] = updatedProduct;
  saveProducts(products);
  return updatedProduct;
}

// Delete a product
export function deleteProduct(id: string): boolean {
  const products = getProducts();
  const filteredProducts = products.filter(p => p.id !== id);
  
  if (filteredProducts.length === products.length) return false;
  
  saveProducts(filteredProducts);
  return true;
}

// Get product by ID
export function getProductById(id: string): Product | undefined {
  const products = getProducts();
  return products.find(p => p.id === id);
}
