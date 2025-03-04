
import { useState, useEffect } from "react";
import { 
  ArrowLeftRight, 
  MoreHorizontal, 
  Pencil, 
  Plus, 
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  TruckIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/SearchBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { TransferForm } from "./TransferForm";
import { 
  Transfer, 
  getTransfers, 
  deleteTransfer, 
  updateTransferStatus 
} from "@/lib/data/transfersData";

export function TransfersTable() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  
  useEffect(() => {
    loadTransfers();
  }, []);
  
  const loadTransfers = () => {
    const data = getTransfers();
    setTransfers(data);
  };
  
  const filteredTransfers = transfers.filter(transfer =>
    transfer.sourceLocationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transfer.destinationLocationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transfer.status.toLowerCase().includes(searchQuery.toLowerCase()) ||
    transfer.items.some(item => 
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  const handleDeleteTransfer = (id: string) => {
    try {
      const result = deleteTransfer(id);
      if (result) {
        toast.success("Transfer deleted successfully");
        loadTransfers();
      } else {
        toast.error("Failed to delete transfer");
      }
      setConfirmDelete(null);
    } catch (error) {
      console.error("Error deleting transfer:", error);
      toast.error("An error occurred while deleting the transfer");
    }
  };
  
  const handleStatusChange = (id: string, newStatus: Transfer["status"]) => {
    try {
      const result = updateTransferStatus(id, newStatus);
      if (result) {
        toast.success(`Transfer status updated to ${newStatus}`);
        loadTransfers();
      } else {
        toast.error("Failed to update transfer status");
      }
    } catch (error) {
      console.error("Error updating transfer status:", error);
      toast.error("An error occurred while updating the transfer status");
    }
  };
  
  const handleFormSuccess = () => {
    loadTransfers();
    setIsAddDialogOpen(false);
    setIsEditDialogOpen(false);
  };
  
  // Render status badge with appropriate color and icon
  const renderStatus = (status: Transfer["status"]) => {
    switch (status) {
      case "Completed":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200 px-2 py-1">
            <CheckCircle2 className="w-3 h-3 mr-1" /> {status}
          </Badge>
        );
      case "Pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200 px-2 py-1">
            <Clock className="w-3 h-3 mr-1" /> {status}
          </Badge>
        );
      case "In Transit":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 px-2 py-1">
            <TruckIcon className="w-3 h-3 mr-1" /> {status}
          </Badge>
        );
      case "Cancelled":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200 px-2 py-1">
            <XCircle className="w-3 h-3 mr-1" /> {status}
          </Badge>
        );
      default:
        return status;
    }
  };
  
  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
        <SearchBar
          placeholder="Search transfers..."
          className="w-full sm:w-80"
          onChange={setSearchQuery}
        />
        
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="default" size="sm" className="h-9">
              <Plus className="mr-2 h-4 w-4" />
              New Transfer
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Create New Transfer</DialogTitle>
            </DialogHeader>
            <TransferForm 
              onSuccess={handleFormSuccess}
              onCancel={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="rounded-lg border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Source → Destination</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead className="w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransfers.length > 0 ? (
              filteredTransfers.map((transfer) => (
                <TableRow key={transfer.id} className="group hover:bg-muted/50">
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <span>{transfer.sourceLocationName}</span>
                      <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                      <span>{transfer.destinationLocationName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {transfer.items.map((item, index) => (
                        <div key={index}>
                          {item.productName} ({item.quantity})
                          {index < transfer.items.length - 1 && ", "}
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>{renderStatus(transfer.status)}</TableCell>
                  <TableCell>{transfer.createdAt}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {transfer.status === "Pending" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(transfer.id, "In Transit")}
                        >
                          Start Transit
                        </Button>
                      )}
                      
                      {transfer.status === "In Transit" && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(transfer.id, "Completed")}
                        >
                          Complete
                        </Button>
                      )}
                      
                      <Dialog open={isEditDialogOpen && selectedTransfer?.id === transfer.id} onOpenChange={(open) => {
                        if (!open) setSelectedTransfer(null);
                        setIsEditDialogOpen(open);
                      }}>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => setSelectedTransfer(transfer)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[700px]">
                          <DialogHeader>
                            <DialogTitle>Edit Transfer</DialogTitle>
                          </DialogHeader>
                          {selectedTransfer && (
                            <TransferForm 
                              transfer={selectedTransfer}
                              onSuccess={handleFormSuccess}
                              onCancel={() => {
                                setIsEditDialogOpen(false);
                                setSelectedTransfer(null);
                              }}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <AlertDialog 
                        open={confirmDelete === transfer.id} 
                        onOpenChange={(open) => {
                          if (!open) setConfirmDelete(null);
                        }}
                      >
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => setConfirmDelete(transfer.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Transfer</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this transfer? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              onClick={() => handleDeleteTransfer(transfer.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No transfers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
