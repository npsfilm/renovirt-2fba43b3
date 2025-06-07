
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const ModernHeroSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Guten Morgen';
    if (hour < 18) return 'Guten Tag';
    return 'Guten Abend';
  };

  const firstName = user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'dort';

  return (
    <div className="relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl" />
      
      <Card className="relative border-0 bg-card/80 backdrop-blur-sm shadow-lg">
        <CardContent className="p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-light text-foreground tracking-tight">
                  {getTimeOfDay()}, {firstName}
                </h1>
                <p className="text-lg text-subtle font-light">
                  Bereit für perfekte Bildbearbeitung?
                </p>
              </div>
              
              <div className="flex flex-wrap gap-3">
                <Button 
                  onClick={() => navigate('/order')}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all duration-300 hover:shadow-lg hover:scale-105"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Neue Bestellung
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/order')}
                  className="border-border bg-background/50 hover:bg-accent/10 transition-all duration-300"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Bilder hochladen
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-subtle hover:text-foreground hover:bg-accent/10 transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  KI-Tools
                </Button>
              </div>
            </div>

            {/* Status indicator */}
            <div className="lg:text-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 rounded-full">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                <span className="text-sm font-medium text-success">Alle Systeme online</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ModernHeroSection;
