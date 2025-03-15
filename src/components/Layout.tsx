
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Sidebar from "./layout/Sidebar";
import Header from "./layout/Header";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      toast({
        title: "Welcome to INVSTRAR",
        description: "Your inventory management system is ready to use.",
      });
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [toast]);

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      
      <main className="flex-1 flex flex-col min-h-screen overflow-hidden">
        <Header setSidebarOpen={setSidebarOpen} />
        
        <div className="flex-1 overflow-auto">
          <div className="animate-fade-in">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
