
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar as CalendarIcon, Download, Filter, LineChart, BarChart3, PieChart } from "lucide-react";
import { StockMovementChart } from "@/components/charts/StockMovementChart";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Sample report data
const stockMovementData = [
  { date: "Jan", inbound: 120, outbound: 90 },
  { date: "Feb", inbound: 150, outbound: 110 },
  { date: "Mar", inbound: 180, outbound: 140 },
  { date: "Apr", inbound: 210, outbound: 180 },
  { date: "May", inbound: 250, outbound: 190 },
  { date: "Jun", inbound: 280, outbound: 220 },
];

const topProductsData = [
  { name: "Wireless Headphones", quantity: 450, revenue: 35990 },
  { name: "USB-C Cable 2m", quantity: 780, revenue: 9800 },
  { name: "Bluetooth Speaker", quantity: 320, revenue: 15990 },
  { name: "Wireless Mouse", quantity: 410, revenue: 14350 },
  { name: "Mechanical Keyboard", quantity: 210, revenue: 27300 },
];

const Reports = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
            <p className="text-sm text-muted-foreground">
              View detailed reports and analytics on inventory performance
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="w-[240px] justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        {/* Reports Tabs */}
        <div className="bg-card rounded-lg border shadow-soft animate-fade-in">
          <Tabs defaultValue="inventory" className="w-full p-4">
            <TabsList className="mb-4">
              <TabsTrigger value="inventory">Inventory Movement</TabsTrigger>
              <TabsTrigger value="sales">Sales Analysis</TabsTrigger>
              <TabsTrigger value="forecast">Stock Forecast</TabsTrigger>
            </TabsList>
            
            <TabsContent value="inventory" className="space-y-6">
              {/* Chart */}
              <div className="bg-background rounded-md p-4 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Stock Movement Over Time</h3>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <div className="h-[300px]">
                  <StockMovementChart
                    data={stockMovementData}
                    categories={["inbound", "outbound"]}
                    index="date"
                    colors={["#10b981", "#ef4444"]}
                  />
                </div>
              </div>
              
              {/* Details Table */}
              <div className="rounded-md border">
                <div className="flex items-center justify-between p-4 border-b">
                  <h3 className="font-medium">Detailed Movement</h3>
                  <Input 
                    placeholder="Search movements..." 
                    className="max-w-xs"
                  />
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>2023-06-15</TableCell>
                      <TableCell>Wireless Headphones</TableCell>
                      <TableCell>Warehouse A</TableCell>
                      <TableCell>Inbound</TableCell>
                      <TableCell className="text-right">50</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2023-06-14</TableCell>
                      <TableCell>USB-C Cable 2m</TableCell>
                      <TableCell>Warehouse B</TableCell>
                      <TableCell>Outbound</TableCell>
                      <TableCell className="text-right">120</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2023-06-14</TableCell>
                      <TableCell>Bluetooth Speaker</TableCell>
                      <TableCell>Distribution Center</TableCell>
                      <TableCell>Transfer</TableCell>
                      <TableCell className="text-right">35</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2023-06-13</TableCell>
                      <TableCell>Mechanical Keyboard</TableCell>
                      <TableCell>Warehouse A</TableCell>
                      <TableCell>Adjustment</TableCell>
                      <TableCell className="text-right">-5</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>2023-06-12</TableCell>
                      <TableCell>HDMI Adapter</TableCell>
                      <TableCell>Retail Store #1</TableCell>
                      <TableCell>Outbound</TableCell>
                      <TableCell className="text-right">25</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
            
            <TabsContent value="sales" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Top Products */}
                <div className="bg-background rounded-md p-4 border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Top Products by Revenue</h3>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <PieChart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topProductsData.map((product, index) => (
                        <TableRow key={index}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell className="text-right">{product.quantity}</TableCell>
                          <TableCell className="text-right">${(product.revenue / 100).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                {/* Sales by Location */}
                <div className="bg-background rounded-md p-4 border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium">Sales by Location</h3>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <PieChart className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <BarChart3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">Location sales chart will be displayed here</p>
                  </div>
                </div>
              </div>
              
              {/* Sales Trend */}
              <div className="bg-background rounded-md p-4 border">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-medium">Sales Trend</h3>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                </div>
                <div className="h-[300px] flex items-center justify-center">
                  <LineChart className="h-12 w-12 text-muted-foreground opacity-30" />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="forecast" className="space-y-6">
              <div className="bg-background rounded-md p-6 border text-center">
                <LineChart className="h-16 w-16 text-muted-foreground opacity-30 mx-auto mb-4" />
                <h3 className="font-medium text-lg mb-2">Stock Forecast Analytics</h3>
                <p className="text-muted-foreground mb-6">
                  Advanced inventory forecasting will be available in the next update.
                </p>
                <Button>Request Early Access</Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Report Templates */}
        <div className="bg-card rounded-lg border shadow-soft p-6">
          <h3 className="text-lg font-medium mb-4">Saved Report Templates</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <h4 className="font-medium mb-1">Monthly Inventory Summary</h4>
              <p className="text-sm text-muted-foreground">Last generated: 2 days ago</p>
            </div>
            <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <h4 className="font-medium mb-1">Product Performance</h4>
              <p className="text-sm text-muted-foreground">Last generated: 1 week ago</p>
            </div>
            <div className="border rounded-md p-4 hover:bg-muted/50 transition-colors cursor-pointer">
              <h4 className="font-medium mb-1">Low Stock Alert</h4>
              <p className="text-sm text-muted-foreground">Last generated: 1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
