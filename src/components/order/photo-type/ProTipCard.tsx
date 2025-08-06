import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProTipCard = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-gradient-to-r from-success/5 to-success/10 border-success/20 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base text-foreground flex items-center gap-2">
          <div className="w-6 h-6 bg-success/10 rounded-lg flex items-center justify-center">
            <Info className="w-3 h-3 text-success" />
          </div>
          Pro-Tipp für beste Ergebnisse
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-3 text-xs leading-tight">
          Für optimale Bildqualität empfehlen wir, unsere detaillierten Guidelines zu befolgen.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/guidelines')} 
          className="text-success border-success/30 hover:bg-success/5 hover:border-success/50 transition-all duration-200 h-7 px-3 text-xs"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          Tipps & Tricks
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProTipCard;