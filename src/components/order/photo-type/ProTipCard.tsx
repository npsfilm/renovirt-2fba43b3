import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProTipCard = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-gradient-to-r from-success/5 to-success/10 border-success/20 shadow-sm">
      <CardContent className="p-3 md:p-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-success/10 rounded-lg flex items-center justify-center">
            <Info className="w-3 h-3 text-success" />
          </div>
          <h4 className="text-sm font-semibold text-foreground">Video Guidelines</h4>
        </div>
        <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
          Bitte lesen Sie unsere Anleitung durch, damit wir Ihnen am Ende die bestmögliche Bearbeitung liefern können.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/guidelines')} 
          className="text-success border-success/30 hover:bg-success/5 hover:border-success/50 transition-all duration-200 h-6 px-2 text-xs"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          Guidelines
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProTipCard;