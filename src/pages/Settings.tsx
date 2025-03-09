
import React from "react";
import Layout from "@/components/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CardTitle, CardDescription, CardHeader, CardContent, CardFooter, Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { downloadBackup, restoreFromBackup } from "@/lib/backupRestore";
import { useRef, useState } from "react";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, Dialog } from "@/components/ui/dialog";
import { AlertCircle } from "lucide-react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { MeetingsTabContent } from "@/components/MeetingsTabContent";

export default function Settings() {
  // Backup & Restore state
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Backup functions
  const handleDownloadBackup = () => {
    if (downloadBackup()) {
      toast.success("Backup file downloaded successfully");
    } else {
      toast.error("Failed to create backup");
    }
  };
  
  const handleRestoreClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsRestoreDialogOpen(true);
    }
  };
  
  const handleRestoreConfirm = async () => {
    const file = fileInputRef.current?.files?.[0];
    if (!file) return;
    
    setIsRestoring(true);
    
    try {
      const success = await restoreFromBackup(file);
      if (success) {
        toast.success("System restored successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast.error("Failed to restore from backup");
      }
    } catch (error) {
      toast.error("An error occurred during restore");
      console.error(error);
    } finally {
      setIsRestoring(false);
      setIsRestoreDialogOpen(false);
    }
  };
    
  return (
    <Layout>
      <div className="container py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">Manage your system preferences and configurations</p>
        </div>
        
        <Tabs defaultValue="general">
          <TabsList className="mb-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
            <TabsTrigger value="meetings">Meetings</TabsTrigger>
            <TabsTrigger value="chat">Live & Voice Chat</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Update your account information and personal details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First name</Label>
                      <Input id="first-name" placeholder="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last name</Label>
                      <Input id="last-name" placeholder="Doe" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="johndoe@example.com" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save changes</Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>System Preferences</CardTitle>
                  <CardDescription>
                    Customize your inventory management system experience
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="low-stock-alerts">Low stock alerts</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications when inventory items are running low
                      </p>
                    </div>
                    <Switch id="low-stock-alerts" defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="auto-reorder">Automatic reorder</Label>
                      <p className="text-sm text-muted-foreground">
                        Automatically create purchase orders for low stock items
                      </p>
                    </div>
                    <Switch id="auto-reorder" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Default currency</Label>
                    <div className="grid grid-cols-3 gap-4">
                      <select 
                        id="currency"
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <option>USD ($)</option>
                        <option>EUR (€)</option>
                        <option>GBP (£)</option>
                        <option>JPY (¥)</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button>Save preferences</Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Control how and when you receive alerts and updates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Receive system alerts via email
                    </p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Inventory Alerts</p>
                    <p className="text-sm text-muted-foreground">
                      Get notified about inventory changes and low stock
                    </p>
                  </div>
                  <Switch id="inventory-alerts" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Transfer Updates</p>
                    <p className="text-sm text-muted-foreground">
                      Receive notifications when transfers are created or updated
                    </p>
                  </div>
                  <Switch id="transfer-updates" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Audit Notifications</p>
                    <p className="text-sm text-muted-foreground">
                      Get updates about scheduled and completed audits
                    </p>
                  </div>
                  <Switch id="audit-notifications" defaultChecked />
                </div>
              </CardContent>
              <CardFooter>
                <Button>Save notification settings</Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="backup">
            <Card>
              <CardHeader>
                <CardTitle>Backup and Restore</CardTitle>
                <CardDescription>
                  Create a backup of your data or restore from a previous backup
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Backup Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Create a backup file containing all your inventory data, products, locations, and settings.
                    You can use this file to restore your system in case of data loss.
                  </p>
                  <Button onClick={handleDownloadBackup}>
                    Download Backup
                  </Button>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-2">Restore Data</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Restore your system from a previous backup file. This will replace all current data with the data from the backup file.
                    Make sure to create a backup of your current data before proceeding.
                  </p>
                  <div className="flex items-center gap-4">
                    <Button onClick={handleRestoreClick} variant="outline">
                      Select Backup File
                    </Button>
                    <p className="text-sm text-muted-foreground">
                      No file selected
                    </p>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept=".json"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>
            
            {/* Restore confirmation dialog */}
            <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    Confirm Restore
                  </DialogTitle>
                  <DialogDescription>
                    This action will replace all current data with the data from the selected backup file.
                    This cannot be undone. Are you sure you want to proceed?
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsRestoreDialogOpen(false)}
                    disabled={isRestoring}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={handleRestoreConfirm}
                    disabled={isRestoring}
                  >
                    {isRestoring ? "Restoring..." : "Yes, Restore"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </TabsContent>
          
          <TabsContent value="meetings">
            <MeetingsTabContent />
          </TabsContent>
          
          <TabsContent value="chat">
            <Card>
              <CardHeader>
                <CardTitle>Live & Voice Chat</CardTitle>
                <CardDescription>
                  Communicate with your team in real-time through text and voice chat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ChatPanel />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
