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
        <div className="flex items-center gap-2 mb-2">
          <div className="w-5 h-5 bg-black/10 rounded-lg flex items-center justify-center">
            <Info className="w-3 h-3 text-black" />
          </div>
          <h4 className="text-sm font-semibold text-black">Video Guidelines</h4>
        </div>
        <p className="text-sm text-black/80 mb-3 leading-relaxed">
          Bitte lesen Sie unsere Anleitung durch, damit wir Ihnen am Ende die bestmögliche Bearbeitung liefern können.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/guidelines')} 
          className="text-black border-black/30 hover:bg-black/10 hover:border-black/50 transition-all duration-200 h-7 px-3 text-sm bg-white/80"
        >
          <ExternalLink className="w-4 h-4 mr-1" />
          Guidelines
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProTipCard;