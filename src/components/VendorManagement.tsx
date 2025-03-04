
import React from "react";
import { Building2, ExternalLink, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface Vendor {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  status: "active" | "inactive" | "pending";
  productsSupplied: number;
  lastOrder: string;
}

interface VendorManagementProps {
  vendors: Vendor[];
  className?: string;
}

export function VendorManagement({ vendors, className }: VendorManagementProps) {
  // Function to render status badge
  const renderStatus = (status: Vendor["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Active</Badge>;
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200">Inactive</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">Pending</Badge>;
      default:
        return status;
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="p-4 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="h-5 w-5 text-muted-foreground mr-2" />
            <h3 className="text-lg font-medium">Vendor Management</h3>
          </div>
          <Button size="sm">
            Add Vendor
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Products</TableHead>
                <TableHead>Last Order</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendors.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.name}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">{vendor.contactPerson}</div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {vendor.email}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center">
                        <Phone className="h-3 w-3 mr-1" />
                        {vendor.phone}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{renderStatus(vendor.status)}</TableCell>
                  <TableCell className="text-right">{vendor.productsSupplied}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {vendor.lastOrder}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      
      <CardFooter className="p-2 bg-muted/30 justify-center">
        <Button variant="link" size="sm">
          View All Vendors
        </Button>
      </CardFooter>
    </Card>
  );
}
