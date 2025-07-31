import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Loader2, Mail } from 'lucide-react';

interface EmailChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmailChangeModal = ({ isOpen, onClose }: EmailChangeModalProps) => {
  const [newEmail, setNewEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmail.trim()) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie eine neue E-Mail-Adresse ein.",
        variant: "destructive"
      });
      return;
    }

    if (!user) {
      toast({
        title: "Fehler",
        description: "Sie müssen angemeldet sein.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.functions.invoke('send-email-change-request', {
        body: {
          currentEmail: user.email,
          newEmail: newEmail.trim(),
          userId: user.id
        }
      });

      if (error) throw error;

      toast({
        title: "Anfrage gesendet",
        description: "Ihre E-Mail-Änderungsanfrage wurde an den Support gesendet. Sie erhalten bald eine Antwort.",
      });

      setNewEmail('');
      onClose();
    } catch (error) {
      console.error('Error sending email change request:', error);
      toast({
        title: "Fehler",
        description: "Die Anfrage konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            E-Mail-Adresse ändern
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currentEmail">Aktuelle E-Mail-Adresse</Label>
            <Input
              id="currentEmail"
              type="email"
              value={user?.email || ''}
              disabled
              className="bg-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="newEmail">Neue E-Mail-Adresse</Label>
            <Input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="ihre.neue@email.de"
              required
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>
              Ihre Anfrage wird an unseren Support gesendet. Nach der Prüfung erhalten Sie 
              eine E-Mail mit weiteren Anweisungen zur Bestätigung der Änderung.
            </p>
          </div>
          
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isLoading}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Wird gesendet...
                </>
              ) : (
                'Anfrage senden'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};