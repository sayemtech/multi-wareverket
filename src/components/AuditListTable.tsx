
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { ArrowRight, ClipboardCheck, EllipsisVertical, FileEdit, Trash2 } from "lucide-react";
import { getAudits } from "@/lib/data/auditsData";
import { useNavigate } from "react-router-dom";

interface AuditListTableProps {
  status: "scheduled" | "inProgress" | "completed" | "all";
}

export function AuditListTable({ status }: AuditListTableProps) {
  const navigate = useNavigate();
  const [audits, setAudits] = useState(getAudits().filter(audit => 
    status === "all" ? true : audit.status === status
  ));
  
  const handleStartAudit = (id: string) => {
    // Update audit status to in progress (would be handled by a real backend)
    const newAudits = audits.map(audit => {
      if (audit.id === id) {
        return { ...audit, status: "inProgress" };
      }
      return audit;
    });
    
    setAudits(newAudits);
    toast.success("Audit started successfully");
  };
  
  const handleCompleteAudit = (id: string) => {
    // Update audit status to completed (would be handled by a real backend)
    const newAudits = audits.map(audit => {
      if (audit.id === id) {
        return { ...audit, status: "completed", completedAt: new Date().toISOString() };
      }
      return audit;
    });
    
    setAudits(newAudits);
    toast.success("Audit marked as completed");
  };
  
  const handleDeleteAudit = (id: string) => {
    // Remove audit from list (would be handled by a real backend)
    const newAudits = audits.filter(audit => audit.id !== id);
    setAudits(newAudits);
    toast.success("Audit deleted successfully");
  };
  
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
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Audit ID</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Scheduled Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned To</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {audits.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No audits found.
              </TableCell>
            </TableRow>
          ) : (
            audits.map((audit) => (
              <TableRow key={audit.id}>
                <TableCell className="font-medium">{audit.id}</TableCell>
                <TableCell>{audit.location}</TableCell>
                <TableCell>{audit.type}</TableCell>
                <TableCell>{audit.scheduledDate}</TableCell>
                <TableCell>{getStatusBadge(audit.status)}</TableCell>
                <TableCell>{audit.assignedTo}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <EllipsisVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => navigate(`/audit/${audit.id}`)}>
                        <FileEdit className="mr-2 h-4 w-4" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      
                      {audit.status === "scheduled" && (
                        <DropdownMenuItem onClick={() => handleStartAudit(audit.id)}>
                          <ArrowRight className="mr-2 h-4 w-4" />
                          <span>Start Audit</span>
                        </DropdownMenuItem>
                      )}
                      
                      {audit.status === "inProgress" && (
                        <DropdownMenuItem onClick={() => handleCompleteAudit(audit.id)}>
                          <ClipboardCheck className="mr-2 h-4 w-4" />
                          <span>Mark Completed</span>
                        </DropdownMenuItem>
                      )}
                      
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAudit(audit.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
