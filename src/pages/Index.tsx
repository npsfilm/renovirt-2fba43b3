
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

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

  // Elegant loading state following Ive's principles - minimal, focused
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20 flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-light text-foreground">
            FotoEdit Pro
          </h1>
          <p className="text-sm text-muted-foreground font-light">
            Einen Moment bitte...
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
