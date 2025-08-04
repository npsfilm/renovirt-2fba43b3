import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
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

    if (newEmail.trim() === user.email) {
      toast({
        title: "Fehler",
        description: "Die neue E-Mail-Adresse ist identisch mit der aktuellen.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const { updateEmail } = useAuth();
      await updateEmail(newEmail.trim());

      toast({
        title: "E-Mail-Adresse geändert",
        description: "Bitte überprüfen Sie Ihre neue E-Mail-Adresse für den Bestätigungslink.",
      });

      setNewEmail('');
      onClose();
      
      // Seite neu laden, um die neue E-Mail anzuzeigen
      window.location.reload();
    } catch (error: any) {
      console.error('Error updating email:', error);
      toast({
        title: "Fehler",
        description: error.message || "Die E-Mail-Adresse konnte nicht geändert werden.",
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
              Nach der Änderung erhalten Sie eine Bestätigungs-E-Mail an Ihre neue Adresse. 
              Ihre aktuelle E-Mail-Adresse wird erst nach der Bestätigung ungültig.
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
                'E-Mail ändern'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};