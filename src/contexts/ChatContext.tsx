import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getLocalStorageData, setLocalStorageData } from "@/lib/localStorage";

// Chat message types
export type ChatMessageType = "text" | "audio" | "system" | "image" | "document";
export type ChatVisibility = "private" | "public";

// Chat roles
export type ChatUserRole = "admin" | "manager" | "staff" | "guest";

// Chat message interface
export interface ChatMessage {
  id: string;
  sender: string;
  senderRole: ChatUserRole;
  content: string;
  type: ChatMessageType;
  timestamp: string;
  isRead: boolean;
  fileName?: string; // For document and image files
  fileSize?: number; // For document and image files
}

// Chat room interface
export interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  messages: ChatMessage[];
  visibility: ChatVisibility;
  createdAt: string;
  lastActivity: string;
}

// Chat context interface
interface ChatContextType {
  rooms: ChatRoom[];
  activeRoomId: string | null;
  setActiveRoomId: (id: string | null) => void;
  messages: ChatMessage[];
  sendMessage: (content: string, type: ChatMessageType, fileInfo?: { name: string, size: number }) => void;
  createRoom: (name: string, participants: string[], visibility: ChatVisibility) => ChatRoom;
  deleteRoom: (id: string) => void;
  isRecording: boolean;
  toggleRecording: () => void;
  currentUser: {
    id: string;
    name: string;
    role: ChatUserRole;
  };
}

// Default user values - in a real app this would come from auth
const defaultUser = {
  id: "user-1",
  name: "Admin User",
  role: "admin" as ChatUserRole
};

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Storage keys
const CHAT_ROOMS_STORAGE_KEY = "chatRooms";
const ACTIVE_ROOM_STORAGE_KEY = "activeChatRoom";

// Chat provider component
export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentUser] = useState(defaultUser);
  
  // Load rooms from storage on mount
  useEffect(() => {
    const savedRooms = getLocalStorageData(CHAT_ROOMS_STORAGE_KEY, []);
    if (savedRooms.length > 0) {
      setRooms(savedRooms);
    } else {
      // Create default public room if no rooms exist
      const defaultRoom: ChatRoom = {
        id: "general",
        name: "General",
        participants: [],
        messages: [
          {
            id: "welcome-msg",
            sender: "System",
            senderRole: "admin",
            content: "Welcome to the general chat room!",
            type: "system",
            timestamp: new Date().toISOString(),
            isRead: false
          }
        ],
        visibility: "public",
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString()
      };
      setRooms([defaultRoom]);
      setLocalStorageData(CHAT_ROOMS_STORAGE_KEY, [defaultRoom]);
    }
    
    // Load active room from storage
    const savedActiveRoom = getLocalStorageData(ACTIVE_ROOM_STORAGE_KEY, null);
    if (savedActiveRoom) {
      setActiveRoomId(savedActiveRoom);
    }
  }, []);
  
  // Save rooms to storage when they change
  useEffect(() => {
    if (rooms.length > 0) {
      setLocalStorageData(CHAT_ROOMS_STORAGE_KEY, rooms);
    }
  }, [rooms]);
  
  // Save active room to storage when it changes
  useEffect(() => {
    if (activeRoomId) {
      setLocalStorageData(ACTIVE_ROOM_STORAGE_KEY, activeRoomId);
    }
  }, [activeRoomId]);
  
  // Get current active room messages
  const messages = activeRoomId
    ? rooms.find(room => room.id === activeRoomId)?.messages || []
    : [];
  
  // Send a message to the active room
  const sendMessage = useCallback((content: string, type: ChatMessageType = "text", fileInfo?: { name: string, size: number }) => {
    if (!activeRoomId) return;
    
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(2, 15),
      sender: currentUser.name,
      senderRole: currentUser.role,
      content,
      type,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    // Add file information if available
    if (fileInfo) {
      newMessage.fileName = fileInfo.name;
      newMessage.fileSize = fileInfo.size;
    }
    
    setRooms(prevRooms => {
      return prevRooms.map(room => {
        if (room.id === activeRoomId) {
          return {
            ...room,
            messages: [...room.messages, newMessage],
            lastActivity: new Date().toISOString()
          };
        }
        return room;
      });
    });
  }, [activeRoomId, currentUser]);
  
  // Create a new chat room
  const createRoom = useCallback((name: string, participants: string[], visibility: ChatVisibility): ChatRoom => {
    const newRoom: ChatRoom = {
      id: Math.random().toString(36).substring(2, 15),
      name,
      participants: [...participants, currentUser.id],
      messages: [],
      visibility,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString()
    };
    
    setRooms(prevRooms => [...prevRooms, newRoom]);
    return newRoom;
  }, [currentUser.id]);
  
  // Delete a chat room
  const deleteRoom = useCallback((id: string) => {
    setRooms(prevRooms => prevRooms.filter(room => room.id !== id));
    
    if (activeRoomId === id) {
      setActiveRoomId(null);
    }
  }, [activeRoomId]);
  
  // Toggle voice recording
  const toggleRecording = useCallback(() => {
    setIsRecording(prev => !prev);
  }, []);
  
  const value = {
    rooms,
    activeRoomId,
    setActiveRoomId,
    messages,
    sendMessage,
    createRoom,
    deleteRoom,
    isRecording,
    toggleRecording,
    currentUser
  };
  
  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// Custom hook to use the chat context
export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
