import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { toast } from 'sonner';

type SecurityContextType = {
  isLocked: boolean;
  unlockApp: () => void;
};

const SecurityContext = createContext<SecurityContextType | undefined>(undefined);

export function useSecurityContext() {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
}

export function SecurityProvider({ children }: { children: React.ReactNode }) {
  const [isLocked, setIsLocked] = useState(false);
  const [keySequence, setKeySequence] = useState('');
  const [isListening, setIsListening] = useState(false);
  
  // Lock the app after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLocked(true);
    }, 5000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Handle key presses when the app is locked and listening for input
  useEffect(() => {
    if (!isLocked || !isListening) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeySequence(prev => {
        const newSequence = prev + e.key;
        // Check if the user has typed "mansur"
        if (newSequence === 'mansur') {
          unlockApp();
          return '';
        }
        // Keep only the last 6 characters to avoid memory issues
        return newSequence.slice(-6);
      });
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLocked, isListening]);
  
  // Handle screen click to start listening for the secret code
  useEffect(() => {
    if (!isLocked) return;
    
    const handleClick = () => {
      setIsListening(true);
    };
    
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, [isLocked]);
  
  const unlockApp = useCallback(() => {
    setIsLocked(false);
    setIsListening(false);
    setKeySequence('');
    toast("App unlocked", {
      description: "The application is now fully functional"
    });
  }, []);
  
  // The overlay that blocks interactions when the app is locked
  if (isLocked) {
    return (
      <SecurityContext.Provider value={{ isLocked, unlockApp }}>
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            zIndex: 9999,
            cursor: 'pointer'
          }}
        >
          {children}
        </div>
      </SecurityContext.Provider>
    );
  }
  
  return (
    <SecurityContext.Provider value={{ isLocked, unlockApp }}>
      {children}
    </SecurityContext.Provider>
  );
}
