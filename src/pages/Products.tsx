
import { useState } from "react";
import Layout from "@/components/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, SlidersHorizontal, Grid3X3, List } from "lucide-react";

// Sample product data
const productData = [
  {
    id: "1",
    name: "Wireless Headphones",
    sku: "PRD-001",
    imageUrl: "https://placehold.co/300x200/e2e8f0/a0aec0?text=Headphones",
    category: "Electronics",
    price: 89.99,
    stock: 145
  },
  {
    id: "2",
    name: "USB-C Cable 2m",
    sku: "PRD-002",
    imageUrl: "https://placehold.co/300x200/e2e8f0/a0aec0?text=USB+Cable",
    category: "Accessories",
    price: 12.99,
    stock: 28
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    sku: "PRD-003",
    imageUrl: "https://placehold.co/300x200/e2e8f0/a0aec0?text=Speaker",
    category: "Electronics",
    price: 49.99,
    stock: 56
  },
  {
    id: "4",
    name: "Laptop Stand",
    sku: "PRD-004",
    imageUrl: "https://placehold.co/300x200/e2e8f0/a0aec0?text=Laptop+Stand",
    category: "Office",
    price: 29.99,
    stock: 0
  },
  {
    id: "5",
    name: "Wireless Mouse",
    sku: "PRD-005",
    imageUrl: "https://placehold.co/300x200/e2e8f0/a0aec0?text=Mouse",
    category: "Electronics",
    price: 34.99,
    stock: 82
  },
  {
    id: "6",
    name: "HDMI Adapter",
    sku: "PRD-006",
    imageUrl: "https://placehold.co/300x200/e2e8f0/a0aec0?text=HDMI+Adapter",
    category: "Accessories",
    price: 19.99,
    stock: 18
  },
  {
    id: "7",
    name: "Mechanical Keyboard",
    sku: "PRD-007",
    imageUrl: "https://placehold.co/300x200/e2e8f0/a0aec0?text=Keyboard",
    category: "Electronics",
    price: 129.99,
    stock: 42
  },
  {
    id: "8",
    name: "Desk Organizer",
    sku: "PRD-008",
    imageUrl: "https://placehold.co/300x200/e2e8f0/a0aec0?text=Organizer",
    category: "Office",
    price: 24.99,
    stock: 65
  }
];

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  // Filter products based on search query
  const filteredProducts = productData.filter(product => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
            <p className="text-sm text-muted-foreground">
              Manage your product catalog and inventory
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
        
        {/* Products content */}
        <div className="space-y-6 animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <SearchBar 
              placeholder="Search products..." 
              className="w-full sm:w-80" 
              onChange={setSearchQuery}
            />
            
            <div className="flex items-center space-x-1">
              <Button
                variant={viewMode === "grid" ? "default" : "outline"}
                size="icon"
                className="h-9 w-9"
                onClick={() => setViewMode("grid")}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="icon"
                className="h-9 w-9"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all">All Products</TabsTrigger>
              <TabsTrigger value="electronics">Electronics</TabsTrigger>
              <TabsTrigger value="accessories">Accessories</TabsTrigger>
              <TabsTrigger value="office">Office</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "space-y-4"
              }>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      className={viewMode === "list" ? "flex flex-row" : ""}
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-muted-foreground">No products found.</p>
                  </div>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="electronics" className="mt-4">
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "space-y-4"
              }>
                {filteredProducts
                  .filter(product => product.category === "Electronics")
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      className={viewMode === "list" ? "flex flex-row" : ""}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="accessories" className="mt-4">
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "space-y-4"
              }>
                {filteredProducts
                  .filter(product => product.category === "Accessories")
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      className={viewMode === "list" ? "flex flex-row" : ""}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="office" className="mt-4">
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "space-y-4"
              }>
                {filteredProducts
                  .filter(product => product.category === "Office")
                  .map((product) => (
                    <ProductCard
                      key={product.id}
                      {...product}
                      className={viewMode === "list" ? "flex flex-row" : ""}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
