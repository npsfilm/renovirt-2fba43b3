
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import EnhancedSecurityProvider from '@/components/security/EnhancedSecurityProvider';
import Dashboard from '@/pages/Dashboard';
import Orders from '@/pages/Orders';
import Order from '@/pages/Order';
import Profile from '@/pages/Profile';
import Billing from '@/pages/Billing';
import Settings from '@/pages/Settings';
import Help from '@/pages/Help';
import Auth from '@/pages/Auth';
import OrderFlow from '@/pages/OrderFlow';
import Referrals from '@/pages/Referrals';
import Guidelines from '@/pages/Guidelines';
import Admin from '@/pages/Admin';
import AdminAuth from '@/pages/AdminAuth';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminOrders from '@/pages/AdminOrders';
import AdminCustomers from '@/pages/AdminCustomers';
import AdminReferrals from '@/pages/AdminReferrals';
import AdminAnalytics from '@/pages/AdminAnalytics';
import AdminSettings from '@/pages/AdminSettings';
import AdminRoute from '@/components/admin/AdminRoute';
import AdminHelpAnalytics from '@/pages/AdminHelpAnalytics';
import EmailVerification from '@/pages/EmailVerification';
import Onboarding from '@/pages/Onboarding';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EnhancedSecurityProvider>
        <TooltipProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order" element={<Order />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/billing" element={<Billing />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/email-verification" element={<EmailVerification />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/order-flow" element={<OrderFlow />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/guidelines" element={<Guidelines />} />

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
              <Route path="/admin/referrals" element={
                <AdminRoute>
                  <AdminReferrals />
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
            </Routes>
          </BrowserRouter>
          <Toaster />
        </TooltipProvider>
      </EnhancedSecurityProvider>
    </QueryClientProvider>
  );
}

export default App;
