
import React, { useState, useRef, useEffect } from "react";
import { useChat, ChatMessageType } from "@/contexts/ChatContext";
import { ChatMessage } from "./ChatMessage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, MicOff, Send, Users, MessageSquare, Image, Paperclip } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAudioRecorder } from "@/lib/audioRecorder";
import { toast } from "sonner";

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
  const [recordingTimer, setRecordingTimer] = useState(0);
  const [recordingTimerId, setRecordingTimerId] = useState<NodeJS.Timeout | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const audioRecorder = useAudioRecorder();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  const handleVoiceRecording = async () => {
    if (!isRecording) {
      // Start recording
      try {
        await audioRecorder?.start();
        toggleRecording();
        toast.info("Recording started");
        
        // Start recording timer
        const timerId = setInterval(() => {
          setRecordingTimer(prev => prev + 1);
        }, 1000);
        setRecordingTimerId(timerId);
      } catch (error) {
        console.error("Error starting recording:", error);
        toast.error("Could not access microphone");
      }
    } else {
      // Stop recording
      if (audioRecorder) {
        try {
          const audioUrl = await audioRecorder.stop();
          sendMessage(audioUrl, "audio");
          toggleRecording();
          toast.success("Voice message sent");
          
          // Reset and clear recording timer
          if (recordingTimerId) {
            clearInterval(recordingTimerId);
            setRecordingTimerId(null);
          }
          setRecordingTimer(0);
        } catch (error) {
          console.error("Error stopping recording:", error);
          toast.error("Error processing voice message");
          toggleRecording();
        }
      }
    }
  };
  
  // Handle file upload click
  const handleFileUploadClick = (type: 'image' | 'document') => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('accept', type === 'image' ? 'image/*' : '.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx');
      fileInputRef.current.setAttribute('data-type', type);
      fileInputRef.current.click();
    }
  };
  
  // Handle file selection
  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const type = e.target.getAttribute('data-type') as 'image' | 'document';
    
    if (!type) {
      toast.error("Unknown file type");
      return;
    }
    
    // Check file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File too large. Maximum size is 10MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target && event.target.result) {
        // Create file info for the message
        const fileInfo = {
          name: file.name,
          size: file.size
        };
        
        // Send the file message
        sendMessage(event.target.result.toString(), type, fileInfo);
        toast.success(`${type === 'image' ? 'Image' : 'Document'} sent`);
      }
    };
    reader.onerror = () => {
      toast.error(`Error reading ${type}`);
    };
    
    // Read the file as Data URL
    reader.readAsDataURL(file);
    
    // Reset the input
    e.target.value = '';
  };
  
  // Format recording time as MM:SS
  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (recordingTimerId) {
        clearInterval(recordingTimerId);
      }
    };
  }, [recordingTimerId]);
  
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
        {isRecording && (
          <div className="flex items-center justify-center mb-3">
            <div className="px-4 py-1 bg-red-100 text-red-500 rounded-full flex items-center gap-2 animate-pulse">
              <span className="h-2 w-2 bg-red-500 rounded-full"></span>
              <span>Recording {formatRecordingTime(recordingTimer)}</span>
            </div>
          </div>
        )}
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className={isRecording ? "bg-red-100 text-red-500" : ""}
            onClick={handleVoiceRecording}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFileUploadClick('image')}
            disabled={isRecording}
          >
            <Image className="h-5 w-5" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleFileUploadClick('document')}
            disabled={isRecording}
          >
            <Paperclip className="h-5 w-5" />
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
          
          {/* Hidden file input */}
          <input 
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelected}
          />
        </div>
      </div>
    </div>
  );
};
