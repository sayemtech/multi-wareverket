import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { useToast } from "@/hooks/use-toast";

interface SecurityContextType {
  isUnlocked: boolean;
  unlockApp: () => void;
  handleKeyDown: (e: KeyboardEvent) => void;
}

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const secretKeySequence = useRef<string[]>([]);
  const secretKey = "admin";
  const { toast } = useToast();
  
  useEffect(() => {
    // App is usable for 5 seconds after load, then locks
    const timeoutId = setTimeout(() => {
      if (!isUnlocked) {
        setIsTimedOut(true);
        console.log("App locked due to timeout");
      }
    }, 5000);
    
    // Add global keyboard listener
    window.addEventListener("keydown", handleKeyDown);
    
    // Clean up
    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isUnlocked]);
  
  const handleKeyDown = (e: KeyboardEvent) => {
    if (isUnlocked) return;
    
    // Only track keys after timeout (when app is locked)
    if (isTimedOut) {
      // Add the key to our sequence
      secretKeySequence.current.push(e.key);
      console.log("Key pressed:", e.key); // Debug log
      
      // Keep only the last 5 keys (length of "admin")
      if (secretKeySequence.current.length > secretKey.length) {
        secretKeySequence.current.shift();
      }
      
      // Check if the sequence matches the secret
      const enteredText = secretKeySequence.current.join("");
      console.log("Current sequence:", enteredText); // Debug log
      
      if (enteredText === secretKey) {
        unlockApp();
      }
    }
  };
  
  const unlockApp = () => {
    setIsUnlocked(true);
    setIsTimedOut(false);
    secretKeySequence.current = [];
    console.log("App unlocked!");
    toast({
      title: "Access Granted",
      description: "Application unlocked successfully",
      variant: "success",
    });
  };
  
  return (
    <SecurityContext.Provider value={{ isUnlocked, unlockApp, handleKeyDown }}>
      {/* Invisible overlay that captures clicks and key presses */}
      {!isUnlocked && isTimedOut && (
        <div 
          onClick={() => {
            console.log("App ready for password input");
          }}
          style={{ 
            position: "fixed", 
            top: 0, 
            left: 0, 
            width: "100%", 
            height: "100%", 
            zIndex: 9999,
            backgroundColor: "rgba(0,0,0,0.05)",
            backdropFilter: "blur(1px)",
            cursor: "pointer",
          }}
        />
      )}
      
      {/* App content */}
      <div style={{ 
        opacity: isUnlocked || !isTimedOut ? 1 : 0.6, 
        pointerEvents: isUnlocked || !isTimedOut ? "auto" : "none",
        transition: "opacity 0.3s ease-in-out"
      }}>
        {children}
      </div>
    </SecurityContext.Provider>
  );
}

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (context === undefined) {
    throw new Error("useSecurityContext must be used within a SecurityProvider");
  }
  return context;
};
