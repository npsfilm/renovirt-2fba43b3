
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EnhancedSecurityProvider } from '@/components/security/EnhancedSecurityProvider';
import { PostHogProvider } from '@/contexts/PostHogProvider';
import ErrorBoundary from '@/components/error/ErrorBoundary';
import Dashboard from '@/pages/Dashboard';
import Orders from '@/pages/Orders';
import Order from '@/pages/Order';
import Profile from '@/pages/Profile';
import Billing from '@/pages/Billing';
import Settings from '@/pages/Settings';
import Help from '@/pages/Help';
import Auth from '@/pages/Auth';
import OrderFlow from '@/pages/OrderFlow';
import Guidelines from '@/pages/Guidelines';
import Examples from '@/pages/Examples';
import Admin from '@/pages/Admin';
import AdminAuth from '@/pages/AdminAuth';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminOrders from '@/pages/AdminOrders';
import AdminCustomers from '@/pages/AdminCustomers';
import AdminAnalytics from '@/pages/AdminAnalytics';
import AdminSettings from '@/pages/AdminSettings';
import AdminRoute from '@/components/admin/AdminRoute';
import AdminHelpAnalytics from '@/pages/AdminHelpAnalytics';
import PaymentSuccess from '@/pages/PaymentSuccess';
import EmailVerification from '@/pages/EmailVerification';
import Onboarding from '@/pages/Onboarding';
import AGB from '@/pages/AGB';
import Privacy from '@/pages/Privacy';
import Impressum from '@/pages/Impressum';
import ResetPassword from '@/pages/ResetPassword';
import ProtectedRoute from '@/components/auth/ProtectedRoute';


const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PostHogProvider>
        <EnhancedSecurityProvider>
          <TooltipProvider>
          <BrowserRouter>
            <Routes>
              {/* Public Routes */}
              <Route path="/auth" element={<Auth />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/agb" element={<AGB />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/impressum" element={<Impressum />} />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <Navigate to="/dashboard" />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <Orders />
                </ProtectedRoute>
              } />
              <Route path="/order" element={
                <ProtectedRoute>
                  <Order />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
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
              <Route path="/examples" element={
                <ProtectedRoute>
                  <Examples />
                </ProtectedRoute>
              } />
              <Route path="/order-flow" element={
                <ProtectedRoute>
                  <OrderFlow />
                </ProtectedRoute>
              } />
              <Route path="/guidelines" element={
                <ProtectedRoute>
                  <Guidelines />
                </ProtectedRoute>
              } />

              {/* Admin Authentication Route */}
              <Route path="/admin-auth" element={<AdminAuth />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/dashboard" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="/admin/orders" element={
                <AdminRoute>
                  <AdminOrders />
                </AdminRoute>
              } />
              <Route path="/admin/customers" element={
                <AdminRoute>
                  <AdminCustomers />
                </AdminRoute>
              } />
              <Route path="/admin/analytics" element={
                <AdminRoute>
                  <AdminAnalytics />
                </AdminRoute>
              } />
              <Route path="/admin/settings" element={
                <AdminRoute>
                  <AdminSettings />
                </AdminRoute>
              } />
              <Route path="/admin/help-analytics" element={
                <AdminRoute>
                  <AdminHelpAnalytics />
                </AdminRoute>
              } />
              
              {/* Payment Success Route */}
              <Route path="/payment/success" element={
                <ProtectedRoute>
                  <ErrorBoundary>
                    <PaymentSuccess />
                  </ErrorBoundary>
                </ProtectedRoute>
              } />
            </Routes>
          </BrowserRouter>
          <Toaster />
          </TooltipProvider>
        </EnhancedSecurityProvider>
      </PostHogProvider>
    </QueryClientProvider>
  );
}

export default App;
