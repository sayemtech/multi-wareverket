
import Layout from "@/components/Layout";
import { InventoryTable } from "@/components/InventoryTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Upload, Download, ArrowDownUp } from "lucide-react";

const Inventory = () => {
  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Inventory</h1>
            <p className="text-sm text-muted-foreground">
              Manage and track your inventory across all locations
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Import
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
        </div>
        
        {/* Inventory Tabs and Table */}
        <div className="bg-card rounded-lg border shadow-soft p-4 animate-fade-in">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="in-stock">In Stock</TabsTrigger>
              <TabsTrigger value="low-stock">Low Stock</TabsTrigger>
              <TabsTrigger value="out-of-stock">Out of Stock</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-0">
              <InventoryTable />
            </TabsContent>
            <TabsContent value="in-stock" className="mt-0">
              <InventoryTable />
            </TabsContent>
            <TabsContent value="low-stock" className="mt-0">
              <InventoryTable />
            </TabsContent>
            <TabsContent value="out-of-stock" className="mt-0">
              <InventoryTable />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Quick Actions Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-lg border shadow-soft p-6 animate-scale-in">
            <h3 className="text-lg font-medium mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <ArrowDownUp className="h-4 w-4 mr-2" />
                Adjust Stock
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Receive Shipment
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Upload className="h-4 w-4 mr-2" />
                Ship Order
              </Button>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-soft p-6 col-span-1 md:col-span-2 animate-scale-in">
            <h3 className="text-lg font-medium mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Download className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Received Shipment</p>
                  <p className="text-xs text-muted-foreground">50x USB-C Cables added to Warehouse A</p>
                  <p className="text-xs text-muted-foreground">Today at 10:24 AM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 pb-3 border-b">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Order Shipped</p>
                  <p className="text-xs text-muted-foreground">25x Wireless Headphones shipped from Warehouse B</p>
                  <p className="text-xs text-muted-foreground">Yesterday at 3:45 PM</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                  <ArrowDownUp className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Inventory Adjusted</p>
                  <p className="text-xs text-muted-foreground">Inventory count adjusted for 3 items in Warehouse C</p>
                  <p className="text-xs text-muted-foreground">Yesterday at 11:30 AM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Inventory;
