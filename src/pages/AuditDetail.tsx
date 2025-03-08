
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getAuditById, updateAudit } from "@/lib/data/auditsData";
import { ArrowLeft, CheckCircle, ClipboardCheck, FileDown, Printer } from "lucide-react";

export default function AuditDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [audit, setAudit] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [discrepancyCount, setDiscrepancyCount] = useState(0);
  const [scannedItems, setScannedItems] = useState(0);
  const [totalItems, setTotalItems] = useState(100); // Placeholder value
  
  useEffect(() => {
    if (id) {
      const auditData = getAuditById(id);
      if (auditData) {
        setAudit(auditData);
        if (auditData.discrepancies) {
          setDiscrepancyCount(auditData.discrepancies.length);
        }
        // In a real app, we'd fetch the actual count from inventory data
        setScannedItems(auditData.status === "completed" ? 100 : auditData.status === "inProgress" ? 45 : 0);
      }
      setLoading(false);
    }
  }, [id]);
  
  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <h3 className="mt-4 text-lg font-medium">Loading audit details...</h3>
          </div>
        </div>
      </Layout>
    );
  }
  
  if (!audit) {
    return (
      <Layout>
        <div className="container p-4 sm:p-6 max-w-7xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold">Audit Not Found</h2>
            <p className="text-muted-foreground mt-2">The audit you're looking for doesn't exist or has been removed.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate("/audit")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Audits
            </Button>
          </div>
        </div>
      </Layout>
    );
  }
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case "scheduled":
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Scheduled</Badge>;
      case "inProgress":
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };
  
  const handleStartAudit = () => {
    const updatedAudit = updateAudit(audit.id, { 
      status: "inProgress", 
      startedAt: new Date().toISOString() 
    });
    setAudit(updatedAudit);
    toast.success("Audit started successfully");
  };
  
  const handleCompleteAudit = () => {
    const updatedAudit = updateAudit(audit.id, { 
      status: "completed", 
      completedAt: new Date().toISOString(),
      // In a real app, we'd have the actual discrepancies here
      discrepancies: audit.discrepancies || []
    });
    setAudit(updatedAudit);
    setScannedItems(totalItems);
    toast.success("Audit completed successfully");
  };
  
  return (
    <Layout>
      <div className="container p-4 sm:p-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <Button 
            variant="ghost" 
            className="mb-4 sm:mb-0 self-start"
            onClick={() => navigate("/audit")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Audits
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <FileDown className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Printer className="h-4 w-4 mr-2" />
              Print
            </Button>
            
            {audit.status === "scheduled" && (
              <Button onClick={handleStartAudit}>
                <ClipboardCheck className="h-4 w-4 mr-2" />
                Start Audit
              </Button>
            )}
            
            {audit.status === "inProgress" && (
              <Button onClick={handleCompleteAudit}>
                <CheckCircle className="h-4 w-4 mr-2" />
                Complete Audit
              </Button>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>Audit #{audit.id}</CardTitle>
                    <CardDescription className="mt-1">{audit.type.charAt(0).toUpperCase() + audit.type.slice(1)} Audit</CardDescription>
                  </div>
                  {getStatusBadge(audit.status)}
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Location</h3>
                    <p className="text-base">{audit.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Scheduled Date</h3>
                    <p className="text-base">{audit.scheduledDate}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Assigned To</h3>
                    <p className="text-base">{audit.assignedTo}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground">Created</h3>
                    <p className="text-base">{new Date(audit.createdAt).toLocaleDateString()}</p>
                  </div>
                  {audit.startedAt && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Started</h3>
                      <p className="text-base">{new Date(audit.startedAt).toLocaleDateString()} at {new Date(audit.startedAt).toLocaleTimeString()}</p>
                    </div>
                  )}
                  {audit.completedAt && (
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground">Completed</h3>
                      <p className="text-base">{new Date(audit.completedAt).toLocaleDateString()} at {new Date(audit.completedAt).toLocaleTimeString()}</p>
                    </div>
                  )}
                </div>
                
                {audit.notes && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Notes</h3>
                    <p className="text-base">{audit.notes}</p>
                  </div>
                )}
                
                {audit.productCategories && audit.productCategories.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-muted-foreground">Product Categories</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {audit.productCategories.map((category: string) => (
                        <Badge key={category} variant="secondary">{category}</Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Audit Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Items Scanned</span>
                      <span>{scannedItems} / {totalItems}</span>
                    </div>
                    <Progress value={(scannedItems / totalItems) * 100} className="h-2" />
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Discrepancies Found</h3>
                      <Badge variant={discrepancyCount > 0 ? "destructive" : "outline"} className="ml-2">
                        {discrepancyCount}
                      </Badge>
                    </div>
                  </div>
                  
                  {audit.status === "inProgress" && (
                    <div className="pt-4">
                      <h3 className="text-sm font-medium mb-2">Scan Item</h3>
                      <div className="flex space-x-2">
                        <Input placeholder="Scan barcode or enter SKU" />
                        <Button variant="secondary">Scan</Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Tabs defaultValue="items" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="items">Items</TabsTrigger>
            <TabsTrigger value="discrepancies">Discrepancies {discrepancyCount > 0 && `(${discrepancyCount})`}</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="items" className="mt-0">
            <Card>
              <CardContent className="p-6">
                {audit.status === "scheduled" ? (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">Audit Not Started</h3>
                    <p className="text-muted-foreground">Items will appear here once the audit begins.</p>
                    <Button className="mt-4" onClick={handleStartAudit}>Start Audit Now</Button>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Expected Qty</TableHead>
                        <TableHead>Actual Qty</TableHead>
                        <TableHead>Difference</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {audit.status === "completed" ? (
                        audit.discrepancies && audit.discrepancies.length > 0 ? (
                          audit.discrepancies.map((item: any) => (
                            <TableRow key={item.productId}>
                              <TableCell>{item.productId}</TableCell>
                              <TableCell>{item.productName}</TableCell>
                              <TableCell>{item.expectedQty}</TableCell>
                              <TableCell>{item.actualQty}</TableCell>
                              <TableCell className={item.difference < 0 ? "text-destructive" : item.difference > 0 ? "text-green-600" : ""}>
                                {item.difference > 0 ? `+${item.difference}` : item.difference}
                              </TableCell>
                              <TableCell>
                                <Badge variant={item.difference !== 0 ? "destructive" : "outline"} className="bg-green-50 text-green-600 border-green-200">
                                  {item.difference !== 0 ? "Discrepancy" : "Matched"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="h-24 text-center">
                              No discrepancies found. All items matched expected quantities.
                            </TableCell>
                          </TableRow>
                        )
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            Audit in progress. Items will be updated as they are scanned.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="discrepancies" className="mt-0">
            <Card>
              <CardContent className="p-6">
                {audit.status !== "completed" ? (
                  <div className="text-center py-8">
                    <h3 className="text-lg font-medium mb-2">Audit Not Completed</h3>
                    <p className="text-muted-foreground">Discrepancies will be listed here after the audit is completed.</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>SKU</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Expected Qty</TableHead>
                        <TableHead>Actual Qty</TableHead>
                        <TableHead>Difference</TableHead>
                        <TableHead>Action Required</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {audit.discrepancies && audit.discrepancies.length > 0 ? (
                        audit.discrepancies.map((item: any) => (
                          <TableRow key={item.productId}>
                            <TableCell>{item.productId}</TableCell>
                            <TableCell>{item.productName}</TableCell>
                            <TableCell>{item.expectedQty}</TableCell>
                            <TableCell>{item.actualQty}</TableCell>
                            <TableCell className={item.difference < 0 ? "text-destructive" : item.difference > 0 ? "text-green-600" : ""}>
                              {item.difference > 0 ? `+${item.difference}` : item.difference}
                            </TableCell>
                            <TableCell>
                              <Button variant="link" className="h-8 p-0">
                                {item.difference < 0 ? "Investigate Loss" : "Adjust Inventory"}
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center">
                            No discrepancies found. All items matched expected quantities.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="history" className="mt-0">
            <Card>
              <CardContent className="p-6">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>{new Date(audit.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>{new Date(audit.createdAt).toLocaleTimeString()}</TableCell>
                      <TableCell>Audit Created</TableCell>
                      <TableCell>System</TableCell>
                    </TableRow>
                    {audit.startedAt && (
                      <TableRow>
                        <TableCell>{new Date(audit.startedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(audit.startedAt).toLocaleTimeString()}</TableCell>
                        <TableCell>Audit Started</TableCell>
                        <TableCell>{audit.assignedTo}</TableCell>
                      </TableRow>
                    )}
                    {audit.completedAt && (
                      <TableRow>
                        <TableCell>{new Date(audit.completedAt).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(audit.completedAt).toLocaleTimeString()}</TableCell>
                        <TableCell>Audit Completed</TableCell>
                        <TableCell>{audit.assignedTo}</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
