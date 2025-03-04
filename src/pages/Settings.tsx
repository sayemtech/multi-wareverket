
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Bell, Key, Lock, Mail, Save, Shield, User, UserCog, Users } from "lucide-react";

const Settings = () => {
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
          </TabsList>
          
          {/* Profile Settings */}
          <TabsContent value="profile" className="mt-6 space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" />
                  <AvatarFallback className="text-2xl">AD</AvatarFallback>
                </Avatar>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Profile Picture</h3>
                  <p className="text-sm text-muted-foreground">
                    This will be displayed on your profile
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" defaultValue="Admin User" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="admin@example.com" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Input id="role" defaultValue="Administrator" readOnly className="bg-muted" />
                  </div>
                </div>
                
                <Button className="mt-4">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </div>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security" className="mt-6 space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Change Password</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>
                
                <Button>
                  <Lock className="h-4 w-4 mr-2" />
                  Update Password
                </Button>
              </div>
              
              <Separator />
              
              <h3 className="text-lg font-medium">Two-Factor Authentication</h3>
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <h4 className="font-medium">Protect your account with 2FA</h4>
                  <p className="text-sm text-muted-foreground">
                    Add an extra layer of security to your account
                  </p>
                </div>
                <Switch />
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
                
                <Button variant="outline" className="w-full justify-start">
                  <Key className="h-4 w-4 mr-2" />
                  Generate New API Key
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
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Push Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications in the app
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">SMS Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Receive text messages for critical alerts
                    </p>
                  </div>
                  <Switch />
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
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">Shipment Notifications</h4>
                    <p className="text-sm text-muted-foreground">
                      Notify when shipments are received or dispatched
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-medium">System Updates</h4>
                    <p className="text-sm text-muted-foreground">
                      Notify about system maintenance and updates
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
              
              <Button>
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
                <Button size="sm">
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
                  <Button variant="outline" size="sm">
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
                  <Button variant="outline" size="sm">
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
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Settings;
