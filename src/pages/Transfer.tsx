
import { useState } from "react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarcodeScanner } from "@/components/BarcodeScanner";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  CheckCircle, 
  CircleAlert, 
  ClipboardList,
  PackageCheck,
  Truck, 
  Warehouse
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Sample locations
const locations = [
  { id: "1", name: "Warehouse A", address: "123 Main St, City" },
  { id: "2", name: "Warehouse B", address: "456 Elm St, City" },
  { id: "3", name: "Store Location 1", address: "789 Oak St, City" },
  { id: "4", name: "Store Location 2", address: "101 Pine St, City" },
];

// Sample items for transfer
const sampleItems = [
  { id: "1", sku: "PRD-001", name: "Wireless Headphones", quantity: 1 },
  { id: "2", sku: "PRD-002", name: "USB-C Cable 2m", quantity: 2 },
];

const InventoryTransfer = () => {
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [items, setItems] = useState(sampleItems);
  const [transferNote, setTransferNote] = useState("");
  const [quantity, setQuantity] = useState(1);
  
  // Handle barcode scanning
  const handleBarcodeScanned = (code: string) => {
    toast.success(`Item scanned: ${code}`, {
      description: "Item added to transfer list",
    });
    
    // Simulate adding a new random item
    const newItem = {
      id: Math.random().toString(),
      sku: code,
      name: `Product ${Math.floor(Math.random() * 100)}`,
      quantity: quantity
    };
    
    setItems([...items, newItem]);
  };
  
  // Handle item removal
  const handleRemoveItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast.info("Item removed from transfer list");
  };
  
  // Handle quantity change
  const handleQuantityChange = (id: string, newQuantity: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    ));
  };
  
  // Handle transfer submission
  const handleSubmitTransfer = () => {
    if (!fromLocation || !toLocation) {
      toast.error("Please select both locations");
      return;
    }
    
    if (fromLocation === toLocation) {
      toast.error("Source and destination locations cannot be the same");
      return;
    }
    
    if (items.length === 0) {
      toast.error("Please add at least one item to transfer");
      return;
    }
    
    toast.success("Inventory transfer initiated", {
      description: `${items.length} items will be transferred from ${fromLocation} to ${toLocation}`,
    });
    
    // In a real app, this would submit to an API
    console.log("Transfer submitted:", {
      fromLocation,
      toLocation,
      items,
      transferNote,
      date: new Date().toISOString(),
    });
    
    // Reset form after submission
    setItems([]);
    setTransferNote("");
  };
  
  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-5xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Inventory Transfer</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Move inventory between locations
            </p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <ClipboardList className="h-4 w-4 mr-2" />
              Transfer History
            </Button>
            <Button size="sm">
              <PackageCheck className="h-4 w-4 mr-2" />
              Batch Transfer
            </Button>
          </div>
        </div>
        
        <Separator />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Transfer Details</CardTitle>
              <CardDescription>
                Select source and destination locations for inventory transfer
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 items-center">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1 block">
                    From Location
                  </label>
                  <Select value={fromLocation} onValueChange={setFromLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location.id} value={location.name}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-center items-center">
                  <div className="bg-muted rounded-full p-2">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                </div>
                
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium mb-1 block">
                    To Location
                  </label>
                  <Select value={toLocation} onValueChange={setToLocation}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map(location => (
                        <SelectItem key={location.id} value={location.name}>
                          {location.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-1 block">
                  Transfer Notes
                </label>
                <Input
                  placeholder="Add notes about this transfer (optional)"
                  value={transferNote}
                  onChange={(e) => setTransferNote(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Transfer Summary</CardTitle>
              <CardDescription>
                Overview of current transfer
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Source:</span>
                  {fromLocation ? (
                    <Badge variant="outline">{fromLocation}</Badge>
                  ) : (
                    <span className="text-muted-foreground">Not selected</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <Warehouse className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Destination:</span>
                  {toLocation ? (
                    <Badge variant="outline">{toLocation}</Badge>
                  ) : (
                    <span className="text-muted-foreground">Not selected</span>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  <CircleAlert className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Status:</span>
                  <Badge variant="outline">Draft</Badge>
                </div>
              </div>
              
              <div className="pt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">Items to Transfer:</span>
                  <Badge variant="secondary">{items.length}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {items.length === 0 
                    ? "No items added yet" 
                    : `${items.reduce((sum, item) => sum + item.quantity, 0)} total units`}
                </div>
              </div>
            </CardContent>
            
            <CardFooter>
              <Button 
                className="w-full" 
                onClick={handleSubmitTransfer}
                disabled={!fromLocation || !toLocation || items.length === 0}
              >
                <Truck className="h-4 w-4 mr-2" />
                Submit Transfer
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        <div className="bg-card rounded-lg border shadow-md">
          <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-xl font-medium">Transfer Items</h2>
            
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <div className="flex gap-2">
                <Input
                  type="number"
                  placeholder="Qty"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-20"
                />
                <BarcodeScanner onCodeScanned={handleBarcodeScanned} />
              </div>
            </div>
          </div>
          
          <div className="border-t">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">SKU</TableHead>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.length > 0 ? (
                    items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.sku}</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            className="w-20 h-8 ml-auto"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="h-8 w-8"
                          >
                            <CircleAlert className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        <div className="flex flex-col items-center justify-center gap-1 text-muted-foreground">
                          <Truck className="h-10 w-10 opacity-20" />
                          <p>No items added to transfer</p>
                          <p className="text-sm">Scan a barcode to add items</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default InventoryTransfer;
