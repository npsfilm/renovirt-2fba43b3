
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ImprovedWelcomeSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: customerProfile } = useQuery({
    queryKey: ['customer-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data;
    },
    enabled: !!user?.id,
  });
  
  // Get time-based greeting
  const getTimeBasedGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  // Get user's greeting name (Anrede + Nachname)
  const getGreetingName = () => {
    if (customerProfile?.salutation && customerProfile?.last_name) {
      return `${customerProfile.salutation} ${customerProfile.last_name}`;
    }
    return customerProfile?.first_name || user?.user_metadata?.first_name || 'Nutzer';
  };

  const handlePhotoUpload = () => {
    navigate('/order');
  };

  const handleViewOrders = () => {
    navigate('/orders');
  };

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardContent className="p-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            {getTimeBasedGreeting()}, {getGreetingName()} – bereit für Ihre nächsten Fotos? 👋
          </h2>
          
          <div className="flex justify-center space-x-4 mt-6">
            <Button size="lg" onClick={handlePhotoUpload} className="px-8 py-3">
              <Upload className="w-5 h-5 mr-3" />
              📁 Fotos hochladen
            </Button>
            <Button variant="outline" size="lg" onClick={handleViewOrders} className="px-8 py-3">
              <FileText className="w-5 h-5 mr-3" />
              📦 Aktuelle Bestellungen
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImprovedWelcomeSection;
