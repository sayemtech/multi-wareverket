
import { useState, useEffect } from "react";
import { 
  MapPin, 
  MoreHorizontal, 
  Pencil, 
  Plus, 
  Trash2 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";
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
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Location,
  getLocations,
  deleteLocation,
  addLocation,
  updateLocation
} from "@/lib/data/locationsData";
import { LocationForm } from "./LocationForm";
import { toast } from "sonner";

export function LocationsTable() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  useEffect(() => {
    loadLocations();
  }, []);
  
  const loadLocations = () => {
    const locationsData = getLocations();
    setLocations(locationsData);
  };
  
  const filteredLocations = locations.filter(location =>
    location.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    location.type.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleDeleteLocation = (id: string) => {
    try {
      const result = deleteLocation(id);
      if (result) {
        toast.success("Location deleted successfully");
        loadLocations();
      } else {
        toast.error("Failed to delete location");
      }
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error("An error occurred while deleting the location");
    }
  };
  
  const handleFormSuccess = () => {
    loadLocations();
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <SearchBar
          placeholder="Search locations..."
          className="w-full sm:w-80"
          onChange={setSearchQuery}
        />
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
            </DialogHeader>
            <LocationForm 
              onSuccess={handleFormSuccess}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Address</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLocations.length > 0 ? (
              filteredLocations.map((location) => (
                <TableRow key={location.id} className="group hover:bg-muted/50">
                  <TableCell className="font-medium">{location.name}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-muted/50">
                      {location.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {location.address}, {location.city}, {location.state} {location.zipCode}
                  </TableCell>
                  <TableCell>
                    {location.contactName && (
                      <div className="text-sm">
                        <p>{location.contactName}</p>
                        <p className="text-muted-foreground text-xs">{location.contactEmail}</p>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>{location.capacity ? `${location.capacity} units` : "N/A"}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end">
                      <Dialog open={isEditDialogOpen && selectedLocation?.id === location.id} onOpenChange={(open) => {
                        if (!open) setSelectedLocation(null);
                        setIsEditDialogOpen(open);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setSelectedLocation(location)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                          <DialogHeader>
                            <DialogTitle>Edit Location</DialogTitle>
                          </DialogHeader>
                          {selectedLocation && (
                            <LocationForm 
                              location={selectedLocation}
                              onSuccess={handleFormSuccess}
                              onCancel={() => {
                                setIsEditDialogOpen(false);
                                setSelectedLocation(null);
                              }}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <AlertDialog 
                        open={confirmDelete === location.id} 
                        onOpenChange={(open) => {
                          if (!open) setConfirmDelete(null);
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setConfirmDelete(location.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Location</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete {location.name}? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDeleteLocation(location.id)}
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
                <TableCell colSpan={6} className="h-24 text-center">
                  No locations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
