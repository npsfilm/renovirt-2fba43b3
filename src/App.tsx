
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "@/components/admin/AdminRoute";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
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

const AppContent = () => {
  // Initialize inactivity logout
  useInactivityLogout();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/admin-auth" element={<AdminAuth />} />
      
      {/* Protected routes that require authentication */}
      <Route path="/email-verification" element={
        <ProtectedRoute>
          <EmailVerification />
        </ProtectedRoute>
      } />
      <Route path="/onboarding" element={
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      } />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      <Route path="/order-flow" element={
        <ProtectedRoute>
          <OrderFlow />
        </ProtectedRoute>
      } />
      <Route path="/orders" element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      } />
      <Route path="/ai-tools" element={
        <ProtectedRoute>
          <AITools />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/billing" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/gallery" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      <Route path="/help" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      {/* Admin Routes - Protected with both auth and admin role */}
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
      
      {/* Catch-all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
