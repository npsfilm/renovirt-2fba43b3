import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Info, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const ProTipCard = () => {
  const navigate = useNavigate();
  return <Card className="bg-gradient-to-r from-success/5 to-success/10 border-success/20 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg text-foreground flex items-center gap-3">
          <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
            <Info className="w-4 h-4 text-success" />
          </div>
          Pro-Tipp für beste Ergebnisse
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <p className="text-muted-foreground mb-4 leading-relaxed text-sm">
          Für optimale Bildqualität und professionelle Ergebnisse empfehlen wir, unsere detaillierten Guidelines zu befolgen. 
          Dort finden Sie wertvolle Tipps zur Aufnahmetechnik und Bildoptimierung.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          
          <Button variant="outline" size="sm" onClick={() => navigate('/guidelines')} className="text-success border-success/30 hover:bg-success/5 hover:border-success/50 transition-all duration-200">
            <ExternalLink className="w-4 h-4 mr-2" />
            Tipps & Tricks
          </Button>
        </div>
      </CardContent>
    </Card>;
};
export default ProTipCard;