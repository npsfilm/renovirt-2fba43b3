import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatNameWithInitial } from '@/utils/nameUtils';

// Temporarily use mock data until database structure is updated
interface FeatureComment {
  id: string;
  feature_request_id: string;
  user_id: string;
  content: string;
  is_admin_response: boolean;
  created_at: string;
  customer_profiles?: {
    first_name: string;
    last_name: string;
  };
}

interface FeatureCommentsProps {
  featureRequestId: string;
  isOpen: boolean;
}

export const FeatureComments: React.FC<FeatureCommentsProps> = ({
  featureRequestId,
  isOpen
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [comments, setComments] = useState<FeatureComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [featureRequestId, isOpen]);

  const fetchComments = async () => {
    try {
      // Mock data for now - replace with actual database query when schema is ready
      setComments([
        {
          id: '1',
          feature_request_id: featureRequestId,
          user_id: 'user1',
          content: 'Das ist ein großartiger Vorschlag! Würde definitiv helfen.',
          is_admin_response: false,
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          customer_profiles: {
            first_name: 'Max',
            last_name: 'Mustermann'
          }
        },
        {
          id: '2',
          feature_request_id: featureRequestId,
          user_id: 'admin1',
          content: 'Vielen Dank für den Vorschlag! Wir schauen uns das genauer an und melden uns bald zurück.',
          is_admin_response: true,
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          customer_profiles: {
            first_name: 'Admin',
            last_name: 'Team'
          }
        }
      ]);
    } catch (error) {
      console.error('Error fetching comments:', error);
      toast({
        title: "Fehler",
        description: "Kommentare konnten nicht geladen werden.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!user || !newComment.trim()) return;

    setIsSubmitting(true);
    try {
      // Mock implementation - replace with actual database insert when schema is ready
      const newCommentData: FeatureComment = {
        id: Date.now().toString(),
        feature_request_id: featureRequestId,
        user_id: user.id,
        content: newComment.trim(),
        is_admin_response: false,
        created_at: new Date().toISOString(),
        customer_profiles: {
          first_name: 'Sie',
          last_name: ''
        }
      };

      setComments(prev => [...prev, newCommentData]);
      setNewComment('');
      
      toast({
        title: "Kommentar hinzugefügt",
        description: "Ihr Kommentar wurde erfolgreich hinzugefügt.",
      });
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Fehler",
        description: "Kommentar konnte nicht hinzugefügt werden.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const getInitials = (comment: FeatureComment) => {
    const profile = comment.customer_profiles;
    if (profile?.first_name && profile?.last_name) {
      return `${profile.first_name[0]}${profile.last_name[0]}`;
    }
    return 'U';
  };

  const getDisplayName = (comment: FeatureComment) => {
    const profile = comment.customer_profiles;
    if (profile?.first_name && profile?.last_name) {
      return formatNameWithInitial(profile.first_name, profile.last_name);
    }
    return 'Benutzer';
  };

  return (
    <Card className="p-6 bg-background border border-border">
      <div className="flex items-center gap-2 mb-4">
        <MessageCircle className="h-5 w-5 text-muted-foreground" />
        <h3 className="text-lg font-semibold">Diskussion</h3>
        <Badge variant="secondary" className="text-xs">
          {comments.length}
        </Badge>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto">
        {loading ? (
          <div className="text-center py-4 text-muted-foreground">
            Kommentare werden geladen...
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Noch keine Kommentare vorhanden.</p>
            <p className="text-sm">Seien Sie der Erste, der die Diskussion startet!</p>
          </div>
        ) : (
          comments.map((comment, index) => (
            <div key={comment.id}>
              <div className="flex gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {getInitials(comment)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {getDisplayName(comment)}
                    </span>
                    {comment.is_admin_response && (
                      <Badge variant="default" className="text-xs">
                        Admin
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(comment.created_at), {
                        addSuffix: true,
                        locale: de
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              </div>
              {index < comments.length - 1 && <Separator className="my-4" />}
            </div>
          ))
        )}
      </div>

      {user && (
        <>
          <Separator className="my-4" />
          <div className="space-y-3">
            <Textarea
              placeholder="Fügen Sie einen Kommentar hinzu..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="min-h-[80px] resize-none"
              maxLength={1000}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                {newComment.length}/1000 Zeichen
              </span>
              <Button
                onClick={handleSubmitComment}
                disabled={!newComment.trim() || isSubmitting}
                size="sm"
                className="gap-2"
              >
                <Send className="h-4 w-4" />
                {isSubmitting ? 'Wird gesendet...' : 'Kommentar senden'}
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};