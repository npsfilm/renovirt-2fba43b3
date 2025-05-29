
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "@/components/admin/AdminRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminAuth from "./pages/AdminAuth";
import EmailVerification from "./pages/EmailVerification";
import Onboarding from "./pages/Onboarding";
import Dashboard from "./pages/Dashboard";
import OrderFlow from "./pages/OrderFlow";
import Orders from "./pages/Orders";
import AITools from "./pages/AITools";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/email-verification" element={<EmailVerification />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/order-flow" element={<OrderFlow />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/ai-tools" element={<AITools />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/billing" element={<Profile />} />
          <Route path="/settings" element={<Profile />} />
          <Route path="/gallery" element={<Profile />} />
          <Route path="/help" element={<Profile />} />
          
          {/* Admin Routes - Protected */}
          <Route path="/management" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/management/orders" element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          } />
          <Route path="/management/customers" element={
            <AdminRoute>
              <AdminCustomers />
            </AdminRoute>
          } />
          <Route path="/management/analytics" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/management/settings" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
