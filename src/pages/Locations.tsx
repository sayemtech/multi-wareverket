
import Layout from "@/components/Layout";
import { LocationCard } from "@/components/LocationCard";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, MapPin, Building, Factory, Store } from "lucide-react";

// Sample location data
const locationData = [
  {
    id: "1",
    name: "Warehouse A",
    address: "123 Main St, New York, NY 10001",
    type: "warehouse",
    capacity: 10000,
    usage: 6400,
    products: 245,
    staff: 12,
    inbound: 5
  },
  {
    id: "2",
    name: "Warehouse B",
    address: "456 Park Ave, Boston, MA 02108",
    type: "warehouse",
    capacity: 15000,
    usage: 13500,
    products: 312,
    staff: 18,
    inbound: 8
  },
  {
    id: "3",
    name: "Manufacturing Plant",
    address: "789 Industrial Blvd, Detroit, MI 48127",
    type: "factory",
    capacity: 20000,
    usage: 11000,
    products: 178,
    staff: 45,
    inbound: 12
  },
  {
    id: "4",
    name: "Retail Store #1",
    address: "321 Market St, San Francisco, CA 94105",
    type: "store",
    capacity: 2500,
    usage: 1800,
    products: 520,
    staff: 9,
    inbound: 3
  },
  {
    id: "5",
    name: "Retail Store #2",
    address: "654 Ocean Ave, Los Angeles, CA 90210",
    type: "store",
    capacity: 3000,
    usage: 1900,
    products: 480,
    staff: 10,
    inbound: 4
  },
  {
    id: "6",
    name: "Distribution Center",
    address: "987 Logistics Way, Chicago, IL 60607",
    type: "warehouse",
    capacity: 25000,
    usage: 12500,
    products: 650,
    staff: 24,
    inbound: 15
  }
];

const Locations = () => {
  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight">Locations</h1>
            <p className="text-sm text-muted-foreground">
              Manage inventory across your facilities and locations
            </p>
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Location
            </Button>
          </div>
        </div>
        
        {/* Locations content */}
        <div className="space-y-6 animate-fade-in">
          <SearchBar 
            placeholder="Search locations..." 
            className="w-full sm:w-80"
          />
          
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="w-full sm:w-auto">
              <TabsTrigger value="all">All Locations</TabsTrigger>
              <TabsTrigger value="warehouse">Warehouses</TabsTrigger>
              <TabsTrigger value="factory">Factories</TabsTrigger>
              <TabsTrigger value="store">Retail Stores</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locationData.map((location) => (
                  <LocationCard
                    key={location.id}
                    name={location.name}
                    address={location.address}
                    capacity={location.capacity}
                    usage={location.usage}
                    products={location.products}
                    staff={location.staff}
                    inbound={location.inbound}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="warehouse" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locationData
                  .filter(location => location.type === "warehouse")
                  .map((location) => (
                    <LocationCard
                      key={location.id}
                      name={location.name}
                      address={location.address}
                      capacity={location.capacity}
                      usage={location.usage}
                      products={location.products}
                      staff={location.staff}
                      inbound={location.inbound}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="factory" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locationData
                  .filter(location => location.type === "factory")
                  .map((location) => (
                    <LocationCard
                      key={location.id}
                      name={location.name}
                      address={location.address}
                      capacity={location.capacity}
                      usage={location.usage}
                      products={location.products}
                      staff={location.staff}
                      inbound={location.inbound}
                    />
                  ))}
              </div>
            </TabsContent>
            
            <TabsContent value="store" className="mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {locationData
                  .filter(location => location.type === "store")
                  .map((location) => (
                    <LocationCard
                      key={location.id}
                      name={location.name}
                      address={location.address}
                      capacity={location.capacity}
                      usage={location.usage}
                      products={location.products}
                      staff={location.staff}
                      inbound={location.inbound}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Map Preview */}
        <div className="rounded-lg border shadow-soft overflow-hidden animate-scale-in">
          <div className="p-4 bg-card border-b">
            <h3 className="font-medium">Location Map</h3>
          </div>
          <div className="aspect-[16/9] bg-secondary flex items-center justify-center p-6">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-30" />
              <p className="text-muted-foreground">Interactive map will be displayed here</p>
              <Button variant="outline" size="sm" className="mt-4">
                Enable Map View
              </Button>
            </div>
          </div>
        </div>
        
        {/* Location Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
          <div className="bg-card rounded-lg border shadow-soft p-6 flex items-center">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
              <Building className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium">{locationData.filter(l => l.type === "warehouse").length}</h3>
              <p className="text-sm text-muted-foreground">Warehouses</p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-soft p-6 flex items-center">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
              <Factory className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium">{locationData.filter(l => l.type === "factory").length}</h3>
              <p className="text-sm text-muted-foreground">Factories</p>
            </div>
          </div>
          
          <div className="bg-card rounded-lg border shadow-soft p-6 flex items-center">
            <div className="h-12 w-12 flex items-center justify-center rounded-full bg-primary/10">
              <Store className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium">{locationData.filter(l => l.type === "store").length}</h3>
              <p className="text-sm text-muted-foreground">Retail Stores</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Locations;
