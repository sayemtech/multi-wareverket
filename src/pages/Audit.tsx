
import { useState } from "react";
import Layout from "@/components/Layout";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ClipboardCheck, FileDown, FilePlus, Filter, Printer, Search } from "lucide-react";
import { AuditListTable } from "@/components/AuditListTable";
import { NewAuditForm } from "@/components/NewAuditForm";

export default function Audit() {
  const [selectedTab, setSelectedTab] = useState("scheduled");
  
  return (
    <Layout>
      <div className="container p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Inventory Audits</h1>
            <p className="text-muted-foreground mt-1">
              Schedule, perform, and review inventory audits
            </p>
          </div>
          
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <FilePlus className="h-4 w-4 mr-2" />
                  New Audit
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Create New Audit</DialogTitle>
                  <DialogDescription>
                    Schedule a new inventory audit for your locations
                  </DialogDescription>
                </DialogHeader>
                <NewAuditForm />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search audits..." 
              className="pl-8 w-full"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="scheduled" className="w-full" onValueChange={setSelectedTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="inProgress">In Progress</TabsTrigger>
            <TabsTrigger value="completed">Completed</TabsTrigger>
            <TabsTrigger value="all">All Audits</TabsTrigger>
          </TabsList>
          
          <TabsContent value="scheduled" className="mt-0">
            <AuditListTable status="scheduled" />
          </TabsContent>
          
          <TabsContent value="inProgress" className="mt-0">
            <AuditListTable status="inProgress" />
          </TabsContent>
          
          <TabsContent value="completed" className="mt-0">
            <AuditListTable status="completed" />
          </TabsContent>
          
          <TabsContent value="all" className="mt-0">
            <AuditListTable status="all" />
          </TabsContent>
        </Tabs>
        
        {selectedTab === "completed" && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Audit Metrics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">94.3%</div>
                  <p className="text-xs text-muted-foreground">+2.3% from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Discrepancies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">27</div>
                  <p className="text-xs text-muted-foreground">-12 from last month</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Time to Complete</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2 hrs</div>
                  <p className="text-xs text-muted-foreground">Avg. per location</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
