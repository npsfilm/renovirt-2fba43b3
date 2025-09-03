import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProTipCard = () => {
  const navigate = useNavigate();
  
  return (
    <Card className="bg-[#FF972E]/70 border-[#FF972E] border-2 shadow-lg">
      <CardContent className="p-2 md:p-3">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-4 h-4 bg-white/20 rounded-lg flex items-center justify-center">
            <Info className="w-2.5 h-2.5 text-white" />
          </div>
          <h4 className="text-xs font-semibold text-white">Video Guidelines</h4>
        </div>
        <p className="text-xs text-white/90 mb-2 leading-tight">
          Bitte lesen Sie unsere Anleitung durch, damit wir Ihnen am Ende die bestmögliche Bearbeitung liefern können.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/guidelines')} 
          className="text-white border-white/50 hover:bg-white/20 hover:border-white transition-all duration-200 h-5 px-2 text-xs bg-white/10"
        >
          <ExternalLink className="w-2.5 h-2.5 mr-1" />
          Guidelines
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProTipCard;