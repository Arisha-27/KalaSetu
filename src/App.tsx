import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { DashboardLayout } from "./components/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import AIListingGenerator from "./pages/AIListingGenerator";
import InventoryManagement from "./pages/InventoryManagement";
import OrderDashboard from "./pages/OrderDashboard";
import DigitalWorkshop from "./pages/DigitalWorkshop";
import ProductCollections from "./pages/ProductCollections";
import SalesAnalytics from "./pages/SalesAnalytics";
import AITrendSpotter from "./pages/AITrendSpotter";
import Messenger from "./pages/Messenger";
import CollaborationFinder from "./pages/CollaborationFinder";
import EarningsDashboard from "./pages/EarningsDashboard";
import PayoutSettings from "./pages/PayoutSettings";
import NotFound from "./pages/NotFound"; // Use the default import

const queryClient = new QueryClient(); // Variable is declared here with camelCase

const App = () => (
  <QueryClientProvider client={queryClient}> {/* Use the correct variable here */}
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <Routes>
          <Route path="/" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
          <Route path="/ai-listing-generator" element={<DashboardLayout><AIListingGenerator /></DashboardLayout>} />
          <Route path="/inventory-management" element={<DashboardLayout><InventoryManagement /></DashboardLayout>} />
          <Route path="/order-dashboard" element={<DashboardLayout><OrderDashboard /></DashboardLayout>} />
          <Route path="/digital-workshop" element={<DashboardLayout><DigitalWorkshop /></DashboardLayout>} />
          <Route path="/product-collections" element={<DashboardLayout><ProductCollections /></DashboardLayout>} />
          <Route path="/sales-analytics" element={<DashboardLayout><SalesAnalytics /></DashboardLayout>} />
          <Route path="/ai-trend-spotter" element={<DashboardLayout><AITrendSpotter /></DashboardLayout>} />
          <Route path="/messenger" element={<DashboardLayout><Messenger /></DashboardLayout>} />
          <Route path="/collaboration-finder" element={<DashboardLayout><CollaborationFinder /></DashboardLayout>} />
          <Route path="/earnings-dashboard" element={<DashboardLayout><EarningsDashboard /></DashboardLayout>} />
          <Route path="/payout-settings" element={<DashboardLayout><PayoutSettings /></DashboardLayout>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;