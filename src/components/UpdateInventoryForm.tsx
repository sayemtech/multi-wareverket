
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { InventoryItem, updateInventoryItem, addInventoryItem } from "@/lib/data/inventoryData";
import { getLocations } from "@/lib/data/locationsData";

const inventoryFormSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  quantity: z.coerce.number().min(0, "Quantity must be 0 or greater"),
});

type InventoryFormValues = z.infer<typeof inventoryFormSchema>;

interface UpdateInventoryFormProps {
  item?: InventoryItem;
  onSuccess: () => void;
  onCancel: () => void;
}

export function UpdateInventoryForm({ item, onSuccess, onCancel }: UpdateInventoryFormProps) {
  const { toast } = useToast();
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  
  const form = useForm<InventoryFormValues>({
    resolver: zodResolver(inventoryFormSchema),
    defaultValues: {
      sku: item?.sku || "",
      name: item?.name || "",
      location: item?.location || "",
      quantity: item?.quantity || 0,
    },
  });
  
  useEffect(() => {
    // Load locations for the dropdown
    const locationData = getLocations();
    setLocations(locationData.map(loc => ({ id: loc.id, name: loc.name })));
  }, []);
  
  function onSubmit(data: InventoryFormValues) {
    try {
      if (item) {
        // Update existing item
        updateInventoryItem(item.id, {
          sku: data.sku,
          name: data.name,
          location: data.location,
          quantity: data.quantity,
        });
        
        toast({
          title: "Inventory updated",
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        // Add new item
        addInventoryItem({
          sku: data.sku,
          name: data.name,
          location: data.location,
          quantity: data.quantity,
          status: data.quantity === 0 ? "Out of Stock" : data.quantity < 30 ? "Low Stock" : "In Stock",
        });
        
        toast({
          title: "Inventory item added",
          description: `${data.name} has been added to inventory.`,
        });
      }
      
      onSuccess();
    } catch (error) {
      console.error("Error saving inventory item:", error);
      toast({
        title: "Error",
        description: "There was a problem saving the inventory item.",
        variant: "destructive",
      });
    }
  }
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <FormLabel>SKU</FormLabel>
              <FormControl>
                <Input placeholder="Enter SKU" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Product Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter product name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location.id} value={location.name}>
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
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Quantity</FormLabel>
              <FormControl>
                <Input type="number" min={0} {...field} />
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
            {item ? "Update" : "Add"} Item
          </Button>
        </div>
      </form>
    </Form>
  );
}
