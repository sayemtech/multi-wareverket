
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

interface DataCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  description?: string;
  trend?: number;
  trendLabel?: string;
  className?: string;
  footer?: ReactNode;
}

export function DataCard({
  title,
  value,
  icon,
  description,
  trend,
  trendLabel,
  className,
  footer,
}: DataCardProps) {
  // Determine trend color and icon
  const isTrendPositive = trend && trend > 0;
  const isTrendNegative = trend && trend < 0;
  const trendColor = isTrendPositive 
    ? "text-green-500" 
    : isTrendNegative 
      ? "text-red-500" 
      : "text-muted-foreground";

  return (
    <Card className={cn("overflow-hidden transition-all duration-300 hover:shadow-soft", className)}>
      <CardHeader className="pb-2 flex justify-between items-start">
        <div>
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        </div>
        {icon && (
          <div className="text-muted-foreground">
            {icon}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="flex items-baseline space-x-1">
          <div className="text-2xl font-semibold tracking-tight">{value}</div>
          
          {trend !== undefined && (
            <div className={cn("flex items-center text-sm font-medium", trendColor)}>
              {trend > 0 ? "↑" : trend < 0 ? "↓" : "→"}
              <span className="ml-1">{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
        
        {description && (
          <p className="text-xs mt-1 text-muted-foreground">{description}</p>
        )}
        
        {trendLabel && (
          <p className="text-xs mt-1 text-muted-foreground">{trendLabel}</p>
        )}
      </CardContent>
      
      {footer && (
        <CardFooter className="pt-0 border-t text-xs text-muted-foreground">
          {footer}
        </CardFooter>
      )}
    </Card>
  );
}
