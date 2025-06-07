
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReferralShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
}

const ReferralShareModal = ({ isOpen, onClose, referralCode }: ReferralShareModalProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareText = `🎨 Entdecke Renovirt - Professionelle Bildbearbeitung in nur 24-48h!

✨ Was macht Renovirt besonders?
• Professionelle Retusche von Immobilienfotos
• Schnelle Bearbeitung in 24-48 Stunden
• Faire Preise ab 2€ pro Bild
• Einfacher Upload und Download

🎁 Exklusiv für dich: Mit meinem Empfehlungscode "${referralCode}" erhältst du 10 kostenlose Bildbearbeitungen zum Ausprobieren!

Perfekt für Immobilienmakler, Fotografen und alle, die professionelle Bildbearbeitung brauchen.

Jetzt ausprobieren: renovirt.de`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      toast({
        title: "Text kopiert!",
        description: "Der Empfehlungstext wurde in die Zwischenablage kopiert."
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Fehler",
        description: "Konnte nicht in die Zwischenablage kopieren.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Renovirt weiterempfehlen</span>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-subtle">
            Hier ist ein fertiger Text, den Sie an Freunde und Kollegen weiterleiten können:
          </p>
          
          <div className="relative">
            <Textarea
              value={shareText}
              readOnly
              className="min-h-[300px] text-sm font-mono bg-muted border-border resize-none"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="text-xs text-subtle">
              Der Text enthält Ihren persönlichen Empfehlungscode: <span className="font-mono font-semibold">{referralCode}</span>
            </div>
            
            <Button onClick={copyToClipboard} className="flex items-center space-x-2">
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Kopiert!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Text kopieren</span>
                </>
              )}
            </Button>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 text-sm">
            <p className="font-medium mb-2">💡 Tipp:</p>
            <p className="text-subtle">
              Teilen Sie diesen Text per E-Mail, WhatsApp, LinkedIn oder in sozialen Netzwerken. 
              Sobald sich jemand mit Ihrem Code registriert und seine erste Bestellung aufgibt, 
              erhalten Sie 10 kostenfreie Bildbearbeitungen!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralShareModal;
