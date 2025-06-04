import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SecurityHeaders from '@/components/security/SecurityHeaders';

const Auth = lazy(() => import('@/pages/Auth'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Onboarding = lazy(() => import('@/pages/Onboarding'));
const ProtectedRoute = lazy(() => import('@/components/auth/ProtectedRoute'));
const AdminDashboard = lazy(() => import('@/pages/AdminDashboard'));
const AdminAuth = lazy(() => import('@/pages/AdminAuth'));
const OrdersPage = lazy(() => import('@/pages/OrdersPage'));
const OrderFlow = lazy(() => import('@/pages/OrderFlow'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SecurityHeaders />
        <Toaster />
        <BrowserRouter>
          <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Laden...</p></div>}>
            <Routes>
              <Route path="/auth" element={<Auth />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/" element={<Navigate to="/dashboard" />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrdersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/order-flow"
                element={
                  <ProtectedRoute>
                    <OrderFlow />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="/management" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin-auth" element={<AdminAuth />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
