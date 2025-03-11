
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/ui/button";
import { History, Download, Filter, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";

// Mock data for demonstration purposes
const mockAccessLogs = [
  { id: 1, timestamp: new Date(2023, 9, 10, 8, 23, 15), user: "Admin", action: "Login", status: "success", ipAddress: "192.168.1.1" },
  { id: 2, timestamp: new Date(2023, 9, 10, 9, 45, 32), user: "Admin", action: "Access Inventory", status: "success", ipAddress: "192.168.1.1" },
  { id: 3, timestamp: new Date(2023, 9, 10, 10, 12, 5), user: "Admin", action: "Export Report", status: "success", ipAddress: "192.168.1.1" },
  { id: 4, timestamp: new Date(2023, 9, 10, 11, 5, 42), user: "Unknown", action: "Login Attempt", status: "failed", ipAddress: "203.97.85.43" },
  { id: 5, timestamp: new Date(2023, 9, 10, 12, 30, 18), user: "Admin", action: "App Locked", status: "info", ipAddress: "192.168.1.1" },
  { id: 6, timestamp: new Date(2023, 9, 10, 12, 35, 22), user: "Admin", action: "App Unlocked", status: "success", ipAddress: "192.168.1.1" },
  { id: 7, timestamp: new Date(2023, 9, 10, 14, 15, 30), user: "Unknown", action: "Login Attempt", status: "failed", ipAddress: "45.123.76.89" },
  { id: 8, timestamp: new Date(2023, 9, 10, 15, 45, 10), user: "Admin", action: "Modified Security Settings", status: "warning", ipAddress: "192.168.1.1" },
  { id: 9, timestamp: new Date(2023, 9, 10, 16, 30, 5), user: "Admin", action: "Logout", status: "info", ipAddress: "192.168.1.1" },
];

const AccessLog = () => {
  const [logs, setLogs] = useState(mockAccessLogs);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredLogs = logs.filter(log => 
    log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
    log.ipAddress.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const clearLogs = () => {
    setLogs([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return <Badge variant="success">Success</Badge>;
      case "warning":
        return <Badge variant="warning">Warning</Badge>;
      case "failed":
        return <Badge variant="error">Failed</Badge>;
      case "info":
        return <Badge variant="info">Info</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(date);
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <History className="h-6 w-6" />
            <h1 className="text-3xl font-bold tracking-tight">Access Log</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={clearLogs}>
              <Trash2 className="h-4 w-4 mr-2" />
              Clear
            </Button>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Security Access Events</CardTitle>
            <CardDescription>
              View all security-related events and access attempts in the system
            </CardDescription>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by user, action, or IP address..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>IP Address</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-mono">{formatDateTime(log.timestamp)}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell className="font-mono">{log.ipAddress}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                      No access logs available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AccessLog;
