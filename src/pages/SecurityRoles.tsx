
import { useState } from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Users, ShieldCheck, Lock, Eye, EyeOff } from "lucide-react";

const roles = [
  { 
    id: 1, 
    name: "Administrator", 
    description: "Full access to all system features", 
    permissions: [
      { id: 1, name: "View Inventory", granted: true },
      { id: 2, name: "Manage Products", granted: true },
      { id: 3, name: "Manage Users", granted: true },
      { id: 4, name: "View Reports", granted: true },
      { id: 5, name: "Configure System", granted: true },
    ] 
  },
  { 
    id: 2, 
    name: "Inventory Manager", 
    description: "Manage inventory and stock levels", 
    permissions: [
      { id: 1, name: "View Inventory", granted: true },
      { id: 2, name: "Manage Products", granted: true },
      { id: 3, name: "Manage Users", granted: false },
      { id: 4, name: "View Reports", granted: true },
      { id: 5, name: "Configure System", granted: false },
    ] 
  },
  { 
    id: 3, 
    name: "Viewer", 
    description: "View-only access to inventory data", 
    permissions: [
      { id: 1, name: "View Inventory", granted: true },
      { id: 2, name: "Manage Products", granted: false },
      { id: 3, name: "Manage Users", granted: false },
      { id: 4, name: "View Reports", granted: true },
      { id: 5, name: "Configure System", granted: false },
    ] 
  },
];

const SecurityRoles = () => {
  const [expandedRole, setExpandedRole] = useState<number | null>(null);
  const [rolesList, setRolesList] = useState(roles);

  const toggleRoleExpand = (roleId: number) => {
    setExpandedRole(expandedRole === roleId ? null : roleId);
  };

  const togglePermission = (roleId: number, permissionId: number) => {
    setRolesList(rolesList.map(role => {
      if (role.id === roleId) {
        return {
          ...role,
          permissions: role.permissions.map(permission => {
            if (permission.id === permissionId) {
              return { ...permission, granted: !permission.granted };
            }
            return permission;
          })
        };
      }
      return role;
    }));
  };

  const saveChanges = () => {
    // In a real app, this would save to a database
    toast("Role permissions updated", {
      description: "Security role changes have been saved"
    });
  };

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6" />
            <h1 className="text-3xl font-bold tracking-tight">Security Roles</h1>
          </div>
          <Button onClick={saveChanges}>
            Save Changes
          </Button>
        </div>
        
        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <CardTitle>Role Management</CardTitle>
              </div>
              <CardDescription>
                Configure security roles and their associated permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rolesList.map((role) => (
                    <>
                      <TableRow key={role.id}>
                        <TableCell className="font-medium">{role.name}</TableCell>
                        <TableCell>{role.description}</TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => toggleRoleExpand(role.id)}
                          >
                            {expandedRole === role.id ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </TableCell>
                      </TableRow>
                      {expandedRole === role.id && (
                        <TableRow>
                          <TableCell colSpan={3} className="bg-muted/20">
                            <div className="py-2">
                              <h3 className="font-medium mb-2 flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Permissions for {role.name}
                              </h3>
                              <div className="space-y-3">
                                {role.permissions.map((permission) => (
                                  <div key={permission.id} className="flex items-center justify-between">
                                    <span>{permission.name}</span>
                                    <Switch 
                                      checked={permission.granted}
                                      onCheckedChange={() => togglePermission(role.id, permission.id)}
                                    />
                                  </div>
                                ))}
                              </div>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default SecurityRoles;
