
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { 
  Calendar, 
  CreditCard, 
  DollarSign, 
  Download, 
  FileDown, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  Search, 
  ShoppingCart, 
  Truck, 
  User
} from "lucide-react";
import { getSales, getSalesByStatus, getRecentSales, deleteSale, Sale } from "@/lib/data/salesData";
import { getCustomers } from "@/lib/data/customersData";

export default function Sales() {
  const [sales, setSales] = useState<Sale[]>(getSales());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  
  // Filter sales based on search term
  const filteredSales = sales.filter(sale => 
    sale.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sale.id.includes(searchTerm) ||
    sale.paymentMethod.includes(searchTerm)
  );
  
  // Get filtered sales based on current tab
  const getFilteredSalesByTab = () => {
    if (searchTerm) return filteredSales;
    
    switch (currentTab) {
      case "pending":
        return getSalesByStatus("pending");
      case "paid":
        return getSalesByStatus("paid");
      case "overdue":
        return getSalesByStatus("overdue");
      case "recent":
        return getRecentSales(30);
      case "all":
      default:
        return sales;
    }
  };
  
  const displaySales = getFilteredSalesByTab();
  
  // Handle delete sale
  const handleDeleteSale = (id: string) => {
    if (confirm("Are you sure you want to delete this sale?")) {
      deleteSale(id);
      setSales(getSales());
      toast.success("Sale record deleted successfully");
    }
  };
  
  // Get status badge
  const getStatusBadge = (status: Sale["paymentStatus"]) => {
    switch (status) {
      case "paid":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Paid</Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
      case "overdue":
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Sales</h1>
            <p className="text-muted-foreground mt-1">
              Manage your sales orders and transactions
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Sale
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Sale</DialogTitle>
                  <DialogDescription>
                    Record a new sales transaction for a customer.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Sale creation form will be implemented in a future update.
                  </p>
                </div>
                <DialogFooter>
                  <Button variant="outline">Cancel</Button>
                  <Button>Create Sale</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$4,289.99</div>
              <p className="text-xs text-muted-foreground">+12.5% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Pending Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$982.45</div>
              <p className="text-xs text-muted-foreground">6 pending invoices</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$156.32</div>
              <p className="text-xs text-muted-foreground">+2.3% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Monthly Target</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67%</div>
              <p className="text-xs text-muted-foreground">$4,290 of $6,400</p>
            </CardContent>
          </Card>
        </div>
        
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <div className="w-full md:w-1/3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search sales..."
                className="pl-8 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setCurrentTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="all">All Sales</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          
          <Card>
            <CardHeader className="px-6 py-4">
              <CardTitle className="text-lg">Sales Transactions</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {displaySales.length > 0 ? (
                    displaySales.map((sale) => (
                      <TableRow key={sale.id}>
                        <TableCell className="font-medium">{`#${sale.id}`}</TableCell>
                        <TableCell>{sale.customerName}</TableCell>
                        <TableCell>{sale.date}</TableCell>
                        <TableCell>{sale.items.length}</TableCell>
                        <TableCell className="text-right">{`$${sale.total.toFixed(2)}`}</TableCell>
                        <TableCell>{getStatusBadge(sale.paymentStatus)}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem>
                                <CreditCard className="h-4 w-4 mr-2" /> Process Payment
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Truck className="h-4 w-4 mr-2" /> Ship Order
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" /> Download Invoice
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleDeleteSale(sale.id)} className="text-red-600">
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                        {searchTerm ? "No sales match your search" : "No sales found for this filter."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </Layout>
  );
}
