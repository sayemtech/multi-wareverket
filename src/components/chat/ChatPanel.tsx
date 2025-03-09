
import React from "react";
import { ChatProvider } from "@/contexts/ChatContext";
import { ChatSidebar } from "./ChatSidebar";
import { ChatArea } from "./ChatArea";

export const ChatPanel = () => {
  return (
    <ChatProvider>
      <div className="h-[600px] flex border border-border rounded-md overflow-hidden">
        <ChatSidebar />
        <ChatArea />
      </div>
    </ChatProvider>
  );
};
