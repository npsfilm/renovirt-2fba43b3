
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Mail, Send } from 'lucide-react';

interface SupportContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  searchQuery: string;
  aiResult: string;
}

const SupportContactModal = ({ isOpen, onClose, searchQuery, aiResult }: SupportContactModalProps) => {
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && searchQuery) {
      setSubject(`Hilfe benötigt: ${searchQuery.slice(0, 50)}${searchQuery.length > 50 ? '...' : ''}`);
      
      const prefilledMessage = `Hallo liebes Support-Team,

ich habe nach einer Lösung für mein Problem gesucht:
"${searchQuery}"

Die AI-Antwort war:
"${aiResult.slice(0, 200)}${aiResult.length > 200 ? '...' : ''}"

Diese Antwort konnte mir leider nicht vollständig weiterhelfen. Können Sie mir bitte persönlich dabei helfen?

Vielen Dank für Ihre Unterstützung!`;

      setMessage(prefilledMessage);
    }
  }, [isOpen, searchQuery, aiResult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    setIsSubmitting(true);
    try {
      // Hier würde normalerweise der API-Call zum Senden der Support-Nachricht stehen
      console.log('Support message:', { subject, message });
      
      toast({
        title: "Nachricht gesendet!",
        description: "Ihr Support-Team wird sich in Kürze bei Ihnen melden.",
      });
      
      onClose();
      setSubject('');
      setMessage('');
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Die Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es erneut.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Support kontaktieren
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject">Betreff</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Kurze Beschreibung Ihres Anliegens"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="message">Nachricht</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Beschreiben Sie Ihr Problem ausführlich..."
              rows={12}
              required
              className="resize-none"
            />
          </div>
          
          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Abbrechen
            </Button>
            <Button type="submit" disabled={isSubmitting || !subject.trim() || !message.trim()}>
              {isSubmitting ? (
                <>
                  <Send className="w-4 h-4 mr-2 animate-pulse" />
                  Wird gesendet...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Nachricht senden
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SupportContactModal;
