import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ForgotPasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ForgotPasswordDialog = ({ open, onOpenChange }: ForgotPasswordDialogProps) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({
        text: 'Bitte geben Sie Ihre E-Mail-Adresse ein.',
        type: 'error'
      });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setMessage({
          text: 'Es gab ein Problem beim Senden der E-Mail. Bitte versuchen Sie es erneut.',
          type: 'error'
        });
      } else {
        setMessage({
          text: 'Wenn ein Account mit dieser E-Mail existiert, senden wir Ihnen einen Link zum zurücksetzen.',
          type: 'success'
        });
        // Reset form after success
        setTimeout(() => {
          setEmail('');
          setMessage(null);
          onOpenChange(false);
        }, 3000);
      }
    } catch (error) {
      setMessage({
        text: 'Ein unerwarteter Fehler ist aufgetreten.',
        type: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setMessage(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full max-w-md bg-background border-border">
        <DialogHeader className="text-center space-y-2">
          <DialogTitle className="text-xl font-semibold text-foreground">
            Passwort vergessen
          </DialogTitle>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
          </p>
        </DialogHeader>

        <form onSubmit={handleResetPassword} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-foreground">
              E-Mail-Adresse
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="ihre.email@beispiel.de"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-10 h-10 bg-input border-border text-foreground placeholder-muted-foreground transition-all duration-200 focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full h-10 font-medium bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200" 
            disabled={loading}
          >
            {loading ? 'Wird gesendet...' : 'Passwort zurücksetzen'}
          </Button>
        </form>

        {message && (
          <Alert variant={message.type === 'error' ? 'destructive' : 'default'} className="mt-4">
            <AlertDescription className="text-sm">
              {message.text}
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;