
import { useState } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Plus, Search, Filter, MoreVertical, Phone, Mail, MapPin } from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VendorManagement } from "@/components/VendorManagement";

// Sample vendor data
const vendorData = [
  {
    id: "1",
    name: "TechSupply Inc.",
    contact: "John Smith",
    email: "john@techsupply.com",
    phone: "+1 (555) 123-4567",
    address: "123 Tech Blvd, San Jose, CA 95123",
    status: "active",
    orders: 42,
    rating: 4.7,
    products: ["Wireless Headphones", "USB-C Cables", "Bluetooth Speakers"],
    lastOrder: "2023-06-10"
  },
  {
    id: "2",
    name: "ElectroDistributors",
    contact: "Emma Johnson",
    email: "emma@electrodist.com",
    phone: "+1 (555) 234-5678",
    address: "456 Circuit Ave, Austin, TX 78701",
    status: "active",
    orders: 36,
    rating: 4.5,
    products: ["Power Banks", "Laptop Stands", "Wireless Mice"],
    lastOrder: "2023-06-05"
  },
  {
    id: "3",
    name: "OfficeWorks Supply",
    contact: "David Lee",
    email: "david@officeworks.com",
    phone: "+1 (555) 345-6789",
    address: "789 Business Pkwy, Chicago, IL 60607",
    status: "inactive",
    orders: 18,
    rating: 3.8,
    products: ["Desk Organizers", "Stationery", "Office Chairs"],
    lastOrder: "2023-05-20"
  },
  {
    id: "4",
    name: "GlobalGadgets Ltd.",
    contact: "Sarah Wilson",
    email: "sarah@globalgadgets.com",
    phone: "+1 (555) 456-7890",
    address: "321 Import Dr, Seattle, WA 98101",
    status: "active",
    orders: 29,
    rating: 4.2,
    products: ["Smartwatches", "Tablets", "Phone Cases"],
    lastOrder: "2023-06-02"
  },
  {
    id: "5",
    name: "PremiumParts Co.",
    contact: "Michael Brown",
    email: "michael@premiumparts.com",
    phone: "+1 (555) 567-8901",
    address: "654 Quality Rd, Boston, MA 02108",
    status: "pending",
    orders: 8,
    rating: 4.0,
    products: ["CPU Coolers", "Graphics Cards", "SSD Drives"],
    lastOrder: "2023-06-12"
  }
];

const Vendors = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showVendorManagement, setShowVendorManagement] = useState(false);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  
  // Filter vendors based on search query
  const filteredVendors = vendorData.filter(vendor => 
    vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
    vendor.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleOpenVendorManagement = (vendor: any = null) => {
    setSelectedVendor(vendor);
    setShowVendorManagement(true);
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Vendors</h1>
            <p className="text-sm text-muted-foreground">
              Manage supplier relationships and purchase orders
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button size="sm" onClick={() => handleOpenVendorManagement()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Vendor
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search vendors..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {/* Vendors Table */}
        <div className="bg-card rounded-lg border shadow-soft overflow-hidden animate-fade-in">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendors.length > 0 ? (
                filteredVendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">
                      <div>
                        {vendor.name}
                        <div className="text-xs text-muted-foreground mt-1 flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {vendor.address}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        {vendor.contact}
                        <div className="text-xs text-muted-foreground mt-1">
                          <div className="flex items-center">
                            <Mail className="h-3 w-3 mr-1" />
                            {vendor.email}
                          </div>
                          <div className="flex items-center mt-0.5">
                            <Phone className="h-3 w-3 mr-1" />
                            {vendor.phone}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {vendor.products.join(", ")}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        vendor.status === 'active' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-300' 
                          : vendor.status === 'inactive'
                            ? 'bg-gray-100 text-gray-800 dark:bg-gray-800/20 dark:text-gray-300'
                            : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800/20 dark:text-yellow-300'
                      }`}>
                        {vendor.status.charAt(0).toUpperCase() + vendor.status.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{vendor.orders}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenVendorManagement(vendor)}>
                            Edit Vendor
                          </DropdownMenuItem>
                          <DropdownMenuItem>View Orders</DropdownMenuItem>
                          <DropdownMenuItem>Create Purchase Order</DropdownMenuItem>
                          <DropdownMenuItem>Contact Vendor</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No vendors found matching your search.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
          <div className="bg-card rounded-lg border shadow-soft p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Total Vendors</h3>
            <div className="text-3xl font-bold">{vendorData.length}</div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-soft p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Active Vendors</h3>
            <div className="text-3xl font-bold">{vendorData.filter(v => v.status === 'active').length}</div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-soft p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Orders This Month</h3>
            <div className="text-3xl font-bold">24</div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-soft p-6">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">Avg. Fulfillment Time</h3>
            <div className="text-3xl font-bold">3.5 days</div>
          </div>
        </div>
        
        {/* Vendor Management Dialog */}
        {showVendorManagement && (
          <VendorManagement
            open={showVendorManagement}
            onOpenChange={setShowVendorManagement}
            vendor={selectedVendor}
          />
        )}
      </div>
    </Layout>
  );
};

export default Vendors;
