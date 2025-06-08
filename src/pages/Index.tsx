
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import UnifiedLoading from '@/components/ui/unified-loading';

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/auth', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center space-y-2 mb-4">
          <h1 className="text-2xl font-light text-foreground">
            FotoEdit Pro
          </h1>
          <p className="text-sm text-muted-foreground font-light">
            Professionelle Immobilienfoto-Bearbeitung
          </p>
        </div>
        
        <UnifiedLoading 
          size="lg" 
          text="Einen Moment bitte..." 
          variant="minimal"
        />
      </div>
    </div>
  );
};

export default Index;
