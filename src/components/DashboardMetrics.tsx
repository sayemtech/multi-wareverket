
import { BarChart2, ShoppingCart, Truck, AlertTriangle, ArrowUpRight } from "lucide-react";
import { DataCard } from "@/components/ui/DataCard";

export function DashboardMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <DataCard
        title="Total Inventory"
        value="2,478"
        description="Items in stock across all locations"
        trend={3.2}
        trendLabel="vs. last month"
        icon={<BarChart2 className="h-4 w-4" />}
        className="animate-slide-up delay-0"
      />
      <DataCard
        title="Low Stock Items"
        value="42"
        description="Items below reorder threshold"
        trend={-5.1}
        trendLabel="vs. last month"
        icon={<AlertTriangle className="h-4 w-4" />}
        className="animate-slide-up delay-100"
      />
      <DataCard
        title="Incoming Orders"
        value="14"
        description="Purchase orders in transit"
        trend={8.7}
        trendLabel="vs. last month"
        icon={<Truck className="h-4 w-4" />}
        className="animate-slide-up delay-200"
      />
      <DataCard
        title="Pending Shipments"
        value="36"
        description="Orders ready to ship"
        trend={2.3}
        trendLabel="vs. last month"
        icon={<ShoppingCart className="h-4 w-4" />}
        className="animate-slide-up delay-300"
      />
    </div>
  );
}
