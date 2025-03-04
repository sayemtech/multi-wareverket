
import React from "react";
import { Building2, ExternalLink, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useForm } from "react-hook-form";

interface Vendor {
  id: string;
  name: string;
  contactPerson?: string;
  contact?: string;
  email: string;
  phone: string;
  address?: string;
  status: "active" | "inactive" | "pending";
  productsSupplied?: number;
  orders?: number;
  rating?: number;
  products?: string[];
  lastOrder: string;
}

interface VendorManagementProps {
  vendors?: Vendor[];
  className?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  vendor?: Vendor | null;
}

export function VendorManagement({ vendors = [], className, open, onOpenChange, vendor }: VendorManagementProps) {
  // Form setup for vendor dialog
  const form = useForm({
    defaultValues: {
      name: vendor?.name || "",
      contact: vendor?.contact || vendor?.contactPerson || "",
      email: vendor?.email || "",
      phone: vendor?.phone || "",
      address: vendor?.address || "",
      status: vendor?.status || "active",
    }
  });

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

  const onSubmit = (data: any) => {
    console.log("Vendor data submitted:", data);
    if (onOpenChange) {
      onOpenChange(false);
    }
  };

  // If open prop is provided, render as Dialog
  if (open !== undefined) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{vendor ? "Edit Vendor" : "Add New Vendor"}</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter vendor name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Person</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter contact name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter address" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => onOpenChange && onOpenChange(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {vendor ? "Update Vendor" : "Add Vendor"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    );
  }

  // Default card view for dashboard
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
              {vendors.length > 0 ? (
                vendors.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.name}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{vendor.contactPerson || vendor.contact}</div>
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
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                    No vendors found.
                  </TableCell>
                </TableRow>
              )}
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
