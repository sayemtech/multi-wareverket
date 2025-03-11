
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { getSales, addSale, updateSale, deleteSale, getEnrichedSales, Sale, SaleItem } from "@/lib/data/salesData";
import { getCustomers } from "@/lib/data/customersData";
import { getProducts } from "@/lib/data/productsData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { PlusCircle, Search, Edit, Trash2, Calendar, FileText, CheckCircle2, Clock, X, UserCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EnrichedSale extends Omit<Sale, "items"> {
  customer: string;
  items: (SaleItem & {
    productName: string;
    productSku: string;
  })[];
}

export default function Sales() {
  const [sales, setSales] = useState<EnrichedSale[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSale, setSelectedSale] = useState<EnrichedSale | null>(null);
  const [customers, setCustomers] = useState(getCustomers());
  const [products, setProducts] = useState(getProducts());
  const [formItems, setFormItems] = useState<(SaleItem & { id: string })[]>([
    { id: Date.now().toString(), productId: "", quantity: 1, unitPrice: 0 }
  ]);
  const [formData, setFormData] = useState({
    customerId: "",
    status: "pending",
    paymentMethod: "",
    notes: ""
  });
  
  const { toast } = useToast();
  
  useEffect(() => {
    const enrichedSales = getEnrichedSales() as EnrichedSale[];
    setSales(enrichedSales);
  }, []);
  
  const filteredSales = sales.filter((sale) => 
    sale.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sale.id.includes(searchQuery) ||
    sale.status.includes(searchQuery.toLowerCase())
  );
  
  const calculateTotal = (items: SaleItem[]) => {
    return items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleItemChange = (id: string, field: keyof SaleItem, value: string | number) => {
    setFormItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, [field]: value } 
          : item
      )
    );
  };
  
  const handleAddItem = () => {
    setFormItems(prev => [
      ...prev, 
      { id: Date.now().toString(), productId: "", quantity: 1, unitPrice: 0 }
    ]);
  };
  
  const handleRemoveItem = (id: string) => {
    if (formItems.length > 1) {
      setFormItems(prev => prev.filter(item => item.id !== id));
    }
  };
  
  const handleAddSale = () => {
    try {
      if (!formData.customerId || formItems.some(item => !item.productId)) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }
      
      // Convert form items to sale items (remove the id we added for UI purposes)
      const saleItems = formItems.map(({ id, ...rest }) => rest);
      
      const totalAmount = calculateTotal(saleItems);
      
      const newSale = addSale({
        customerId: formData.customerId,
        items: saleItems,
        totalAmount,
        status: formData.status as "pending" | "completed" | "cancelled",
        paymentMethod: formData.paymentMethod || undefined,
        notes: formData.notes || undefined
      });
      
      // Refresh the sales list
      const enrichedSales = getEnrichedSales() as EnrichedSale[];
      setSales(enrichedSales);
      
      toast({
        title: "Sale added",
        description: `Sale #${newSale.id} has been added successfully.`
      });
      
      // Reset form
      setFormData({
        customerId: "",
        status: "pending",
        paymentMethod: "",
        notes: ""
      });
      setFormItems([
        { id: Date.now().toString(), productId: "", quantity: 1, unitPrice: 0 }
      ]);
    } catch (error) {
      toast({
        title: "Error adding sale",
        description: "An error occurred while adding the sale.",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateSaleStatus = (id: string, status: "pending" | "completed" | "cancelled") => {
    try {
      updateSale(id, { status });
      
      // Refresh the sales list
      const enrichedSales = getEnrichedSales() as EnrichedSale[];
      setSales(enrichedSales);
      
      toast({
        title: "Sale updated",
        description: `Sale #${id} has been marked as ${status}.`
      });
      
      // If the selected sale was updated, refresh it too
      if (selectedSale?.id === id) {
        const updated = enrichedSales.find(s => s.id === id) || null;
        setSelectedSale(updated);
      }
    } catch (error) {
      toast({
        title: "Error updating sale",
        description: "An error occurred while updating the sale.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteSale = (id: string) => {
    try {
      deleteSale(id);
      
      // Refresh the sales list
      const enrichedSales = getEnrichedSales() as EnrichedSale[];
      setSales(enrichedSales);
      
      toast({
        title: "Sale deleted",
        description: `Sale #${id} has been deleted successfully.`
      });
      
      if (selectedSale?.id === id) {
        setSelectedSale(null);
      }
    } catch (error) {
      toast({
        title: "Error deleting sale",
        description: "An error occurred while deleting the sale.",
        variant: "destructive"
      });
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "cancelled":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4" />;
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "cancelled":
        return <X className="h-4 w-4" />;
      default:
        return null;
    }
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Sales Management</h1>
            <p className="text-muted-foreground">
              Manage your sales orders and transactions
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Sale
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>Create New Sale</DialogTitle>
                <DialogDescription>
                  Add a new sale order by filling out the form below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">
                    Customer <span className="text-destructive">*</span>
                  </label>
                  <Select
                    onValueChange={(value) => handleSelectChange("customerId", value)}
                    value={formData.customerId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select customer" />
                    </SelectTrigger>
                    <SelectContent>
                      {customers.map((customer) => (
                        <SelectItem key={customer.id} value={customer.id}>
                          {customer.name} {customer.company ? `(${customer.company})` : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">
                      Items <span className="text-destructive">*</span>
                    </label>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleAddItem}
                    >
                      Add Item
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {formItems.map((item, index) => (
                      <div key={item.id} className="flex items-center gap-2 rounded-md border p-3">
                        <div className="flex-1">
                          <Select
                            onValueChange={(value) => {
                              // When a product is selected, set its price as the unit price
                              const product = products.find(p => p.id === value);
                              handleItemChange(item.id, "productId", value);
                              if (product) {
                                handleItemChange(item.id, "unitPrice", product.price);
                              }
                            }}
                            value={item.productId}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                            <SelectContent>
                              {products.map((product) => (
                                <SelectItem key={product.id} value={product.id}>
                                  {product.name} - ${product.price.toFixed(2)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-20">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(item.id, "quantity", parseInt(e.target.value) || 1)}
                            placeholder="Qty"
                          />
                        </div>
                        <div className="w-24">
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => handleItemChange(item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                            placeholder="Price"
                          />
                        </div>
                        <div className="w-24 text-right">
                          ${(item.quantity * item.unitPrice).toFixed(2)}
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={formItems.length === 1}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <div className="text-right font-medium pt-2">
                    Total: ${calculateTotal(formItems).toFixed(2)}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">
                      Status
                    </label>
                    <Select
                      onValueChange={(value) => handleSelectChange("status", value)}
                      defaultValue="pending"
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="paymentMethod" className="text-sm font-medium">
                      Payment Method
                    </label>
                    <Input
                      id="paymentMethod"
                      name="paymentMethod"
                      value={formData.paymentMethod}
                      onChange={handleInputChange}
                      placeholder="Credit Card, Cash, etc."
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="notes" className="text-sm font-medium">
                    Notes
                  </label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes about the sale"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleAddSale}>Create Sale</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search by customer, sale ID, or status..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="border shadow-sm">
              <CardHeader className="bg-muted/50 pb-3">
                <CardTitle className="text-lg">Sales Transactions</CardTitle>
                <CardDescription>
                  Total of {filteredSales.length} sales
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[550px] overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card z-10">
                      <TableRow>
                        <TableHead>Sale ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSales.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-8">
                            No sales found. Create a new sale to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredSales.map((sale) => (
                          <TableRow 
                            key={sale.id}
                            className={`cursor-pointer ${selectedSale?.id === sale.id ? "bg-muted" : ""}`}
                            onClick={() => setSelectedSale(sale)}
                          >
                            <TableCell className="font-medium">
                              #{sale.id}
                            </TableCell>
                            <TableCell>
                              {sale.customer}
                            </TableCell>
                            <TableCell>
                              {sale.items.length} {sale.items.length === 1 ? "item" : "items"}
                            </TableCell>
                            <TableCell className="text-right">
                              ${sale.totalAmount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <div className={`inline-flex items-center space-x-1 rounded-full px-2 py-1 text-xs ${getStatusColor(sale.status)}`}>
                                {getStatusIcon(sale.status)}
                                <span className="capitalize">{sale.status}</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-muted-foreground">
                              {sale.createdAt}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2" onClick={e => e.stopPropagation()}>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Delete Sale</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to delete Sale #{sale.id}? This action cannot be undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                      </DialogClose>
                                      <DialogClose asChild>
                                        <Button
                                          variant="destructive"
                                          onClick={() => handleDeleteSale(sale.id)}
                                        >
                                          Delete
                                        </Button>
                                      </DialogClose>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            {selectedSale ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>Sale #{selectedSale.id}</span>
                    <div className={`inline-flex items-center space-x-1 rounded-full px-2 py-1 text-xs ${getStatusColor(selectedSale.status)}`}>
                      {getStatusIcon(selectedSale.status)}
                      <span className="capitalize">{selectedSale.status}</span>
                    </div>
                  </CardTitle>
                  <CardDescription className="flex justify-between items-center">
                    <span className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{selectedSale.createdAt}</span>
                    </span>
                    <span className="font-medium">${selectedSale.totalAmount.toFixed(2)}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Customer</h3>
                    <div className="flex items-center space-x-2 text-sm">
                      <UserCheck className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedSale.customer}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Items</h3>
                    <div className="rounded-md border divide-y">
                      {selectedSale.items.map((item, index) => (
                        <div key={index} className="p-2 flex justify-between">
                          <div>
                            <p className="text-sm font-medium">{item.productName}</p>
                            <p className="text-xs text-muted-foreground">SKU: {item.productSku}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{item.quantity} x ${item.unitPrice.toFixed(2)}</p>
                            <p className="text-xs font-medium">${(item.quantity * item.unitPrice).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                      <div className="p-2 flex justify-between font-medium bg-muted/20">
                        <span>Total</span>
                        <span>${selectedSale.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedSale.paymentMethod && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Payment Method</h3>
                      <p className="text-sm">{selectedSale.paymentMethod}</p>
                    </div>
                  )}
                  
                  {selectedSale.notes && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Notes</h3>
                      <div className="flex items-start space-x-2 text-sm">
                        <FileText className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <p>{selectedSale.notes}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  {selectedSale.status !== "completed" && (
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={() => handleUpdateSaleStatus(selectedSale.id, "completed")}
                    >
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Mark as Completed
                    </Button>
                  )}
                  
                  {selectedSale.status !== "cancelled" && (
                    <Button 
                      className="w-full"
                      variant="outline"
                      onClick={() => handleUpdateSaleStatus(selectedSale.id, "cancelled")}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Mark as Cancelled
                    </Button>
                  )}
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete Sale
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Delete Sale</DialogTitle>
                        <DialogDescription>
                          Are you sure you want to delete Sale #{selectedSale.id}? This action cannot be undone.
                        </DialogDescription>
                      </DialogHeader>
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <DialogClose asChild>
                          <Button
                            variant="destructive"
                            onClick={() => handleDeleteSale(selectedSale.id)}
                          >
                            Delete
                          </Button>
                        </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Sale Details</CardTitle>
                  <CardDescription>
                    Select a sale from the list to view details
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center py-12">
                  <div className="text-center text-muted-foreground">
                    <p>No sale selected</p>
                    <p className="text-sm mt-2">Click on a sale in the list to view its details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
