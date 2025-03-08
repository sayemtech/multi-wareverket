import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Archive, 
  ArchiveRestore, 
  Bell, 
  Camera, 
  Download, 
  Key, 
  Lock, 
  LogOut, 
  Save, 
  Shield, 
  Upload, 
  User, 
  UserCog, 
  Users 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { downloadBackup, restoreFromBackup } from "@/lib/backupRestore";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose
} from "@/components/ui/dialog";
import { toast } from "sonner";

const Settings = () => {
  const [profile, setProfile] = useState({
    name: "Admin User",
    email: "admin@example.com",
    phone: "+1 (555) 123-4567",
    role: "Administrator",
    avatarUrl: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isRestoreDialogOpen, setIsRestoreDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully."
      });
    }, 1000);
  };

  const handlePasswordUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully."
      });
      
      // Clear form fields
      const form = e.target as HTMLFormElement;
      form.reset();
    }, 1000);
  };
  
  const handleAvatarUpload = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been updated successfully."
      });
    }, 1000);
  };

  const handleBackup = () => {
    setIsLoading(true);
    
    try {
      const success = downloadBackup();
      
      if (success) {
        toast({
          title: "Backup created successfully",
          description: "Your data has been backed up to a file"
        });
      } else {
        toast({
          title: "Backup failed",
          description: "There was an error creating your backup",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Backup error:", error);
      toast({
        title: "Backup failed",
        description: "There was an error creating your backup",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleRestore = async (file: File) => {
    setIsLoading(true);
    
    try {
      const success = await restoreFromBackup(file);
      
      if (success) {
        toast({
          title: "Restore completed",
          description: "Your data has been restored successfully"
        });
        
        // Close the dialog
        setIsRestoreDialogOpen(false);
        
        // Reload the page to reflect restored data
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        toast({
          title: "Restore failed",
          description: "There was an error restoring your data",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Restore error:", error);
      toast({
        title: "Restore failed",
        description: "There was an error restoring your data",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleRestore(file);
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6 max-w-3xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your account settings and system preferences
          </p>
        </div>
        
        {/* Settings Tabs */}
        <Tabs defaultValue="profile" className="w-full animate-fade-in">
          <TabsList className="w-full justify-start border-b rounded-none p-0 h-auto">
            <TabsTrigger 
              value="profile" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
            >
              <User className="h-4 w-4 mr-2" />
              Profile
            </TabsTrigger>
            <TabsTrigger 
              value="security" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
            >
              <Shield className="h-4 w-4 mr-2" />
              Security
            </TabsTrigger>
            <TabsTrigger 
              value="notifications" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
            >
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger 
              value="team" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
            >
              <Users className="h-4 w-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger 
              value="backup" 
              className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary data-[state=active]:shadow-none px-4 py-2"
            >
              <Archive className="h-4 w-4 mr-2" />
              Backup & Restore
            </TabsTrigger>
          </TabsList>
          
          {/* Profile Settings */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile.avatarUrl} />
                    <AvatarFallback className="text-2xl">{profile.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <Button 
                    size="icon" 
                    variant="secondary" 
                    className="absolute bottom-0 right-0 h-8 w-8 rounded-full"
                    onClick={handleAvatarUpload}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">
                    This will be displayed on your profile
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleAvatarUpload}>
                      Upload
                    </Button>
                    <Button variant="outline" size="sm" className="text-destructive">
                      Remove
                    </Button>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Personal Information</h3>
                
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        value={profile.name}
                        onChange={(e) => setProfile({...profile, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profile.email}
                        onChange={(e) => setProfile({...profile, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={profile.phone}
                        onChange={(e) => setProfile({...profile, phone: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <Input id="role" value={profile.role} readOnly className="bg-muted" />
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Change Password</h3>
              
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" required />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" required />
                </div>
                
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </span>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Update Password
                    </>
                  )}
                </Button>
              </form>
              
              <Separator />
              
              <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Protect your account with 2FA</h4>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch onChange={() => {
                  toast({
                    title: "Two-factor authentication",
                    description: "Two-factor authentication settings updated"
                  });
                }} />
              </div>
              
              <Separator />
              
              <h3 className="text-lg font-medium">API Keys</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Primary API Key</h4>
                    <p className="text-sm text-muted-foreground">
                      Created on May 12, 2023
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Key className="h-4 w-4 mr-2" />
                    Show Key
                  </Button>
                </div>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "New API key generated",
                      description: "Your new API key has been created. Make sure to copy it and store it securely."
                    });
                  }}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Generate New API Key
                </Button>
              </div>
              
              <Separator />
              
              <h3 className="text-lg font-medium">Account Actions</h3>
              
              <div className="space-y-4">
                <Button 
                  variant="destructive" 
                  className="w-full justify-start"
                  onClick={() => {
                    toast({
                      title: "Log out successful",
                      description: "You have been logged out of your account"
                    });
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Log Out of All Devices
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Notification Preferences</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Email Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive email for important updates
                    </p>
                  </div>
                  <Switch defaultChecked onChange={() => {
                    toast({
                      title: "Email notifications updated",
                    });
                  }} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in the app
                    </p>
                  </div>
                  <Switch defaultChecked onChange={() => {
                    toast({
                      title: "Push notifications updated",
                    });
                  }} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive text messages for critical alerts
                    </p>
                  </div>
                  <Switch onChange={() => {
                    toast({
                      title: "SMS notifications updated",
                    });
                  }} />
                </div>
              </div>
              
              <Separator />
              
              <h3 className="text-lg font-medium">Alert Settings</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Low Stock Alerts</h4>
                    <p className="text-sm text-muted-foreground">
                      Notify when products fall below reorder threshold
                    </p>
                  </div>
                  <Switch defaultChecked onChange={() => {
                    toast({
                      title: "Low stock alerts updated",
                    });
                  }} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Shipment Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Notify when shipments are received or dispatched
                    </p>
                  </div>
                  <Switch defaultChecked onChange={() => {
                    toast({
                      title: "Shipment notifications updated",
                    });
                  }} />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">System Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Notify about system maintenance and updates
                    </p>
                  </div>
                  <Switch defaultChecked onChange={() => {
                    toast({
                      title: "System update notifications updated",
                    });
                  }} />
                </div>
              </div>
              
              <Button onClick={() => {
                toast({
                  title: "Notification preferences saved",
                  description: "Your notification preferences have been updated."
                });
              }}>
                <Save className="h-4 w-4 mr-2" />
                Save Preferences
              </Button>
            </div>
          </TabsContent>
          
          {/* Team Settings */}
          <TabsContent value="team" className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Team Members</h3>
                <Button size="sm" onClick={() => {
                  toast({
                    title: "Add team member",
                    description: "This feature is not implemented yet."
                  });
                }}>
                  <UserCog className="h-4 w-4 mr-2" />
                  Add Member
                </Button>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">Admin User</h4>
                      <p className="text-sm text-muted-foreground">admin@example.com</p>
                    </div>
                  </div>
                  <Badge>Administrator</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>JD</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">Jane Doe</h4>
                      <p className="text-sm text-muted-foreground">jane@example.com</p>
                    </div>
                  </div>
                  <Badge>Manager</Badge>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-card rounded-lg border">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarFallback>AS</AvatarFallback>
                    </Avatar>
                    <div>
                      <h4 className="font-medium">Alex Smith</h4>
                      <p className="text-sm text-muted-foreground">alex@example.com</p>
                    </div>
                  </div>
                  <Badge>Staff</Badge>
                </div>
              </div>
              
              <Separator />
              
              <h3 className="text-lg font-medium">Role Permissions</h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Administrator</h4>
                    <p className="text-sm text-muted-foreground">
                      Full access to all features
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    toast({
                      title: "Edit role",
                      description: "This feature is not implemented yet."
                    });
                  }}>
                    Edit
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Manager</h4>
                    <p className="text-sm text-muted-foreground">
                      Can manage inventory and view reports
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    toast({
                      title: "Edit role",
                      description: "This feature is not implemented yet."
                    });
                  }}>
                    Edit
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Staff</h4>
                    <p className="text-sm text-muted-foreground">
                      Limited to basic inventory operations
                    </p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => {
                    toast({
                      title: "Edit role",
                      description: "This feature is not implemented yet."
                    });
                  }}>
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Backup & Restore Settings */}
          <TabsContent value="backup" className="mt-6 space-y-6">
            <div className="space-y-6">
              <h3 className="text-lg font-medium">Backup & Restore</h3>
              <p className="text-sm text-muted-foreground">
                Create backups of your system data and restore from previous backups
              </p>
              
              <div className="space-y-6">
                <div className="p-6 border rounded-lg bg-card space-y-4">
                  <div className="flex items-center gap-2">
                    <Archive className="h-5 w-5 text-primary" />
                    <h4 className="text-lg font-medium">Backup Data</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Create a backup file containing all your system data including inventory, locations, audits, and settings.
                  </p>
                  <Button 
                    onClick={handleBackup} 
                    disabled={isLoading}
                    className="w-full sm:w-auto"
                  >
                    {isLoading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating Backup...
                      </span>
                    ) : (
                      <>
                        <Download className="h-4 w-4 mr-2" />
                        Download Backup
                      </>
                    )}
                  </Button>
                </div>
                
                <div className="p-6 border rounded-lg bg-card space-y-4">
                  <div className="flex items-center gap-2">
                    <ArchiveRestore className="h-5 w-5 text-primary" />
                    <h4 className="text-lg font-medium">Restore Data</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Restore your system data from a previously created backup file.
                    <span className="block mt-1 font-medium text-warning">Warning: This will replace all current data with the data from the backup file.</span>
                  </p>
                  
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".json"
                    className="hidden"
                  />
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setIsRestoreDialogOpen(true)}
                    className="w-full sm:w-auto"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Restore from Backup
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      {/* Restore Confirmation Dialog */}
      <Dialog open={isRestoreDialogOpen} onOpenChange={setIsRestoreDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Restore Data</DialogTitle>
            <DialogDescription>
              This will replace all current data with the data from the backup file.
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              Make sure you have a backup of your current data before proceeding.
            </p>
            
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="backup-file">Backup File</Label>
              <Input 
                id="backup-file" 
                type="file" 
                accept=".json"
                onChange={handleFileChange}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRestoreDialogOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Settings;
