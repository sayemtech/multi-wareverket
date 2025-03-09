
import React, { useState } from "react";
import { useChat, ChatVisibility } from "@/contexts/ChatContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Plus, MessageSquare, Users, Lock, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";

export const ChatSidebar = () => {
  const { rooms, activeRoomId, setActiveRoomId, createRoom } = useChat();
  const [isNewRoomDialogOpen, setIsNewRoomDialogOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState("");
  const [newRoomVisibility, setNewRoomVisibility] = useState<ChatVisibility>("private");
  
  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      const newRoom = createRoom(newRoomName.trim(), [], newRoomVisibility);
      setActiveRoomId(newRoom.id);
      setNewRoomName("");
      setIsNewRoomDialogOpen(false);
    }
  };
  
  return (
    <div className="w-64 border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h3 className="font-medium text-sm">Chat Rooms</h3>
        <Dialog open={isNewRoomDialogOpen} onOpenChange={setIsNewRoomDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Chat Room</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="roomName" className="text-sm font-medium">Room Name</label>
                <Input
                  id="roomName"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Enter room name"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Visibility</label>
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant={newRoomVisibility === "private" ? "default" : "outline"}
                    onClick={() => setNewRoomVisibility("private")}
                    className="flex-1"
                  >
                    <Lock className="h-4 w-4 mr-2" /> Private
                  </Button>
                  <Button
                    type="button"
                    variant={newRoomVisibility === "public" ? "default" : "outline"}
                    onClick={() => setNewRoomVisibility("public")}
                    className="flex-1"
                  >
                    <Globe className="h-4 w-4 mr-2" /> Public
                  </Button>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateRoom}>Create Room</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {rooms.map((room) => (
            <button
              key={room.id}
              className={cn(
                "w-full px-3 py-2 text-left rounded-md flex items-center space-x-2 hover:bg-secondary transition-colors",
                activeRoomId === room.id && "bg-secondary"
              )}
              onClick={() => setActiveRoomId(room.id)}
            >
              {room.visibility === "public" ? (
                <Globe className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Lock className="h-4 w-4 text-muted-foreground" />
              )}
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <span className="font-medium truncate text-sm">{room.name}</span>
                  {room.messages.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(room.lastActivity), { addSuffix: true })}
                    </span>
                  )}
                </div>
                {room.messages.length > 0 && (
                  <p className="text-xs text-muted-foreground truncate">
                    {room.messages[room.messages.length - 1].type === "audio" 
                      ? "Voice message" 
                      : room.messages[room.messages.length - 1].content}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
