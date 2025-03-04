
import { useEffect, useState } from "react";
import { BarChart2, ShoppingCart, Truck, AlertTriangle, ArrowUpRight } from "lucide-react";
import { DataCard } from "@/components/ui/DataCard";
import { getInventoryItems } from "@/lib/data/inventoryData";
import { getTransfers } from "@/lib/data/transfersData";

export function DashboardMetrics() {
  const [metrics, setMetrics] = useState({
    totalInventory: 0,
    lowStockItems: 0,
    incomingOrders: 0,
    pendingShipments: 0
  });
  
  const [trends, setTrends] = useState({
    inventoryTrend: 3.2,
    lowStockTrend: -5.1,
    incomingTrend: 8.7,
    pendingTrend: 2.3
  });
  
  useEffect(() => {
    // Calculate metrics from actual data
    const inventoryItems = getInventoryItems();
    const transfers = getTransfers();
    
    const totalItems = inventoryItems.reduce((sum, item) => sum + item.quantity, 0);
    const lowStock = inventoryItems.filter(item => item.status === "Low Stock").length;
    const incomingOrders = transfers.filter(t => t.status === "In Transit").length;
    const pendingShipments = transfers.filter(t => t.status === "Pending").length;
    
    setMetrics({
      totalInventory: totalItems,
      lowStockItems: lowStock,
      incomingOrders: incomingOrders,
      pendingShipments: pendingShipments
    });
    
    // Note: in a real application, we would calculate trends by comparing with historical data
    // For now, we're using hardcoded values
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DataCard
        title="Total Inventory"
        value={metrics.totalInventory.toString()}
        description="Items in stock across all locations"
        trend={trends.inventoryTrend}
        trendLabel="vs. last month"
        icon={<BarChart2 className="h-4 w-4" />}
        className="animate-slide-up delay-0"
      />
      <DataCard
        title="Low Stock Items"
        value={metrics.lowStockItems.toString()}
        description="Items below reorder threshold"
        trend={trends.lowStockTrend}
        trendLabel="vs. last month"
        icon={<AlertTriangle className="h-4 w-4" />}
        className="animate-slide-up delay-100"
      />
      <DataCard
        title="Incoming Orders"
        value={metrics.incomingOrders.toString()}
        description="Purchase orders in transit"
        trend={trends.incomingTrend}
        trendLabel="vs. last month"
        icon={<Truck className="h-4 w-4" />}
        className="animate-slide-up delay-200"
      />
      <DataCard
        title="Pending Shipments"
        value={metrics.pendingShipments.toString()}
        description="Orders ready to ship"
        trend={trends.pendingTrend}
        trendLabel="vs. last month"
        icon={<ShoppingCart className="h-4 w-4" />}
        className="animate-slide-up delay-300"
      />
    </div>
  );
}
