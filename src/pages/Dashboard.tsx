
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Image, 
  Download, 
  FileText, 
  Bell,
  Calendar,
  Search
} from 'lucide-react';
import WelcomeSection from '@/components/dashboard/WelcomeSection';
import RecentActivity from '@/components/dashboard/RecentActivity';
import OrdersOverview from '@/components/dashboard/OrdersOverview';
import AIToolsQuickAccess from '@/components/dashboard/AIToolsQuickAccess';
import ProfileBilling from '@/components/dashboard/ProfileBilling';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-600 mt-1">
              Schnellstart: Ihre Bilder in wenigen Klicks optimieren
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Benachrichtigungen
            </Button>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Neue Bestellung
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <WelcomeSection />
            <RecentActivity />
            <OrdersOverview />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            <AIToolsQuickAccess />
            <ProfileBilling />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
