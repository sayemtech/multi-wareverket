import React, { useState, useEffect } from "react";
import { 
  AlertTriangle, 
  ArrowDown, 
  CheckCircle2, 
  Clock, 
  Package,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertItem, getAlerts, markAlertAsRead, clearAllAlerts, deleteAlert } from "@/lib/data/alertsData";

interface InventoryAlertsProps {
  className?: string;
  alerts?: AlertItem[];
  onMarkAsRead?: (id: string) => void;
  onClearAll?: () => void;
  onClearAlert?: (id: string) => void;
}

export function InventoryAlerts({ 
  className,
  alerts: externalAlerts,
  onMarkAsRead: externalMarkAsRead,
  onClearAll: externalClearAll,
  onClearAlert: externalClearAlert
}: InventoryAlertsProps) {
  const [localAlerts, setLocalAlerts] = useState<AlertItem[]>([]);
  
  useEffect(() => {
    // If external alerts are provided, use them
    // Otherwise, load alerts from localStorage
    if (externalAlerts) {
      setLocalAlerts(externalAlerts);
    } else {
      loadAlerts();
    }
  }, [externalAlerts]);
  
  const loadAlerts = () => {
    const alertsData = getAlerts();
    setLocalAlerts(alertsData);
  };
  
  const handleMarkAsRead = (id: string) => {
    if (externalMarkAsRead) {
      externalMarkAsRead(id);
    } else {
      markAlertAsRead(id);
      loadAlerts();
    }
  };
  
  const handleClearAlert = (id: string) => {
    if (externalClearAlert) {
      externalClearAlert(id);
    } else {
      deleteAlert(id);
      loadAlerts();
    }
  };
  
  const handleClearAll = () => {
    if (externalClearAll) {
      externalClearAll();
    } else {
      clearAllAlerts();
      loadAlerts();
    }
  };
  
  const alerts = localAlerts;
  const unreadCount = alerts.filter(alert => !alert.isRead).length;
  
  const getAlertIcon = (type: AlertItem["type"]) => {
    switch (type) {
      case "low_stock":
        return <AlertTriangle className="h-5 w-5 text-amber-500" />;
      case "reorder_needed":
        return <ArrowDown className="h-5 w-5 text-red-500" />;
      case "stock_received":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "expiring_soon":
        return <Clock className="h-5 w-5 text-purple-500" />;
      default:
        return <Package className="h-5 w-5 text-blue-500" />;
    }
  };
  
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="bg-muted/50 p-4 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-medium">Inventory Alerts</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="rounded-full">
              {unreadCount}
            </Badge>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleClearAll}
          disabled={alerts.length === 0}
        >
          Clear All
        </Button>
      </CardHeader>
      
      <CardContent className="p-0 max-h-[400px] overflow-y-auto">
        {alerts.length > 0 ? (
          <div className="divide-y">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={cn(
                  "p-3 flex items-start gap-3 hover:bg-muted/50 transition-colors",
                  !alert.isRead && "bg-blue-50 dark:bg-blue-950/20"
                )}
              >
                <div className="mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{alert.message}</p>
                  <div className="flex flex-wrap gap-1 text-xs text-muted-foreground">
                    <span>Item: {alert.item}</span>
                    <span>•</span>
                    <span>Location: {alert.location}</span>
                    {alert.quantity && (
                      <>
                        <span>•</span>
                        <span>Quantity: {alert.quantity}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{alert.timestamp}</p>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 shrink-0" 
                  onClick={() => handleClearAlert(alert.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            <Package className="mx-auto h-8 w-8 mb-2 opacity-50" />
            <p>No alerts at this time</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="p-2 bg-muted/30 flex justify-end">
        <Button variant="link" size="sm" className="h-8">
          View All Alerts
        </Button>
      </CardFooter>
    </Card>
  );
}
