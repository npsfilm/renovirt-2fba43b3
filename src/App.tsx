
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
const Orders = lazy(() => import('@/pages/Orders'));
const OrderFlow = lazy(() => import('@/pages/OrderFlow'));
const Profile = lazy(() => import('@/pages/Profile'));
const Help = lazy(() => import('@/pages/Help'));
const NotFound = lazy(() => import('@/pages/NotFound'));

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
              <Route path="/help" element={<Help />} />
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
                    <Orders />
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
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route path="/management" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
              <Route path="/admin-auth" element={<AdminAuth />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
