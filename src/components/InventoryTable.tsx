
import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Filter,
  Plus,
  Pencil,
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { UpdateInventoryForm } from "./UpdateInventoryForm";
import { 
  InventoryItem, 
  getInventoryItems, 
  deleteInventoryItem, 
  updateInventoryQuantity 
} from "@/lib/data/inventoryData";

export function InventoryTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterLocation, setFilterLocation] = useState<string | null>(null);
  
  // Get unique locations from inventory data
  const uniqueLocations = [...new Set(inventoryData.map(item => item.location))];
  
  useEffect(() => {
    // Load inventory data from localStorage
    loadInventoryData();
  }, []);
  
  const loadInventoryData = () => {
    const data = getInventoryItems();
    setInventoryData(data);
  };
  
  // Filter inventory data based on search query and filters
  const filteredData = inventoryData.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus ? item.status === filterStatus : true;
    const matchesLocation = filterLocation ? item.location === filterLocation : true;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });
  
  // Handle item deletion
  const handleDeleteItem = (id: string) => {
    try {
      const result = deleteInventoryItem(id);
      if (result) {
        toast.success("Item deleted successfully");
        loadInventoryData();
      } else {
        toast.error("Failed to delete item");
      }
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("An error occurred while deleting the item");
    }
  };
  
  // Handle form submission success
  const handleFormSuccess = () => {
    loadInventoryData();
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };
  
  // Function to render status badge with appropriate color and icon
  const renderStatus = (status: InventoryItem["status"]) => {
    switch (status) {
      case "In Stock":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-2 py-1">
            <CheckCircle2 className="w-3 h-3 mr-1" /> {status}
          </Badge>
        );
      case "Low Stock":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-2 py-1">
            <AlertTriangle className="w-3 h-3 mr-1" /> {status}
          </Badge>
        );
      case "Out of Stock":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 px-2 py-1">
            <XCircle className="w-3 h-3 mr-1" /> {status}
          </Badge>
        );
      default:
        return status;
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <SearchBar 
          placeholder="Search inventory..." 
          className="w-full sm:w-80" 
          onChange={setSearchQuery}
        />
        
        <div className="flex space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9">
                <Filter className="mr-2 h-4 w-4" />
                Filter
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                All Items
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("In Stock")}>
                In Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Low Stock")}>
                Low Stock
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilterStatus("Out of Stock")}>
                Out of Stock
              </DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Location</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setFilterLocation(null)}>
                All Locations
              </DropdownMenuItem>
              {uniqueLocations.map(location => (
                <DropdownMenuItem 
                  key={location} 
                  onClick={() => setFilterLocation(location)}
                >
                  {location}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="default" size="sm" className="h-9">
                <Plus className="mr-2 h-4 w-4" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Add Inventory Item</DialogTitle>
              </DialogHeader>
              <UpdateInventoryForm 
                onSuccess={handleFormSuccess}
                onCancel={() => setIsAddDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">SKU</TableHead>
              <TableHead>Product Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((item) => (
                <TableRow key={item.id} className="group hover:bg-muted/50">
                  <TableCell className="font-medium">{item.sku}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.location}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell>{renderStatus(item.status)}</TableCell>
                  <TableCell className="text-muted-foreground">{item.lastUpdated}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      <Dialog open={isEditDialogOpen && selectedItem?.id === item.id} onOpenChange={(open) => {
                        if (!open) setSelectedItem(null);
                        setIsEditDialogOpen(open);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setSelectedItem(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[500px]">
                          <DialogHeader>
                            <DialogTitle>Edit Inventory Item</DialogTitle>
                          </DialogHeader>
                          {selectedItem && (
                            <UpdateInventoryForm 
                              item={selectedItem}
                              onSuccess={handleFormSuccess}
                              onCancel={() => {
                                setIsEditDialogOpen(false);
                                setSelectedItem(null);
                              }}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <AlertDialog 
                        open={confirmDelete === item.id} 
                        onOpenChange={(open) => {
                          if (!open) setConfirmDelete(null);
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setConfirmDelete(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Inventory Item</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {item.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  No items found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
