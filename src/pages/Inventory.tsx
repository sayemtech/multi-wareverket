
import { useState } from "react";
import Layout from "@/components/Layout";
import { Separator } from "@/components/ui/separator";
import { InventoryTable } from "@/components/InventoryTable";

export default function Inventory() {
  return (
    <Layout>
      <div className="container p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory Management</h1>
            <p className="text-muted-foreground mt-1">
              View and manage your inventory across all locations
            </p>
          </div>
        </div>
        
        <Separator className="my-6" />
        
        <InventoryTable />
      </div>
    </Layout>
  );
}
