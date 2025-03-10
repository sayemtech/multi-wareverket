
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { InventoryTable } from "@/components/InventoryTable";
import { InventoryAlerts } from "@/components/InventoryAlerts";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { LocationSearch } from "@/components/LocationSearch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { StockMovementChart } from "@/components/charts/StockMovementChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Clock, 
  Download, 
  Filter, 
  Plus, 
  RefreshCw, 
  Upload, 
  ShoppingCart, 
  Truck, 
  PackageSearch,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { UpdateInventoryForm } from "@/components/UpdateInventoryForm";

// Sample data for the overview chart
const overviewData = [
  {
    name: "Jan",
    total: 1420,
  },
  {
    name: "Feb",
    total: 1620,
  },
  {
    name: "Mar",
    total: 1700,
  },
  {
    name: "Apr",
    total: 1490,
  },
  {
    name: "May",
    total: 2100,
  },
  {
    name: "Jun",
    total: 1800,
  },
];

// Sample data for the category chart
const categoryData = [
  {
    name: "Electronics",
    total: 580,
  },
  {
    name: "Clothing",
    total: 420,
  },
  {
    name: "Home",
    total: 380,
  },
  {
    name: "Food",
    total: 290,
  },
  {
    name: "Other",
    total: 210,
  },
];

// Sample data for stock movement
const stockMovementData = [
  { date: "Aug 1", incoming: 35, outgoing: 28 },
  { date: "Aug 2", incoming: 42, outgoing: 30 },
  { date: "Aug 3", incoming: 25, outgoing: 38 },
  { date: "Aug 4", incoming: 30, outgoing: 32 },
  { date: "Aug 5", incoming: 45, outgoing: 25 },
  { date: "Aug 6", incoming: 52, outgoing: 40 },
  { date: "Aug 7", incoming: 48, outgoing: 56 },
];

// Sample alerts data
const sampleAlerts = [
  {
    id: "1",
    type: "low_stock" as const,
    message: "Low stock alert",
    item: "Wireless Headphones",
    location: "Warehouse A",
    quantity: 5,
    timestamp: "10 minutes ago",
    isRead: false
  },
  {
    id: "2",
    type: "reorder_needed" as const,
    message: "Reorder required",
    item: "USB-C Cable 2m",
    location: "Warehouse B",
    quantity: 0,
    timestamp: "1 hour ago",
    isRead: false
  },
  {
    id: "3",
    type: "stock_received" as const,
    message: "New stock received",
    item: "Bluetooth Speaker",
    location: "Warehouse A",
    quantity: 50,
    timestamp: "3 hours ago",
    isRead: true
  }
];

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [alerts, setAlerts] = useState(sampleAlerts);
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const navigate = useNavigate();
  
  // Format date for display
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  }).format(currentTime);
  
  // Format time for display
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric', 
    minute: 'numeric', 
    second: 'numeric', 
    hour12: true
  }).format(currentTime);
  
  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle barcode scanning
  const handleBarcodeScanned = (code: string) => {
    toast.success(`Barcode scanned: ${code}`, {
      description: "Item information retrieved successfully",
    });
  };
  
  // Handle location search
  const handleLocationSearch = (query: string) => {
    toast.info(`Searching for location: ${query}`, {
      description: "Please wait while we search for matching locations",
    });
  };
  
  // Handle marking alerts as read
  const handleMarkAsRead = (id: string) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, isRead: true } : alert
    ));
    toast.success("Alert marked as read");
  };
  
  // Handle clear all alerts
  const handleClearAllAlerts = () => {
    setAlerts([]);
    toast.success("All alerts cleared");
  };
  
  // Handle clear single alert
  const handleClearAlert = (id: string) => {
    setAlerts(alerts.filter(alert => alert.id !== id));
    toast.success("Alert removed");
  };
  
  // Handle export data
  const handleExportData = (format: 'csv' | 'pdf' | 'excel') => {
    toast.success(`Data export initiated in ${format.toUpperCase()} format`, {
      description: "Your download will begin shortly"
    });
    setIsExportDialogOpen(false);
  };
  
  // Handle filter application
  const handleApplyFilter = () => {
    toast.success("Filters applied successfully");
    setIsFilterDialogOpen(false);
  };
  
  // Handle navigation to other sections
  const handleNavigate = (path: string) => {
    navigate(path);
  };
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <RefreshCw className="h-12 w-12 animate-spin-slow text-primary opacity-50 mx-auto" />
            <h3 className="mt-4 text-lg font-medium">Loading dashboard...</h3>
            <p className="text-sm text-muted-foreground">Please wait a moment</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <Clock className="h-3.5 w-3.5 mr-1" />
              <span>
                {formattedDate} | {formattedTime}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <BarcodeScanner onCodeScanned={handleBarcodeScanned} />
            
            {/* Filter Dialog */}
            <Dialog open={isFilterDialogOpen} onOpenChange={setIsFilterDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filter Inventory</DialogTitle>
                  <DialogDescription>
                    Apply filters to narrow down inventory items.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  {/* Filter form elements would go here */}
                  <p className="text-sm text-muted-foreground">Filter options coming soon</p>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsFilterDialogOpen(false)}>Cancel</Button>
                  <Button onClick={handleApplyFilter}>Apply Filters</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Export Dialog */}
            <Dialog open={isExportDialogOpen} onOpenChange={setIsExportDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Export Inventory Data</DialogTitle>
                  <DialogDescription>
                    Choose a format to export your inventory data.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="flex flex-col space-y-2">
                    <Button variant="outline" onClick={() => handleExportData('csv')}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                    <Button variant="outline" onClick={() => handleExportData('excel')}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export as Excel
                    </Button>
                    <Button variant="outline" onClick={() => handleExportData('pdf')}>
                      <FileText className="h-4 w-4 mr-2" />
                      Export as PDF
                    </Button>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsExportDialogOpen(false)}>Cancel</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            {/* Add Item Dialog */}
            <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
              <DialogTrigger asChild>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Item
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Inventory Item</DialogTitle>
                  <DialogDescription>
                    Fill out the form below to add a new inventory item to your system.
                  </DialogDescription>
                </DialogHeader>
                <UpdateInventoryForm 
                  onSuccess={() => {
                    setIsAddItemOpen(false);
                    toast.success("Item added successfully");
                  }}
                  onCancel={() => setIsAddItemOpen(false)}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Search & Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <LocationSearch onSearch={handleLocationSearch} className="md:col-span-2" />
          <div className="flex items-center justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full md:w-auto"
              onClick={() => handleNavigate("/transfer?type=incoming")}
            >
              <Truck className="h-4 w-4 mr-2" />
              Incoming
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full md:w-auto"
              onClick={() => handleNavigate("/transfer?type=outgoing")}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Outgoing
            </Button>
          </div>
        </div>
        
        {/* Metrics Overview */}
        <DashboardMetrics />
        
        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card rounded-lg border shadow-soft p-4 animate-slide-up delay-100">
              <h3 className="text-lg font-medium mb-4">Inventory Overview</h3>
              <AreaChart 
                data={overviewData}
                categories={["total"]}
                index="name"
                colors={["#3b82f6"]}
                yAxisWidth={40}
                showLegend={false}
                showGridLines={false}
                className="h-[200px]"
              />
              <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                <span>Shows total inventory items over time</span>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toast.info("Inventory chart data uploaded")}>
                    <Upload className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toast.success("Inventory chart downloaded")}>
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-lg border shadow-soft p-4 animate-slide-up delay-200">
              <h3 className="text-lg font-medium mb-4">Stock Movement</h3>
              <StockMovementChart 
                data={stockMovementData}
                categories={["incoming", "outgoing"]}
                index="date"
                colors={["#22c55e", "#ef4444"]}
                yAxisWidth={40}
                showLegend={true}
                showGridLines={true}
                className="h-[200px]"
              />
              <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                <span>Incoming vs outgoing stock movement</span>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toast.info("Stock movement data uploaded")}>
                    <Upload className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toast.success("Stock movement chart downloaded")}>
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6">
            <div className="bg-card rounded-lg border shadow-soft p-4 animate-slide-up delay-200">
              <h3 className="text-lg font-medium mb-4">Inventory by Category</h3>
              <BarChart 
                data={categoryData}
                categories={["total"]}
                index="name"
                colors={["#3b82f6"]}
                yAxisWidth={40}
                showLegend={false}
                showGridLines={false}
                className="h-[200px]"
              />
              <div className="mt-2 text-xs text-muted-foreground flex justify-between">
                <span>Shows inventory distribution by category</span>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toast.info("Category data uploaded")}>
                    <Upload className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toast.success("Category chart downloaded")}>
                    <Download className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
            
            <InventoryAlerts 
              alerts={alerts}
              onMarkAsRead={handleMarkAsRead}
              onClearAll={handleClearAllAlerts}
              onClearAlert={handleClearAlert}
              className="animate-slide-up delay-300"
            />
          </div>
        </div>
        
        {/* Recent Inventory Activity */}
        <div className="space-y-4 animate-slide-up delay-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold tracking-tight">Recent Inventory</h2>
            <Button 
              variant="link" 
              size="sm" 
              className="text-primary"
              onClick={() => handleNavigate("/inventory")}
            >
              View All
            </Button>
          </div>
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="low">Low Stock</TabsTrigger>
              <TabsTrigger value="recent">Recently Added</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-0">
              <InventoryTable />
            </TabsContent>
            <TabsContent value="low" className="mt-0">
              <InventoryTable filterBy="status" filterValue="Low Stock" />
            </TabsContent>
            <TabsContent value="recent" className="mt-0">
              <InventoryTable sortBy="dateAdded" sortDirection="desc" />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
