
import React, { useState, useRef, useEffect } from "react";
import { useChat, ChatMessageType } from "@/contexts/ChatContext";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, Send, Users } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const ChatArea = () => {
  const { 
    activeRoomId, 
    messages, 
    sendMessage, 
    rooms, 
    isRecording, 
    toggleRecording,
    currentUser 
  } = useChat();
  const [messageText, setMessageText] = useState("");
  const [showParticipants, setShowParticipants] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Get current room
  const currentRoom = rooms.find(room => room.id === activeRoomId);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  
  // Handle sending a message
  const handleSendMessage = () => {
    if (messageText.trim()) {
      sendMessage(messageText.trim(), "text");
      setMessageText("");
    }
  };
  
  // Handle key press (Enter to send)
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };
  
  // Handle voice recording
  const handleVoiceRecording = () => {
    // In a real app, this would handle actual voice recording
    // For demo purposes, we'll just toggle the recording state
    toggleRecording();
    
    // Simulate sending a voice message after recording
    if (isRecording) {
      // This would be the actual audio URL in a real implementation
      sendMessage("https://example.com/audio/message.mp3", "audio");
    }
  };
  
  // If no active room is selected
  if (!activeRoomId || !currentRoom) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium">No chat selected</h3>
          <p className="text-muted-foreground">
            Select a chat room from the sidebar or create a new one
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Chat header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div>
          <h3 className="font-medium">{currentRoom.name}</h3>
          <p className="text-sm text-muted-foreground">
            {currentRoom.visibility === "public" ? "Public room" : "Private room"}
          </p>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setShowParticipants(true)}
        >
          <Users className="h-5 w-5" />
        </Button>
        
        {/* Participants dialog */}
        <Dialog open={showParticipants} onOpenChange={setShowParticipants}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Participants</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-sm text-muted-foreground mb-4">
                {currentRoom.visibility === "public" 
                  ? "This is a public room accessible to all users" 
                  : "This is a private room with selected participants"}
              </p>
              {currentRoom.participants.length > 0 ? (
                <ul className="space-y-2">
                  {currentRoom.participants.map((participant) => (
                    <li key={participant} className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary">
                      {/* This would show actual participant info in a real app */}
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        {participant.substring(0, 2).toUpperCase()}
                      </div>
                      <span>{participant}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No specific participants</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              message={message}
              isMine={message.sender === currentUser.name}
            />
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>
      
      {/* Input area */}
      <div className="p-4 border-t border-border">
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className={isRecording ? "bg-red-100 text-red-500" : ""}
            onClick={handleVoiceRecording}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Input
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            onKeyDown={handleKeyPress}
            disabled={isRecording}
            className="flex-1"
          />
          
          <Button
            variant="default"
            size="icon"
            onClick={handleSendMessage}
            disabled={!messageText.trim() && !isRecording}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};
