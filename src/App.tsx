
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import OrderFlow from "./pages/OrderFlow";
import Billing from "./pages/Billing";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Referrals from "./pages/Referrals";
import Onboarding from "./pages/Onboarding";
import EmailVerification from "./pages/EmailVerification";
import ForgotPassword from "./pages/ForgotPassword";
import NotFound from "./pages/NotFound";
import AdminAuth from "./pages/AdminAuth";
import AdminDashboard from "./pages/AdminDashboard";
import AdminOrders from "./pages/AdminOrders";
import AdminCustomers from "./pages/AdminCustomers";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminSettings from "./pages/AdminSettings";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/admin/AdminRoute";
import SecurityHeaders from "./components/security/SecurityHeaders";
import SecurityMonitor from "./components/security/SecurityMonitor";
import AdminSecurityProvider from "./components/security/AdminSecurityProvider";
import StripeProvider from "./components/payment/StripeProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <SidebarProvider>
            <SecurityHeaders />
            <SecurityMonitor />
            <AdminSecurityProvider>
              <StripeProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin-auth" element={<AdminAuth />} />
                  <Route path="/email-verification" element={<EmailVerification />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  
                  {/* Protected routes */}
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
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Profile />
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  } />
                  <Route path="/order" element={
                    <ProtectedRoute>
                      <OrderFlow />
                    </ProtectedRoute>
                  } />
                  <Route path="/billing" element={
                    <ProtectedRoute>
                      <Billing />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/help" element={
                    <ProtectedRoute>
                      <Help />
                    </ProtectedRoute>
                  } />
                  <Route path="/referrals" element={
                    <ProtectedRoute>
                      <Referrals />
                    </ProtectedRoute>
                  } />
                  
                  {/* Admin routes */}
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
                      <AdminAnalytics />
                    </AdminRoute>
                  } />
                  <Route path="/management/settings" element={
                    <AdminRoute>
                      <AdminSettings />
                    </AdminRoute>
                  } />
                  
                  {/* 404 route */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </StripeProvider>
            </AdminSecurityProvider>
          </SidebarProvider>
        </BrowserRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
