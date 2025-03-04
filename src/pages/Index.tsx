
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { DashboardMetrics } from "@/components/DashboardMetrics";
import { InventoryTable } from "@/components/InventoryTable";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AreaChart } from "@/components/charts/AreaChart";
import { BarChart } from "@/components/charts/BarChart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, Download, Filter, Plus, RefreshCw, Upload } from "lucide-react";

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

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
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
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              New Item
            </Button>
          </div>
        </div>
        
        {/* Metrics Overview */}
        <DashboardMetrics />
        
        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Upload className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
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
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Upload className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <Download className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        {/* Recent Inventory Activity */}
        <div className="space-y-4 animate-slide-up delay-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold tracking-tight">Recent Inventory</h2>
            <Button variant="link" size="sm" className="text-primary">
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
              <InventoryTable />
            </TabsContent>
            <TabsContent value="recent" className="mt-0">
              <InventoryTable />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
