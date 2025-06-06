
import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const WelcomeSection = () => {
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
  
  // Get user's greeting name (Anrede + Nachname)
  const getGreetingName = () => {
    if (customerProfile?.salutation && customerProfile?.last_name) {
      return `${customerProfile.salutation} ${customerProfile.last_name}`;
    }
    // Fallback to first name or email
    return customerProfile?.first_name || user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Nutzer';
  };

  const handlePhotoUpload = () => {
    navigate('/order-flow');
  };

  const handleNewOrder = () => {
    navigate('/order-flow');
  };

  const handleLearnMore = () => {
    navigate('/help');
  };

  return (
    <Card className="bg-gradient-to-r from-surface-muted to-surface border-border">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              Willkommen zurück, {getGreetingName()}! 👋
            </h2>
            <p className="text-muted text-sm">
              Laden Sie hier Ihre neuen Fotos hoch und lassen Sie sie professionell bearbeiten.
            </p>
          </div>
          <div className="flex space-x-3">
            <Button size="sm" onClick={handlePhotoUpload}>
              <Upload className="w-4 h-4 mr-2" />
              Fotos hochladen
            </Button>
            <Button variant="outline" size="sm" onClick={handleNewOrder}>
              <Plus className="w-4 h-4 mr-2" />
              Neue Bestellung
            </Button>
          </div>
        </div>
        
        {/* Empty State Message */}
        <div className="mt-4 text-center py-4 bg-surface rounded-lg border border-border">
          <p className="text-muted text-sm">
            Noch keine Bestellung? Testen Sie jetzt Ihre 3 kostenlosen Bilder.
          </p>
          <Button variant="link" size="sm" className="mt-1" onClick={handleLearnMore}>
            Mehr erfahren →
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
