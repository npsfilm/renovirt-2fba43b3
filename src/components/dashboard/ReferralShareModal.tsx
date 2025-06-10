
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Copy, Share2, Mail, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReferralShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode: string;
}

const ReferralShareModal = ({ isOpen, onClose, referralCode }: ReferralShareModalProps) => {
  const { toast } = useToast();

  const shareText = `Entdecken Sie Renovirt - professionelle Bildbearbeitung für Immobilien! Mit meinem Empfehlungscode "${referralCode}" können Sie sofort starten. Jetzt registrieren!`;
  const shareUrl = `${window.location.origin}/auth?ref=${referralCode}`;

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Kopiert!",
        description: "Text wurde in die Zwischenablage kopiert."
      });
    } catch (err) {
      toast({
        title: "Fehler",
        description: "Konnte nicht in die Zwischenablage kopieren.",
        variant: "destructive"
      });
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Renovirt Empfehlung',
          text: shareText,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled or error occurred
      }
    } else {
      copyToClipboard(shareText);
    }
  };

  const handleEmailShare = () => {
    const subject = 'Empfehlung: Renovirt - Professionelle Bildbearbeitung';
    const body = `${shareText}\n\nRegistrieren Sie sich hier: ${shareUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleWhatsAppShare = () => {
    const whatsappText = `${shareText}\n${shareUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappText)}`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Empfehlungscode teilen</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Referral Code */}
          <div>
            <label className="block text-sm font-medium mb-2">Ihr Empfehlungscode:</label>
            <div className="flex space-x-2">
              <Input 
                value={referralCode} 
                readOnly 
                className="font-mono text-center" 
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(referralCode)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Share URL */}
          <div>
            <label className="block text-sm font-medium mb-2">Direkter Registrierungs-Link:</label>
            <div className="flex space-x-2">
              <Input 
                value={shareUrl} 
                readOnly 
                className="text-sm" 
              />
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => copyToClipboard(shareUrl)}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Share Text */}
          <div>
            <label className="block text-sm font-medium mb-2">Empfehlungstext:</label>
            <div className="p-3 bg-muted rounded-lg text-sm">
              {shareText}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-2 w-full"
              onClick={() => copyToClipboard(shareText)}
            >
              <Copy className="w-4 h-4 mr-2" />
              Text kopieren
            </Button>
          </div>

          {/* Share Buttons */}
          <div className="grid grid-cols-1 gap-2">
            <Button 
              variant="outline" 
              onClick={handleNativeShare}
              className="w-full"
            >
              <Share2 className="w-4 h-4 mr-2" />
              Teilen
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleEmailShare}
              className="w-full"
            >
              <Mail className="w-4 h-4 mr-2" />
              Per E-Mail teilen
            </Button>
            
            <Button 
              variant="outline" 
              onClick={handleWhatsAppShare}
              className="w-full"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Per WhatsApp teilen
            </Button>
          </div>

          <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
            <strong>Hinweis:</strong> Sie erhalten 10 kostenfreie Bildbearbeitungen, sobald sich jemand mit Ihrem Code registriert und seine erste Bestellung aufgibt. Die Freigabe erfolgt durch unseren Administrator.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReferralShareModal;
