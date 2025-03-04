
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  ChevronLeft, 
  Edit, 
  Package, 
  Truck, 
  ArrowDownUp, 
  BarChart3, 
  QrCode,
  AlertTriangle
} from "lucide-react";
import { StockMovementChart } from "@/components/charts/StockMovementChart";
import { Progress } from "@/components/ui/progress";
import { LocationSearch } from "@/components/LocationSearch";
import { useToast } from "@/hooks/use-toast";

// Sample product data - in a real app this would be fetched from an API
const sampleProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    sku: "PRD-001",
    imageUrl: "https://placehold.co/300x200/e2e8f0/a0aec0?text=Headphones",
    description: "High-quality wireless headphones with noise cancellation and long battery life.",
    category: "Electronics",
    price: 89.99,
    cost: 45.00,
    stock: 145,
    locations: [
      { name: "Warehouse A", quantity: 85 },
      { name: "Retail Store #1", quantity: 35 },
      { name: "Warehouse B", quantity: 25 }
    ],
    supplier: "TechSupply Inc.",
    reorderPoint: 50,
    reorderQuantity: 100,
    dimensions: { width: 8, height: 9, depth: 3, weight: 0.75 },
    attributes: [
      { name: "Color", value: "Black" },
      { name: "Connectivity", value: "Bluetooth 5.0" },
      { name: "Battery Life", value: "30 hours" }
    ]
  }
];

// Sample stock movement data
const stockMovementData = [
  { date: "Jan", received: 40, shipped: 25 },
  { date: "Feb", received: 30, shipped: 35 },
  { date: "Mar", received: 50, shipped: 30 },
  { date: "Apr", received: 20, shipped: 45 },
  { date: "May", received: 60, shipped: 40 },
  { date: "Jun", received: 35, shipped: 30 },
];

// Sample inventory transaction history
const transactionHistory = [
  { date: "2023-06-15", type: "Received", quantity: 50, location: "Warehouse A", reference: "PO-1234" },
  { date: "2023-06-10", type: "Shipped", quantity: -25, location: "Warehouse A", reference: "SO-5678" },
  { date: "2023-06-05", type: "Transfer", quantity: -10, location: "Warehouse A", reference: "TR-91011" },
  { date: "2023-06-05", type: "Transfer", quantity: 10, location: "Retail Store #1", reference: "TR-91011" },
  { date: "2023-05-20", type: "Adjustment", quantity: -2, location: "Warehouse B", reference: "ADJ-1213" },
];

const SingleProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  // Find the product with the matching ID
  const product = sampleProducts.find(p => p.id === id) || sampleProducts[0];
  
  // Calculate total stock across all locations
  const totalStock = product.locations.reduce((sum, loc) => sum + loc.quantity, 0);
  
  const handleLocationSearch = (query: string) => {
    // Simulating search results - in a real app, this would query a database
    setSearchResults(query 
      ? product.locations.filter(loc => 
          loc.name.toLowerCase().includes(query.toLowerCase())
        )
      : []
    );
  };

  const handleStockAdjust = () => {
    toast({
      title: "Stock Adjustment",
      description: "Stock adjustment form would open here.",
    });
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Back button and header */}
        <div className="flex flex-col space-y-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit"
            onClick={() => navigate("/products")}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h1 className="text-2xl font-semibold tracking-tight">{product.name}</h1>
              <p className="text-sm text-muted-foreground">
                SKU: {product.sku} • Category: {product.category}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <QrCode className="h-4 w-4 mr-2" />
                Generate Label
              </Button>
              <Button size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Product
              </Button>
            </div>
          </div>
        </div>
        
        {/* Product Overview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Product Image and Basic Info */}
          <div className="bg-card rounded-lg border shadow-soft overflow-hidden">
            <div className="aspect-square bg-muted relative">
              <img 
                src={product.imageUrl} 
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover" 
              />
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="font-medium">Price</h3>
                <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Cost: ${product.cost.toFixed(2)}</p>
              </div>
              
              <div>
                <h3 className="font-medium">Stock Status</h3>
                <div className="mt-2 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Current Stock</span>
                    <span className="font-medium">{totalStock} units</span>
                  </div>
                  <Progress value={(totalStock / product.reorderQuantity) * 100} />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Reorder Point</span>
                    <span className="text-muted-foreground">{product.reorderPoint} units</span>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium">Supplier</h3>
                <p>{product.supplier}</p>
                <p className="text-sm text-muted-foreground">Reorder Qty: {product.reorderQuantity} units</p>
              </div>
              
              <div className="pt-2">
                <h3 className="font-medium mb-2">Dimensions</h3>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-muted/50 p-2 rounded">
                    <p className="text-muted-foreground">Width</p>
                    <p className="font-medium">{product.dimensions.width} in</p>
                  </div>
                  <div className="bg-muted/50 p-2 rounded">
                    <p className="text-muted-foreground">Height</p>
                    <p className="font-medium">{product.dimensions.height} in</p>
                  </div>
                  <div className="bg-muted/50 p-2 rounded">
                    <p className="text-muted-foreground">Depth</p>
                    <p className="font-medium">{product.dimensions.depth} in</p>
                  </div>
                  <div className="bg-muted/50 p-2 rounded">
                    <p className="text-muted-foreground">Weight</p>
                    <p className="font-medium">{product.dimensions.weight} lb</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Product Details and Stock Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs for different information sections */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid grid-cols-4 w-full">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="stock">Stock</TabsTrigger>
                <TabsTrigger value="history">History</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              
              {/* Product Details Tab */}
              <TabsContent value="details" className="space-y-4 py-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Description</h3>
                  <p>{product.description}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="font-medium">Attributes</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {product.attributes.map((attr, index) => (
                      <div key={index} className="flex justify-between border rounded-md p-2">
                        <span className="text-muted-foreground">{attr.name}</span>
                        <span className="font-medium">{attr.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-2 pt-4">
                  <h3 className="font-medium">Actions</h3>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm">
                      <Truck className="h-4 w-4 mr-2" />
                      Create Purchase Order
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleStockAdjust}>
                      <ArrowDownUp className="h-4 w-4 mr-2" />
                      Adjust Stock
                    </Button>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Product
                    </Button>
                  </div>
                </div>
              </TabsContent>
              
              {/* Stock Information Tab */}
              <TabsContent value="stock" className="space-y-4 py-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h3 className="font-medium">Location Inventory</h3>
                  <LocationSearch onSearch={handleLocationSearch} className="w-full sm:w-auto" />
                </div>
                
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {(searchResults.length > 0 ? searchResults : product.locations).map((location, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{location.name}</TableCell>
                          <TableCell className="text-right">{location.quantity}</TableCell>
                          <TableCell>
                            {location.quantity <= product.reorderPoint ? (
                              <div className="flex items-center">
                                <AlertTriangle className="h-4 w-4 text-yellow-500 mr-1" />
                                <span className="text-sm text-yellow-500">Low Stock</span>
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <Package className="h-4 w-4 text-green-500 mr-1" />
                                <span className="text-sm text-green-500">In Stock</span>
                              </div>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm">
                              <ArrowDownUp className="h-4 w-4 mr-1" />
                              Adjust
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="pt-4">
                  <h3 className="font-medium mb-4">Stock Movement</h3>
                  <div className="h-[250px] border rounded-md p-4">
                    <StockMovementChart
                      data={stockMovementData}
                      categories={["received", "shipped"]}
                      index="date"
                      colors={["#10b981", "#ef4444"]}
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Transaction History Tab */}
              <TabsContent value="history" className="space-y-4 py-4">
                <h3 className="font-medium">Transaction History</h3>
                <div className="border rounded-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead>Reference</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionHistory.map((transaction, index) => (
                        <TableRow key={index}>
                          <TableCell>{transaction.date}</TableCell>
                          <TableCell>
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              transaction.type === 'Received' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300' 
                                : transaction.type === 'Shipped'
                                  ? 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-300'
                                  : transaction.type === 'Transfer'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-300'
                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300'
                            }`}>
                              {transaction.type}
                            </span>
                          </TableCell>
                          <TableCell>{transaction.location}</TableCell>
                          <TableCell className={`text-right ${
                            transaction.quantity < 0 ? 'text-red-500' : 'text-green-500'
                          }`}>
                            {transaction.quantity > 0 ? `+${transaction.quantity}` : transaction.quantity}
                          </TableCell>
                          <TableCell>{transaction.reference}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
              
              {/* Analytics Tab */}
              <TabsContent value="analytics" className="space-y-4 py-4">
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-primary" />
                  <h3 className="font-medium">Product Analytics</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="bg-muted/30 rounded-md p-4 border">
                    <h4 className="text-sm text-muted-foreground mb-1">Average Monthly Sales</h4>
                    <p className="text-2xl font-bold">32 units</p>
                  </div>
                  <div className="bg-muted/30 rounded-md p-4 border">
                    <h4 className="text-sm text-muted-foreground mb-1">Average Days in Stock</h4>
                    <p className="text-2xl font-bold">45 days</p>
                  </div>
                  <div className="bg-muted/30 rounded-md p-4 border">
                    <h4 className="text-sm text-muted-foreground mb-1">Profit Margin</h4>
                    <p className="text-2xl font-bold">50.0%</p>
                  </div>
                </div>
                
                <div className="text-center py-8 px-4 border rounded-md bg-muted/30">
                  <BarChart3 className="h-12 w-12 text-muted-foreground opacity-30 mx-auto mb-2" />
                  <h3 className="font-medium text-lg mb-2">Advanced Analytics</h3>
                  <p className="text-muted-foreground max-w-md mx-auto mb-4">
                    Advanced product analytics will be available in the next update, including sales forecasting, 
                    seasonality analysis, and inventory optimization recommendations.
                  </p>
                  <Button>Request Early Access</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SingleProduct;
