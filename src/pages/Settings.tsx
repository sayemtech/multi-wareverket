
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
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { ChatPanel } from "@/components/chat/ChatPanel";
import { getMeetings, createMeeting, joinMeeting, cancelMeeting, updateMeetingStatus, Meeting } from "@/lib/meetings";

export default function Settings() {
  // Backup & Restore state
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Meetings state
  const [meetings, setMeetings] = useState<Meeting[]>(getMeetings());
  const [newMeetingTitle, setNewMeetingTitle] = useState("");
  const [newMeetingTime, setNewMeetingTime] = useState("");
  const [newMeetingParticipants, setNewMeetingParticipants] = useState("");
  
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
  
  // Meeting functions
  const handleCreateMeeting = () => {
    if (!newMeetingTitle || !newMeetingTime) {
      toast.error("Please provide a title and time for the meeting");
      return;
    }
    
    // Parse participants emails
    const participants = newMeetingParticipants
      .split(",")
      .map(email => email.trim())
      .filter(email => email);
    
    // Create the meeting
    const meeting = createMeeting({
      title: newMeetingTitle,
      scheduledFor: newMeetingTime,
      createdBy: "Admin User",
      participants
    });
    
    // Update local state
    setMeetings(getMeetings());
    
    // Reset form
    setNewMeetingTitle("");
    setNewMeetingTime("");
    setNewMeetingParticipants("");
    
    toast.success("Meeting scheduled successfully");
  };
  
  const handleJoinMeeting = (id: string) => {
    if (joinMeeting(id)) {
      toast.success("Joining meeting...");
      setMeetings(getMeetings()); // Refresh list
    } else {
      toast.error("Failed to join meeting");
    }
  };
  
  const handleCancelMeeting = (id: string) => {
    if (cancelMeeting(id)) {
      toast.success("Meeting cancelled");
      setMeetings(getMeetings()); // Refresh list
    } else {
      toast.error("Failed to cancel meeting");
    }
  };
  
  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url).then(
      () => toast.success("Meeting link copied to clipboard"),
      () => toast.error("Failed to copy meeting link")
    );
  };
  
  // Get a formatted date string
  const formatMeetingDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader>
                  <CardTitle>Schedule Meeting</CardTitle>
                  <CardDescription>
                    Create a new virtual meeting for team members
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="meeting-title">Meeting Title</Label>
                    <Input 
                      id="meeting-title" 
                      placeholder="Quarterly Inventory Review" 
                      value={newMeetingTitle}
                      onChange={(e) => setNewMeetingTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meeting-time">Date and Time</Label>
                    <Input 
                      id="meeting-time" 
                      type="datetime-local" 
                      value={newMeetingTime}
                      onChange={(e) => setNewMeetingTime(e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="meeting-participants">Participants (comma separated)</Label>
                    <Input 
                      id="meeting-participants" 
                      placeholder="user1@example.com, user2@example.com" 
                      value={newMeetingParticipants}
                      onChange={(e) => setNewMeetingParticipants(e.target.value)}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button onClick={handleCreateMeeting}>Schedule Meeting</Button>
                </CardFooter>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Upcoming Meetings</CardTitle>
                  <CardDescription>
                    View and manage your scheduled meetings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {meetings.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No meetings scheduled</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {meetings.map((meeting) => (
                        <Card key={meeting.id} className="overflow-hidden">
                          <div className="flex flex-col sm:flex-row border-b">
                            <div className="flex-1 p-4">
                              <div className="flex justify-between mb-1">
                                <h3 className="font-medium">{meeting.title}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  meeting.status === 'scheduled' 
                                    ? 'bg-blue-100 text-blue-700' 
                                    : meeting.status === 'active'
                                    ? 'bg-green-100 text-green-700'
                                    : meeting.status === 'completed'
                                    ? 'bg-gray-100 text-gray-700'
                                    : 'bg-red-100 text-red-700'
                                }`}>
                                  {meeting.status.charAt(0).toUpperCase() + meeting.status.slice(1)}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground">
                                Scheduled for: {formatMeetingDate(meeting.scheduledFor)}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {meeting.participants.length} participants
                              </p>
                            </div>
                          </div>
                          <div className="p-3 bg-muted/30 flex flex-wrap gap-2 justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCopyLink(meeting.joinUrl)}
                            >
                              Copy Link
                            </Button>
                            
                            {meeting.status === 'scheduled' && (
                              <>
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={() => handleJoinMeeting(meeting.id)}
                                >
                                  Join Meeting
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => handleCancelMeeting(meeting.id)}
                                >
                                  Cancel
                                </Button>
                              </>
                            )}
                            
                            {meeting.status === 'active' && (
                              <Button 
                                variant="default" 
                                size="sm"
                                onClick={() => handleJoinMeeting(meeting.id)}
                              >
                                Join Now
                              </Button>
                            )}
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
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
