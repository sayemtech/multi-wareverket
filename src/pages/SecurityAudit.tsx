
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Archive, Filter, Shield, Calendar, FileText, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Mock data for security audit events
const mockAuditEvents = [
  { 
    id: 1, 
    timestamp: new Date(2023, 9, 10, 8, 23, 15), 
    user: "Admin", 
    action: "Security Settings Modified", 
    details: "Auto-lock delay changed from 10 to 5 seconds",
    severity: "medium" 
  },
  { 
    id: 2, 
    timestamp: new Date(2023, 9, 9, 14, 45, 32), 
    user: "Admin", 
    action: "Unlock Code Changed", 
    details: "Secret unlock code was updated",
    severity: "high" 
  },
  { 
    id: 3, 
    timestamp: new Date(2023, 9, 8, 11, 12, 5), 
    user: "Admin", 
    action: "New Role Created", 
    details: "Created 'Inventory Manager' role with 5 permissions",
    severity: "medium" 
  },
  { 
    id: 4, 
    timestamp: new Date(2023, 9, 7, 16, 30, 22), 
    user: "Admin", 
    action: "User Role Changed", 
    details: "User 'john@example.com' changed from 'Viewer' to 'Administrator'",
    severity: "high" 
  },
  { 
    id: 5, 
    timestamp: new Date(2023, 9, 6, 9, 15, 48), 
    user: "Admin", 
    action: "Permission Modified", 
    details: "Added 'Export Reports' permission to 'Inventory Manager' role",
    severity: "medium" 
  },
  { 
    id: 6, 
    timestamp: new Date(2023, 9, 5, 13, 42, 10), 
    user: "Admin", 
    action: "Security Alert Dismissed", 
    details: "Multiple failed login attempts alert was dismissed",
    severity: "low" 
  },
  { 
    id: 7, 
    timestamp: new Date(2023, 9, 4, 10, 20, 35), 
    user: "Admin", 
    action: "Access Control Changed", 
    details: "IP address whitelist was updated",
    severity: "high" 
  },
];

const SecurityAudit = () => {
  const [events, setEvents] = useState(mockAuditEvents);
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");

  const filteredEvents = events.filter(event => {
    const matchesSearch = 
      event.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === "all" || event.severity === severityFilter;
    
    return matchesSearch && matchesSeverity;
  });

  const exportAudit = () => {
    // In a real app, this would generate a CSV or PDF file
    alert("Audit log exported successfully");
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return <Badge variant="error">High</Badge>;
      case "medium":
        return <Badge variant="warning">Medium</Badge>;
      case "low":
        return <Badge variant="success">Low</Badge>;
      default:
        return <Badge variant="info">{severity}</Badge>;
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6" />
            <h1 className="text-3xl font-bold tracking-tight">Security Audit</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportAudit}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </Button>
          </div>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-primary" />
                <CardTitle>Security Configuration Changes</CardTitle>
              </div>
              <CardDescription>
                Track security-related configuration changes and events in the system
              </CardDescription>
              <div className="flex flex-col sm:flex-row gap-4 pt-2">
                <div className="relative flex-1">
                  <Input
                    placeholder="Search audit events..."
                    className="w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <div className="w-40">
                    <Select value={severityFilter} onValueChange={setSeverityFilter}>
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <Filter className="h-4 w-4" />
                          <SelectValue placeholder="Filter" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Severities</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="w-40">
                    <Select defaultValue="30days">
                      <SelectTrigger>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <SelectValue placeholder="Period" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7days">Last 7 days</SelectItem>
                        <SelectItem value="30days">Last 30 days</SelectItem>
                        <SelectItem value="90days">Last 90 days</SelectItem>
                        <SelectItem value="all">All time</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead className="w-[80px]">Report</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell className="font-mono">{formatDateTime(event.timestamp)}</TableCell>
                        <TableCell>{event.user}</TableCell>
                        <TableCell>{event.action}</TableCell>
                        <TableCell>{event.details}</TableCell>
                        <TableCell>{getSeverityBadge(event.severity)}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                        No audit events found matching your criteria
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SecurityAudit;
