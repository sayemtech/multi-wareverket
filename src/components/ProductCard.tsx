
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/Badge";
import { Package, AlertTriangle } from "lucide-react";

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
  className = "",
}: ProductCardProps) {
  const isOutOfStock = stock === 0;
  const isLowStock = stock > 0 && stock < 20;

  return (
    <Card className={`overflow-hidden ${className}`}>
      <Link to={`/products/${id}`} className="block">
        <div className={`aspect-[4/3] relative bg-muted ${className.includes('flex') ? 'w-1/3' : 'w-full'}`}>
          <img
            src={imageUrl}
            alt={name}
            className="absolute inset-0 w-full h-full object-cover"
          />
          {isOutOfStock && (
            <div className="absolute top-2 right-2">
              <Badge variant="error" className="px-2 py-1">
                Out of Stock
              </Badge>
            </div>
          )}
          {isLowStock && (
            <div className="absolute top-2 right-2">
              <Badge variant="warning" className="px-2 py-1">
                Low Stock
              </Badge>
            </div>
          )}
        </div>
      </Link>
      
      <CardContent className={`p-4 ${className.includes('flex') ? 'flex-1' : ''}`}>
        <Link to={`/products/${id}`} className="block">
          <h3 className="font-medium truncate">{name}</h3>
          <p className="text-sm text-muted-foreground mb-2">SKU: {sku}</p>
          <div className="flex justify-between items-center">
            <span className="font-bold">${price.toFixed(2)}</span>
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex items-center">
              {isOutOfStock ? (
                <AlertTriangle className="h-4 w-4 text-destructive mr-1" />
              ) : (
                <Package className="h-4 w-4 text-green-500 mr-1" />
              )}
              <span className={`text-sm ${isOutOfStock ? 'text-destructive' : 'text-green-500'}`}>
                {isOutOfStock ? 'Out of stock' : `${stock} in stock`}
              </span>
            </div>
          </div>
        </Link>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 gap-2">
        <Link to={`/products/${id}`} className="w-full">
          <Button variant="outline" size="sm" className="w-full">
            View Details
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
