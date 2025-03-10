import React, { createContext, useContext, useEffect, useState, useRef } from "react";

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
  const secretKey = "Mansur";
  
  useEffect(() => {
    // Set timeout after 5 seconds
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
    
    // Start tracking keys after timeout or after user clicks
    if (isTimedOut) {
      // Add the key to our sequence
      secretKeySequence.current.push(e.key);
      
      // Keep only the last N keys (where N is the length of the secret)
      if (secretKeySequence.current.length > secretKey.length) {
        secretKeySequence.current.shift();
      }
      
      // Check if the sequence matches the secret
      const enteredText = secretKeySequence.current.join("");
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
  };
  
  return (
    <SecurityContext.Provider value={{ isUnlocked, unlockApp, handleKeyDown }}>
      <div 
        onClick={() => {
          if (!isUnlocked && isTimedOut) {
            console.log("App ready for password input");
          }
        }}
        style={{ 
          position: "fixed", 
          top: 0, 
          left: 0, 
          width: "100%", 
          height: "100%", 
          zIndex: isUnlocked ? -1 : 9999,
          pointerEvents: isUnlocked ? "none" : "auto",
          cursor: isUnlocked ? "default" : "pointer"
        }}
      />
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
