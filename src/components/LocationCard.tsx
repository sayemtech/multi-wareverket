import { MapPin, Package, Truck, Users, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface LocationCardProps {
  name: string;
  address: string;
  capacity: number;
  usage: number;
  products: number;
  staff: number;
  inbound: number;
}

export function LocationCard({
  name,
  address,
  capacity,
  usage,
  products,
  staff,
  inbound,
}: LocationCardProps) {
  // Calculate capacity percentage
  const usagePercent = Math.round((usage / capacity) * 100);
  
  // Determine color based on usage
  const getProgressColor = () => {
    if (usagePercent < 60) return "bg-green-500";
    if (usagePercent < 80) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card className="animate-scale-in overflow-hidden transition-all duration-300 hover:shadow-soft">
      <CardHeader className="pb-2 flex justify-between items-start">
        <div className="space-y-1">
          <h3 className="text-md font-medium leading-none">{name}</h3>
          <p className="text-sm text-muted-foreground flex items-center">
            <MapPin className="h-3 w-3 mr-1" /> {address}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
            <DropdownMenuItem>Edit Location</DropdownMenuItem>
            <DropdownMenuItem>View Inventory</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              Remove Location
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between items-center text-sm mb-1">
              <span>Storage capacity</span>
              <span className="font-medium">{usagePercent}%</span>
            </div>
            <Progress 
              value={usagePercent} 
              className={`h-2 ${getProgressColor()}`}
            />
            <p className="text-xs text-muted-foreground mt-1">
              {usage.toLocaleString()} of {capacity.toLocaleString()} units used
            </p>
          </div>
          
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="flex flex-col items-center p-2 bg-secondary rounded-md">
              <Package className="h-4 w-4 mb-1 text-muted-foreground" />
              <span className="text-sm font-medium">{products}</span>
              <span className="text-xs text-muted-foreground">Products</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-secondary rounded-md">
              <Users className="h-4 w-4 mb-1 text-muted-foreground" />
              <span className="text-sm font-medium">{staff}</span>
              <span className="text-xs text-muted-foreground">Staff</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-secondary rounded-md">
              <Truck className="h-4 w-4 mb-1 text-muted-foreground" />
              <span className="text-sm font-medium">{inbound}</span>
              <span className="text-xs text-muted-foreground">Inbound</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button className="w-full" variant="outline">
          View Inventory
        </Button>
      </CardFooter>
    </Card>
  );
}
