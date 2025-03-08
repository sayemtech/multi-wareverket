import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { addAudit, AuditType } from "@/lib/data/auditsData";
import { toast } from "sonner";
import { DialogClose } from "@/components/ui/dialog";
import { getLocations } from "@/lib/data/locationsData";

export function NewAuditForm() {
  const [auditData, setAuditData] = useState({
    location: "",
    type: "full" as AuditType,
    scheduledDate: "",
    assignedTo: "",
    productCategories: [] as string[],
    notes: ""
  });
  
  const locations = getLocations();
  const productCategories = ["Electronics", "Clothing", "Home", "Food", "Office"];
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!auditData.location || !auditData.scheduledDate || !auditData.assignedTo) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Generate a random ID (in a real app, this would be handled by the backend)
    const id = `AUD-${Math.floor(Math.random() * 10000)}-${new Date().getFullYear()}`;
    
    // Add the new audit
    addAudit({
      id,
      location: auditData.location,
      type: auditData.type,
      scheduledDate: auditData.scheduledDate,
      assignedTo: auditData.assignedTo,
      productCategories: auditData.productCategories,
      notes: auditData.notes,
    });
    
    toast.success("Audit scheduled successfully");
    
    // Reset form (in a real implementation, this would close the dialog)
    setAuditData({
      location: "",
      type: "full" as AuditType,
      scheduledDate: "",
      assignedTo: "",
      productCategories: [],
      notes: ""
    });
  };
  
  const handleCategoryToggle = (category: string) => {
    setAuditData(prev => {
      const currentCategories = [...prev.productCategories];
      if (currentCategories.includes(category)) {
        return {
          ...prev,
          productCategories: currentCategories.filter(c => c !== category)
        };
      } else {
        return {
          ...prev,
          productCategories: [...currentCategories, category]
        };
      }
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 py-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Select 
              value={auditData.location} 
              onValueChange={(value) => setAuditData({...auditData, location: value})}
            >
              <SelectTrigger id="location">
                <SelectValue placeholder="Select location" />
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
          
          <div className="space-y-2">
            <Label htmlFor="audit-type">Audit Type</Label>
            <Select 
              value={auditData.type}
              onValueChange={(value) => setAuditData({...auditData, type: value as AuditType})}
            >
              <SelectTrigger id="audit-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="full">Full Inventory</SelectItem>
                <SelectItem value="partial">Partial (Selected Categories)</SelectItem>
                <SelectItem value="spot">Spot Check</SelectItem>
                <SelectItem value="cycle">Cycle Count</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="scheduled-date">Scheduled Date</Label>
            <Input 
              id="scheduled-date" 
              type="date" 
              value={auditData.scheduledDate}
              onChange={(e) => setAuditData({...auditData, scheduledDate: e.target.value})}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="assigned-to">Assigned To</Label>
            <Input 
              id="assigned-to" 
              placeholder="Enter name or employee ID" 
              value={auditData.assignedTo}
              onChange={(e) => setAuditData({...auditData, assignedTo: e.target.value})}
            />
          </div>
        </div>
        
        {auditData.type === "partial" && (
          <div className="space-y-2">
            <Label>Product Categories</Label>
            <div className="grid grid-cols-2 gap-2">
              {productCategories.map(category => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`category-${category}`} 
                    checked={auditData.productCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <Label 
                    htmlFor={`category-${category}`}
                    className="text-sm font-normal"
                  >
                    {category}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Input 
            id="notes" 
            placeholder="Additional instructions or notes" 
            value={auditData.notes}
            onChange={(e) => setAuditData({...auditData, notes: e.target.value})}
          />
        </div>
      </div>
      
      <DialogClose asChild>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button">Cancel</Button>
          <Button type="submit">Schedule Audit</Button>
        </div>
      </DialogClose>
    </form>
  );
}
