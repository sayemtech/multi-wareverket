
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Boxes, 
  Package, 
  Map, 
  Settings, 
  FileText,
  Truck,
  ClipboardCheck,
  ShoppingBag,
  Users,
  Shield,
  Lock,
  History,
  UserCog,
  X
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const navItems = [
  { name: "Dashboard", path: "/", icon: BarChart3 },
  { name: "Inventory", path: "/inventory", icon: Boxes },
  { name: "Products", path: "/products", icon: Package },
  { name: "Sales", path: "/sales", icon: ShoppingBag },
  { name: "Customers", path: "/customers", icon: Users },
  { name: "Locations", path: "/locations", icon: Map },
  { name: "Transfer", path: "/transfer", icon: Truck },
  { name: "Audit", path: "/audit", icon: ClipboardCheck },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Vendors", path: "/vendors", icon: Truck },
  { name: "Settings", path: "/settings", icon: Settings },
  { name: "Security Settings", path: "/security", icon: Shield },
  { name: "Security Roles", path: "/security/roles", icon: UserCog },
  { name: "Security Audit", path: "/security/audit", icon: Lock },
  { name: "Access Log", path: "/access-log", icon: History },
];

export default function Sidebar({ sidebarOpen, setSidebarOpen }: SidebarProps) {
  const location = useLocation();
  
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname, setSidebarOpen]);

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity lg:hidden",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />
      
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 lg:w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          <div className="h-16 flex items-center px-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <Boxes className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold">INVSTRAR</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="ml-auto lg:hidden" 
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="flex-1 py-6 px-4 overflow-y-auto">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) => cn(
                      "flex items-center px-3 py-2.5 rounded-lg font-medium transition-colors",
                      "hover:bg-secondary group",
                      isActive 
                        ? "bg-primary/10 text-primary" 
                        : "text-foreground/70 hover:text-foreground"
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
          
          <div className="p-4 border-t border-border">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs text-muted-foreground">admin@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
