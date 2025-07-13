import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
const ModernHeroSection = () => {
  const {
    user
  } = useAuth();
  const navigate = useNavigate();

  // Fetch customer profile data
  const {
    data: customerProfile
  } = useQuery({
    queryKey: ['customer-profile', user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const {
        data,
        error
      } = await supabase.from('customer_profiles').select('salutation, last_name').eq('user_id', user.id).single();
      if (error) {
        console.log('Profile not found, using fallback');
        return null;
      }
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
    
    // First priority: Customer profile with salutation and last name
    if (customerProfile?.salutation && customerProfile?.last_name) {
      const formattedSalutation = formatSalutation(customerProfile.salutation);
      const formattedLastName = customerProfile.last_name.charAt(0).toUpperCase() + customerProfile.last_name.slice(1).toLowerCase();
      return `${timeGreeting}, ${formattedSalutation} ${formattedLastName}`;
    }

    // Second priority: First name from user metadata
    if (user?.user_metadata?.first_name) {
      return `${timeGreeting}, ${user.user_metadata.first_name}`;
    }

    // Third priority: Parse email for username (with validation)
    if (user?.email) {
      const emailUsername = user.email.split('@')[0];
      // Only use email username if it looks like a real name (at least 2 chars, not just numbers)
      if (emailUsername.length >= 2 && !/^\d+$/.test(emailUsername)) {
        return `${timeGreeting}, ${emailUsername}`;
      }
    }

    // Final fallback: Just time greeting without name
    return timeGreeting;
  };
  return <div className="relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl" />
      
      <Card className="relative border-0 bg-card/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-8 py-[61px]">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-light text-foreground tracking-tight">
                  {getGreeting()}
                </h1>
                <p className="text-lg text-subtle font-light">
                  Bereit für perfekte Bildbearbeitung?
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button onClick={() => navigate('/order')} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105">
                  <Upload className="w-4 h-4 mr-2" />
                  Bilder hochladen
                </Button>
                <Button variant="outline" onClick={() => navigate('/orders')} className="border-border bg-background/50 hover:bg-accent/10 transition-all duration-300">
                  Aktuelle Bestellungen ansehen
                </Button>
              </div>
            </div>

            {/* Status indicator */}
            <div className="lg:text-right">
              
            </div>
          </div>
        </CardContent>
      </Card>
    </div>;
};
export default ModernHeroSection;