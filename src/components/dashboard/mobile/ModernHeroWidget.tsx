import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Play, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const ModernHeroWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Fetch customer profile data
  const { data: customerProfile } = useQuery({
    queryKey: ['customer-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from('customer_profiles')
        .select('salutation, last_name')
        .eq('user_id', user.id)
        .single();
      if (error) return null;
      return data;
    },
    enabled: !!user?.id
  });

  // Check for incomplete orders (continue where left off)
  const { data: incompleteOrder } = useQuery({
    queryKey: ['incomplete-order', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from('orders')
        .select('id, status')
        .eq('user_id', user.id)
        .eq('payment_status', 'draft')
        .order('updated_at', { ascending: false })
        .limit(1)
        .single();
      return data;
    },
    enabled: !!user?.id
  });

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  const formatSalutation = (salutation: string) => {
    if (!salutation) return '';
    return salutation.charAt(0).toUpperCase() + salutation.slice(1).toLowerCase();
  };

  const getGreeting = () => {
    const timeGreeting = getTimeOfDay();
    
    if (customerProfile?.salutation && customerProfile?.last_name) {
      const formattedSalutation = formatSalutation(customerProfile.salutation);
      const formattedLastName = customerProfile.last_name.charAt(0).toUpperCase() + customerProfile.last_name.slice(1).toLowerCase();
      return `${timeGreeting}, ${formattedSalutation} ${formattedLastName}`;
    }

    if (user?.user_metadata?.first_name) {
      return `${timeGreeting}, ${user.user_metadata.first_name}`;
    }

    if (user?.email) {
      const emailUsername = user.email.split('@')[0];
      if (emailUsername.length >= 2 && !/^\d+$/.test(emailUsername)) {
        return `${timeGreeting}, ${emailUsername}`;
      }
    }

    return timeGreeting;
  };

  return (
    <div className="px-4">
      <Card className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-card to-accent/5 border-border/50 shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Greeting */}
            <div className="space-y-1">
              <h1 className="text-2xl font-light text-foreground tracking-tight">
                {getGreeting()}
              </h1>
              <p className="text-sm text-muted-foreground font-light">
                Bereit für perfekte Bildbearbeitung?
              </p>
            </div>

            {/* Continue where left off or main action */}
            {incompleteOrder ? (
              <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <Play className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Bestellung fortsetzen
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Bestellung #{incompleteOrder.id.slice(-8)}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate('/order')} 
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Fortsetzen
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/order')}
                    className="border-border bg-background/50 hover:bg-accent/10"
                  >
                    Neu starten
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Quick Action Buttons */}
                <div className="flex gap-2">
                  <Button 
                    onClick={() => navigate('/order')} 
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Bilder hochladen
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => navigate('/orders')}
                    className="border-border bg-background/50 hover:bg-accent/10 transition-all duration-300"
                  >
                    <Zap className="w-4 h-4" />
                  </Button>
                </div>
                
                {/* Quick access link */}
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/orders')} 
                  className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Aktuelle Bestellungen ansehen
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernHeroWidget;