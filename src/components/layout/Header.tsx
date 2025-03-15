
import { useState, useEffect } from "react";
import { 
  Menu, 
  Search,
  Bell,
  User,
  LogOut
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { getAlerts, markAlertAsRead, clearAllAlerts } from "@/lib/data/alertsData";
import NotificationsDropdown from "./NotificationsDropdown";

interface HeaderProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Header({ setSidebarOpen }: HeaderProps) {
  const [notifications, setNotifications] = useState(getAlerts());
  const { toast } = useToast();

  useEffect(() => {
    setNotifications(getAlerts());
  }, []);

  const unreadNotifications = notifications.filter(n => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    markAlertAsRead(id);
    setNotifications(getAlerts());
    toast({
      title: "Notification marked as read",
    });
  };

  const handleClearAll = () => {
    clearAllAlerts();
    setNotifications([]);
    toast({
      title: "All notifications cleared",
    });
  };

  return (
    <header className="h-16 border-b border-border flex items-center px-4 sm:px-6 sticky top-0 z-30 bg-background/80 backdrop-blur">
      <Button 
        variant="ghost" 
        size="icon" 
        className="lg:hidden" 
        onClick={() => setSidebarOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
      
      <div className="ml-4 lg:ml-0 relative w-full max-w-md">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          type="search" 
          placeholder="Search inventory..." 
          className="pl-8 w-full bg-secondary border-none h-9"
        />
      </div>
      
      <div className="ml-auto flex items-center space-x-1">
        <NotificationsDropdown 
          notifications={notifications}
          unreadCount={unreadNotifications}
          onMarkAsRead={handleMarkAsRead}
          onClearAll={handleClearAll}
        />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <NavLink to="/settings" className="cursor-pointer">
                <User className="h-4 w-4 mr-2" />
                Profile Settings
              </NavLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
