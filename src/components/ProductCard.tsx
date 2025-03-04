
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EyeIcon, Edit, Trash2, CheckCircle } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  sku: string;
  imageUrl: string;
  category: string;
  price: number;
  stock: number;
  className?: string;
}

export function ProductCard({
  id,
  name,
  sku,
  imageUrl,
  category,
  price,
  stock,
  className,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  const stockStatus = stock > 20
    ? { label: "In Stock", color: "bg-green-100 text-green-800 hover:bg-green-200" }
    : stock > 0
      ? { label: "Low Stock", color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200" }
      : { label: "Out of Stock", color: "bg-red-100 text-red-800 hover:bg-red-200" };

  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all duration-300 group hover:shadow-soft",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative pt-[75%] overflow-hidden bg-secondary">
        <img
          src={imageUrl || 'https://placehold.co/300x200/e2e8f0/a0aec0?text=Product+Image'}
          alt={name}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-transform duration-300", 
            isHovered ? "scale-105" : "scale-100"
          )}
        />
        <div className={cn(
          "absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300",
          isHovered ? "opacity-100" : "opacity-0"
        )}>
          <Button size="sm" variant="secondary" className="h-8 px-2">
            <EyeIcon className="h-3.5 w-3.5 mr-1" />
            View
          </Button>
          <Button size="sm" variant="secondary" className="h-8 px-2">
            <Edit className="h-3.5 w-3.5 mr-1" />
            Edit
          </Button>
        </div>
        <Badge className="absolute top-2 left-2">{category}</Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="space-y-1">
          <h3 className="font-medium text-sm truncate">{name}</h3>
          <p className="text-xs text-muted-foreground">SKU: {sku}</p>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <p className="font-semibold">${price.toFixed(2)}</p>
          <Badge className={stockStatus.color}>
            {stock > 0 && <CheckCircle className="mr-1 h-3 w-3" />}
            {stockStatus.label}
          </Badge>
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <p className="text-xs text-muted-foreground">{stock} units available</p>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive opacity-0 group-hover:opacity-100">
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
