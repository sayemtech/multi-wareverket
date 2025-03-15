
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Bell } from "lucide-react";
import { AlertItem } from "@/lib/data/alertsData";

interface NotificationsDropdownProps {
  notifications: AlertItem[];
  unreadCount: number;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export default function NotificationsDropdown({
  notifications,
  unreadCount,
  onMarkAsRead,
  onClearAll
}: NotificationsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative text-muted-foreground">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-destructive text-[10px] font-medium flex items-center justify-center text-destructive-foreground">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex justify-between items-center">
          <span>Notifications</span>
          {notifications.length > 0 && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs h-7"
              onClick={onClearAll}
            >
              Clear All
            </Button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {notifications.length === 0 ? (
          <div className="py-4 text-center text-muted-foreground">
            No notifications
          </div>
        ) : (
          <div className="max-h-[300px] overflow-y-auto">
            {notifications.map((notification) => (
              <DropdownMenuItem 
                key={notification.id} 
                className={cn(
                  "flex flex-col items-start p-3 cursor-default",
                  !notification.isRead && "bg-primary/5"
                )}
              >
                <div className="flex w-full justify-between items-start">
                  <span className="font-medium">{notification.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</span>
                  <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                </div>
                <p className="text-sm mt-1">{notification.message}</p>
                <p className="text-sm font-medium mt-1">{notification.item} - {notification.location}</p>
                {!notification.isRead && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="mt-2 text-xs h-7 self-end"
                    onClick={() => onMarkAsRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                )}
              </DropdownMenuItem>
            ))}
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
