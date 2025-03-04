
import { useState } from "react";
import { 
  CheckCircle2, 
  AlertTriangle, 
  XCircle,
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Filter
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

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  location: string;
  quantity: number;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  lastUpdated: string;
}

// Sample inventory data
const inventoryData: InventoryItem[] = [
  {
    id: "1",
    sku: "PRD-001",
    name: "Wireless Headphones",
    location: "Warehouse A",
    quantity: 145,
    status: "In Stock",
    lastUpdated: "2023-05-12"
  },
  {
    id: "2",
    sku: "PRD-002",
    name: "USB-C Cable 2m",
    location: "Warehouse B",
    quantity: 28,
    status: "Low Stock",
    lastUpdated: "2023-05-10"
  },
  {
    id: "3",
    sku: "PRD-003",
    name: "Bluetooth Speaker",
    location: "Warehouse A",
    quantity: 56,
    status: "In Stock",
    lastUpdated: "2023-05-11"
  },
  {
    id: "4",
    sku: "PRD-004",
    name: "Laptop Stand",
    location: "Warehouse C",
    quantity: 0,
    status: "Out of Stock",
    lastUpdated: "2023-05-09"
  },
  {
    id: "5",
    sku: "PRD-005",
    name: "Wireless Mouse",
    location: "Warehouse A",
    quantity: 82,
    status: "In Stock",
    lastUpdated: "2023-05-12"
  },
  {
    id: "6",
    sku: "PRD-006",
    name: "HDMI Adapter",
    location: "Warehouse B",
    quantity: 18,
    status: "Low Stock",
    lastUpdated: "2023-05-10"
  }
];

export function InventoryTable() {
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredData = inventoryData.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
              <DropdownMenuItem>All Items</DropdownMenuItem>
              <DropdownMenuItem>In Stock</DropdownMenuItem>
              <DropdownMenuItem>Low Stock</DropdownMenuItem>
              <DropdownMenuItem>Out of Stock</DropdownMenuItem>
              
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Filter by Location</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>All Locations</DropdownMenuItem>
              <DropdownMenuItem>Warehouse A</DropdownMenuItem>
              <DropdownMenuItem>Warehouse B</DropdownMenuItem>
              <DropdownMenuItem>Warehouse C</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="default" size="sm" className="h-9">
            Export
          </Button>
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
              <TableHead className="w-[70px]"></TableHead>
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Update Stock</DropdownMenuItem>
                        <DropdownMenuItem>Move Location</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          Remove Item
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
