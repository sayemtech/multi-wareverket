
import React, { useState, useRef, useEffect } from "react";
import { ChatMessage as ChatMessageType } from "@/contexts/ChatContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Play, Pause } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

interface ChatMessageProps {
  message: ChatMessageType;
  isMine: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isMine }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  // Handlers for audio messages
  const toggleAudio = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(err => {
        console.error("Error playing audio:", err);
      });
      setIsPlaying(true);
    }
  };
  
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };
  
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const currentProgress = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(currentProgress);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };
  
  // Format duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Get current time as MM:SS
  const getCurrentTime = () => {
    if (audioRef.current) {
      return formatDuration(audioRef.current.currentTime);
    }
    return "00:00";
  };
  
  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  return (
    <div
      className={cn(
        "flex items-start gap-2 mb-4",
        isMine && "flex-row-reverse"
      )}
    >
      <Avatar className="h-8 w-8">
        <AvatarFallback>{getInitials(message.sender)}</AvatarFallback>
      </Avatar>
      
      <div className="flex flex-col max-w-[70%]">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium">{message.sender}</span>
          <span className="text-xs text-muted-foreground">
            {format(new Date(message.timestamp), "p")}
          </span>
        </div>
        
        {message.type === "text" && (
          <div
            className={cn(
              "mt-1 p-3 rounded-lg",
              isMine
                ? "bg-primary text-primary-foreground rounded-tr-none"
                : "bg-secondary rounded-tl-none"
            )}
          >
            {message.content}
          </div>
        )}
        
        {message.type === "audio" && (
          <div
            className={cn(
              "mt-1 p-3 rounded-lg",
              isMine
                ? "bg-primary text-primary-foreground rounded-tr-none"
                : "bg-secondary rounded-tl-none"
            )}
          >
            <div className="flex items-center gap-2">
              <Button
                size="icon"
                variant="ghost"
                className="h-8 w-8 rounded-full"
                onClick={toggleAudio}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
              
              <div className="flex-1">
                <div className="w-full bg-secondary-foreground/20 h-2 rounded-full">
                  <div 
                    className="bg-secondary-foreground h-full rounded-full transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between mt-1 text-xs">
                  <span>{isPlaying ? getCurrentTime() : "00:00"}</span>
                  <span>{formatDuration(duration)}</span>
                </div>
              </div>
            </div>
            
            <audio
              ref={audioRef}
              src={message.content}
              onEnded={handleAudioEnded}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              className="hidden"
            />
          </div>
        )}
        
        {message.type === "system" && (
          <div className="text-center text-sm text-muted-foreground bg-secondary/50 rounded-lg py-1 px-3 mt-1">
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
};
