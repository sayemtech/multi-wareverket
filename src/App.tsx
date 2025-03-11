
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Inventory from "./pages/Inventory";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import Locations from "./pages/Locations";
import Reports from "./pages/Reports";
import Vendors from "./pages/Vendors";
import Settings from "./pages/Settings";
import Transfer from "./pages/Transfer";
import Audit from "./pages/Audit";
import AuditDetail from "./pages/AuditDetail";
import Sales from "./pages/Sales";
import Customers from "./pages/Customers";
import MeetingRoom from "./pages/MeetingRoom";
import SecuritySettings from "./pages/SecuritySettings";
import SecurityRoles from "./pages/SecurityRoles";
import SecurityAudit from "./pages/SecurityAudit";
import AccessLog from "./pages/AccessLog";
import NotFound from "./pages/NotFound";
import { ChatProvider } from "./contexts/ChatContext";
import { SecurityProvider } from "./contexts/SecurityContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SecurityProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ChatProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/inventory" element={<Inventory />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<SingleProduct />} />
              <Route path="/locations" element={<Locations />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/transfer" element={<Transfer />} />
              <Route path="/audit" element={<Audit />} />
              <Route path="/audit/:id" element={<AuditDetail />} />
              <Route path="/sales" element={<Sales />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/security" element={<SecuritySettings />} />
              <Route path="/security/roles" element={<SecurityRoles />} />
              <Route path="/security/audit" element={<SecurityAudit />} />
              <Route path="/access-log" element={<AccessLog />} />
              <Route path="/meeting/:id" element={<MeetingRoom />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ChatProvider>
        </BrowserRouter>
      </SecurityProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
