
import { useState } from "react";
import Layout from "@/components/Layout";
import { getCustomers, addCustomer, updateCustomer, deleteCustomer, Customer } from "@/lib/data/customersData";
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
import { PlusCircle, Search, Edit, Trash2, Phone, Mail, Building, MapPin } from "lucide-react";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter 
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

export default function Customers() {
  const [customers, setCustomers] = useState(getCustomers());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    notes: ""
  });
  
  const { toast } = useToast();
  
  const filteredCustomers = customers.filter((customer) => 
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (customer.company && customer.company.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleAddCustomer = () => {
    try {
      if (!formData.name || !formData.email || !formData.phone) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }
      
      const newCustomer = addCustomer(formData as Omit<Customer, "id" | "createdAt" | "updatedAt">);
      setCustomers(getCustomers());
      
      toast({
        title: "Customer added",
        description: `${newCustomer.name} has been added successfully.`
      });
      
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        notes: ""
      });
    } catch (error) {
      toast({
        title: "Error adding customer",
        description: "An error occurred while adding the customer.",
        variant: "destructive"
      });
    }
  };
  
  const handleEditCustomer = () => {
    try {
      if (!selectedCustomer || !formData.name || !formData.email || !formData.phone) {
        toast({
          title: "Missing required fields",
          description: "Please fill in all required fields.",
          variant: "destructive"
        });
        return;
      }
      
      updateCustomer(selectedCustomer.id, formData);
      setCustomers(getCustomers());
      
      toast({
        title: "Customer updated",
        description: `${formData.name} has been updated successfully.`
      });
      
      setIsEditing(false);
      setSelectedCustomer(null);
    } catch (error) {
      toast({
        title: "Error updating customer",
        description: "An error occurred while updating the customer.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteCustomer = (id: string, name: string) => {
    try {
      deleteCustomer(id);
      setCustomers(getCustomers());
      
      toast({
        title: "Customer deleted",
        description: `${name} has been deleted successfully.`
      });
      
      if (selectedCustomer?.id === id) {
        setSelectedCustomer(null);
      }
    } catch (error) {
      toast({
        title: "Error deleting customer",
        description: "An error occurred while deleting the customer.",
        variant: "destructive"
      });
    }
  };
  
  const handleSelectCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
  };
  
  const handleEditClick = (customer: Customer) => {
    setIsEditing(true);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      company: customer.company || "",
      address: customer.address || "",
      notes: customer.notes || ""
    });
  };
  
  return (
    <Layout>
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Customer Management</h1>
            <p className="text-muted-foreground">
              Manage your customer relationships and contacts
            </p>
          </div>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Customer
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
                <DialogDescription>
                  Fill in the customer details and click save to add a new customer.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Smith"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-sm font-medium">
                      Company
                    </label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      placeholder="Acme Corp"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone <span className="text-destructive">*</span>
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="555-123-4567"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">
                    Address
                  </label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="123 Main St, Anytown, USA"
                  />
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
                    placeholder="Additional notes about the customer"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button onClick={handleAddCustomer}>Save Customer</Button>
                </DialogClose>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex items-center space-x-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search customers by name, email, or company..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="border shadow-sm">
              <CardHeader className="bg-muted/50 pb-3">
                <CardTitle className="text-lg">Customers List</CardTitle>
                <CardDescription>
                  Total of {filteredCustomers.length} customers
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-h-[550px] overflow-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-card z-10">
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCustomers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-8">
                            No customers found. Add a new customer to get started.
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredCustomers.map((customer) => (
                          <TableRow 
                            key={customer.id}
                            className={`cursor-pointer ${selectedCustomer?.id === customer.id ? "bg-muted" : ""}`}
                            onClick={() => handleSelectCustomer(customer)}
                          >
                            <TableCell className="font-medium">
                              {customer.name}
                            </TableCell>
                            <TableCell>
                              {customer.company || "—"}
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col space-y-1">
                                <span className="text-xs flex items-center text-muted-foreground">
                                  <Mail className="h-3 w-3 mr-1" /> {customer.email}
                                </span>
                                <span className="text-xs flex items-center text-muted-foreground">
                                  <Phone className="h-3 w-3 mr-1" /> {customer.phone}
                                </span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleEditClick(customer);
                                  }}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Delete Customer</DialogTitle>
                                      <DialogDescription>
                                        Are you sure you want to delete {customer.name}? This action cannot be undone.
                                      </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                      <DialogClose asChild>
                                        <Button variant="outline">Cancel</Button>
                                      </DialogClose>
                                      <DialogClose asChild>
                                        <Button
                                          variant="destructive"
                                          onClick={() => handleDeleteCustomer(customer.id, customer.name)}
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
            {selectedCustomer ? (
              isEditing ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Edit Customer</CardTitle>
                    <CardDescription>
                      Update information for {selectedCustomer.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="edit-name" className="text-sm font-medium">
                        Name <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="edit-name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="edit-company" className="text-sm font-medium">
                        Company
                      </label>
                      <Input
                        id="edit-company"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="edit-email" className="text-sm font-medium">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="edit-email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="edit-phone" className="text-sm font-medium">
                        Phone <span className="text-destructive">*</span>
                      </label>
                      <Input
                        id="edit-phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="edit-address" className="text-sm font-medium">
                        Address
                      </label>
                      <Input
                        id="edit-address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label htmlFor="edit-notes" className="text-sm font-medium">
                        Notes
                      </label>
                      <Textarea
                        id="edit-notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleInputChange}
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setFormData({
                          name: "",
                          email: "",
                          phone: "",
                          company: "",
                          address: "",
                          notes: ""
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleEditCustomer}>
                      Save Changes
                    </Button>
                  </CardFooter>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>{selectedCustomer.name}</CardTitle>
                    <CardDescription>
                      {selectedCustomer.company || "No company specified"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Contact Information</h3>
                      <div className="space-y-1">
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{selectedCustomer.email}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{selectedCustomer.phone}</span>
                        </div>
                      </div>
                    </div>
                    
                    {selectedCustomer.company && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Company</h3>
                        <div className="flex items-center text-sm">
                          <Building className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{selectedCustomer.company}</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedCustomer.address && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Address</h3>
                        <div className="flex items-start text-sm">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                          <span>{selectedCustomer.address}</span>
                        </div>
                      </div>
                    )}
                    
                    {selectedCustomer.notes && (
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Notes</h3>
                        <p className="text-sm">{selectedCustomer.notes}</p>
                      </div>
                    )}
                    
                    <div className="pt-2 space-y-2">
                      <h3 className="text-sm font-medium">Customer Since</h3>
                      <p className="text-sm">{selectedCustomer.createdAt}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button 
                      variant="outline"
                      onClick={() => handleEditClick(selectedCustomer)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Customer</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete {selectedCustomer.name}? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <DialogClose asChild>
                            <Button
                              variant="destructive"
                              onClick={() => handleDeleteCustomer(selectedCustomer.id, selectedCustomer.name)}
                            >
                              Delete
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </CardFooter>
                </Card>
              )
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Customer Details</CardTitle>
                  <CardDescription>
                    Select a customer from the list to view details
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center items-center py-12">
                  <div className="text-center text-muted-foreground">
                    <p>No customer selected</p>
                    <p className="text-sm mt-2">Click on a customer in the list to view their details</p>
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
