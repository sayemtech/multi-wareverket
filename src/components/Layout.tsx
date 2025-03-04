
import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { 
  BarChart3, 
  Boxes, 
  Package, 
  Map, 
  Settings, 
  Menu, 
  X,
  Search,
  Bell,
  User,
  FileText,
  Truck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";

interface LayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { name: "Dashboard", path: "/", icon: BarChart3 },
  { name: "Inventory", path: "/inventory", icon: Boxes },
  { name: "Products", path: "/products", icon: Package },
  { name: "Locations", path: "/locations", icon: Map },
  { name: "Transfer", path: "/transfer", icon: Truck },
  { name: "Reports", path: "/reports", icon: FileText },
  { name: "Vendors", path: "/vendors", icon: Truck },
  { name: "Settings", path: "/settings", icon: Settings },
];

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { toast } = useToast();
  
  // Close sidebar on mobile when navigating
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);
  
  // For demonstration purposes - show notification
  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "Welcome to InventoryOS",
        description: "Your inventory management system is ready to use.",
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="min-h-screen flex w-full bg-background">
      {/* Sidebar (mobile overlay) */}
      <div 
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-opacity lg:hidden",
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 lg:w-72 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-full flex flex-col">
          {/* Logo */}
          <div className="h-16 flex items-center px-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <Boxes className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-semibold">InventoryOS</span>
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
          
          {/* Nav links */}
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
          
          {/* User profile */}
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
      
      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center px-4 sm:px-6 sticky top-0 z-30 bg-background/80 backdrop-blur">
          <Button 
            variant="ghost" 
            size="icon" 
            className="lg:hidden" 
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          
          {/* Search */}
          <div className="ml-4 lg:ml-0 relative w-full max-w-md">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search inventory..." 
              className="pl-8 w-full bg-secondary border-none h-9"
            />
          </div>
          
          {/* Right side actions */}
          <div className="ml-auto flex items-center space-x-1">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </header>
        
        {/* Page content */}
        <div className="flex-1 overflow-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
