
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Plus, Minus, Trash2 } from "lucide-react";
import { getLocations } from "@/lib/data/locationsData";
import { getProducts } from "@/lib/data/productsData";
import { Transfer, addTransfer, updateTransfer } from "@/lib/data/transfersData";

// Schema for a single transfer item
const transferItemSchema = z.object({
  productId: z.string().min(1, "Product is required"),
  productName: z.string().min(1, "Product name is required"),
  quantity: z.coerce.number().min(1, "Quantity must be at least 1"),
});

// Schema for the entire transfer form
const transferFormSchema = z.object({
  sourceLocationId: z.string().min(1, "Source location is required"),
  sourceLocationName: z.string().min(1, "Source location name is required"),
  destinationLocationId: z.string().min(1, "Destination location is required"),
  destinationLocationName: z.string().min(1, "Destination location name is required"),
  items: z.array(transferItemSchema).min(1, "At least one item is required"),
  status: z.enum(["Pending", "In Transit", "Completed", "Cancelled"]),
  notes: z.string().optional(),
});

type TransferFormValues = z.infer<typeof transferFormSchema>;

interface TransferFormProps {
  transfer?: Transfer;
  onSuccess: () => void;
  onCancel: () => void;
}

export function TransferForm({ transfer, onSuccess, onCancel }: TransferFormProps) {
  const { toast } = useToast();
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  const [products, setProducts] = useState<{ id: string; name: string }[]>([]);
  
  // Load locations and products
  useEffect(() => {
    const locationData = getLocations();
    setLocations(locationData.map(loc => ({ id: loc.id, name: loc.name })));
    
    const productData = getProducts();
    setProducts(productData.map(prod => ({ id: prod.id, name: prod.name })));
  }, []);
  
  // Set up form with default values
  const form = useForm<TransferFormValues>({
    resolver: zodResolver(transferFormSchema),
    defaultValues: {
      sourceLocationId: transfer?.sourceLocationId || "",
      sourceLocationName: transfer?.sourceLocationName || "",
      destinationLocationId: transfer?.destinationLocationId || "",
      destinationLocationName: transfer?.destinationLocationName || "",
      items: transfer?.items || [{
        productId: "",
        productName: "",
        quantity: 1
      }],
      status: transfer?.status || "Pending",
      notes: transfer?.notes || "",
    },
  });
  
  // Handle source location change
  const handleSourceLocationChange = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      form.setValue("sourceLocationId", locationId);
      form.setValue("sourceLocationName", location.name);
    }
  };
  
  // Handle destination location change
  const handleDestinationLocationChange = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      form.setValue("destinationLocationId", locationId);
      form.setValue("destinationLocationName", location.name);
    }
  };
  
  // Handle product selection for an item
  const handleProductChange = (productId: string, index: number) => {
    const product = products.find(prod => prod.id === productId);
    if (product) {
      const items = form.getValues("items");
      items[index] = {
        ...items[index],
        productId,
        productName: product.name
      };
      form.setValue("items", items);
    }
  };
  
  // Add a new item to the transfer
  const addItem = () => {
    const currentItems = form.getValues("items");
    form.setValue("items", [
      ...currentItems,
      { productId: "", productName: "", quantity: 1 }
    ]);
  };
  
  // Remove an item from the transfer
  const removeItem = (index: number) => {
    const currentItems = form.getValues("items");
    if (currentItems.length > 1) {
      form.setValue("items", currentItems.filter((_, i) => i !== index));
    }
  };
  
  // Form submission
  function onSubmit(data: TransferFormValues) {
    try {
      if (transfer) {
        // Update existing transfer
        updateTransfer(transfer.id, data);
        
        toast({
          title: "Transfer updated",
          description: `Transfer from ${data.sourceLocationName} to ${data.destinationLocationName} has been updated.`,
        });
      } else {
        // Add new transfer
        addTransfer(data);
        
        toast({
          title: "Transfer created",
          description: `New transfer from ${data.sourceLocationName} to ${data.destinationLocationName} has been created.`,
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving transfer:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the transfer.",
        variant: "destructive",
      });
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="sourceLocationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Source Location</FormLabel>
                <Select 
                  onValueChange={(value) => handleSourceLocationChange(value)} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="destinationLocationId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Destination Location</FormLabel>
                <Select 
                  onValueChange={(value) => handleDestinationLocationChange(value)} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select destination location" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location.id} value={location.id}>
                        {location.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-md font-medium">Transfer Items</h3>
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={addItem}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Item
            </Button>
          </div>
          
          {form.getValues("items").map((item, index) => (
            <div key={index} className="flex items-start space-x-2">
              <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name={`items.${index}.productId`}
                  render={({ field }) => (
                    <FormItem>
                      <Select 
                        onValueChange={(value) => handleProductChange(value, index)} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => {
                            const currentValue = field.value;
                            if (currentValue > 1) {
                              field.onChange(currentValue - 1);
                            }
                          }}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            className="text-center"
                            {...field}
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="h-10 w-10"
                          onClick={() => {
                            field.onChange(field.value + 1);
                          }}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 mt-2 text-destructive hover:text-destructive"
                  onClick={() => removeItem(index)}
                  disabled={form.getValues("items").length <= 1}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
          
          {/* Error for the entire items array */}
          {form.formState.errors.items?.root && (
            <p className="text-sm font-medium text-destructive">
              {form.formState.errors.items.root.message}
            </p>
          )}
        </div>
        
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
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Transit">In Transit</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notes</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Additional notes about this transfer"
                  className="resize-none h-20"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {transfer ? "Update" : "Create"} Transfer
          </Button>
        </div>
      </form>
    </Form>
  );
}
