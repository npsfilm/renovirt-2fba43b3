
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useInactivityLogout } from "@/hooks/useInactivityLogout";
import ErrorBoundary from "@/components/error/ErrorBoundary";
import EnhancedSecurityProvider from "@/components/security/EnhancedSecurityProvider";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import Order from "@/pages/Order";
import Orders from "@/pages/Orders";
import Admin from "@/pages/Admin";
import AdminOrders from "@/pages/AdminOrders";
import AdminOrderDetails from "@/pages/AdminOrderDetails";
import AdminUsers from "@/pages/AdminUsers";
import AdminPackages from "@/pages/AdminPackages";
import AdminAddons from "@/pages/AdminAddons";
import Settings from "@/pages/Settings";
import Billing from "@/pages/Billing";
import Profile from "@/pages/Profile";
import Referrals from "@/pages/Referrals";
import Help from "@/pages/Help";
import OrderFlow from "@/pages/OrderFlow";
import Impressum from "@/pages/Impressum";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppRoutes = () => {
  const { user, loading } = useAuth();
  useInactivityLogout();

  if (loading) {
    return <Index />;
  }

  return (
    <Routes>
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <Navigate to="/auth" replace />} />
      <Route path="/auth" element={user ? <Navigate to="/dashboard" replace /> : <Auth />} />
      <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/auth" replace />} />
      <Route path="/order" element={user ? <Order /> : <Navigate to="/auth" replace />} />
      <Route path="/orders" element={user ? <Orders /> : <Navigate to="/auth" replace />} />
      <Route path="/billing" element={user ? <Billing /> : <Navigate to="/auth" replace />} />
      <Route path="/profile" element={user ? <Profile /> : <Navigate to="/auth" replace />} />
      <Route path="/referrals" element={user ? <Referrals /> : <Navigate to="/auth" replace />} />
      <Route path="/help" element={user ? <Help /> : <Navigate to="/auth" replace />} />
      <Route path="/order-flow" element={user ? <OrderFlow /> : <Navigate to="/auth" replace />} />
      <Route path="/settings" element={user ? <Settings /> : <Navigate to="/auth" replace />} />
      <Route path="/impressum" element={<Impressum />} />
      <Route path="/admin" element={user?.role === 'admin' ? <Admin /> : <Navigate to="/dashboard" replace />} >
        <Route index element={<AdminOrders />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="orders/:orderId" element={<AdminOrderDetails />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="packages" element={<AdminPackages />} />
        <Route path="addons" element={<AdminAddons />} />
      </Route>
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
        <ErrorBoundary>
          <EnhancedSecurityProvider>
            <AppRoutes />
          </EnhancedSecurityProvider>
        </ErrorBoundary>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
