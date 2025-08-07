import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import UpvoteButton from './UpvoteButton';
import { FeatureComments } from './FeatureComments';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { 
  Calendar, 
  User, 
  MessageCircle, 
  TrendingUp,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  PlayCircle
 } from 'lucide-react';
import type { FeatureRequest } from '@/types/feedback';
import { formatNameWithInitial } from '@/utils/nameUtils';

interface FeatureRequestModalProps {
  featureRequest: FeatureRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const FeatureRequestModal: React.FC<FeatureRequestModalProps> = ({
  featureRequest,
  isOpen,
  onClose
}) => {
  const [showComments, setShowComments] = useState(false);

  if (!featureRequest) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'in_progress':
        return <PlayCircle className="h-4 w-4" />;
      case 'planned':
        return <Calendar className="h-4 w-4" />;
      case 'under_review':
        return <AlertCircle className="h-4 w-4" />;
      case 'rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'planned':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Abgeschlossen';
      case 'in_progress': return 'In Bearbeitung';
      case 'planned': return 'Geplant';
      case 'under_review': return 'Wird überprüft';
      case 'rejected': return 'Abgelehnt';
      default: return 'Offen';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical': return 'Kritisch';
      case 'high': return 'Hoch';
      case 'medium': return 'Mittel';
      default: return 'Niedrig';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold pr-8">
            {featureRequest.title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Meta Information */}
          <div className="flex flex-wrap gap-3 items-center">
            <Badge className={`gap-1 ${getStatusColor(featureRequest.status)}`}>
              {getStatusIcon(featureRequest.status)}
              {getStatusLabel(featureRequest.status)}
            </Badge>
            
            <Badge className={`gap-1 ${getPriorityColor(featureRequest.priority)}`}>
              <TrendingUp className="h-3 w-3" />
              {getPriorityLabel(featureRequest.priority)}
            </Badge>

            {featureRequest.feature_categories && (
              <Badge 
                variant="outline" 
                style={{ 
                  borderColor: featureRequest.feature_categories.color,
                  color: featureRequest.feature_categories.color 
                }}
              >
                {featureRequest.feature_categories.name}
              </Badge>
            )}
          </div>

          {/* Meta Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-muted-foreground">Erstellt von: </span>
                <span className="font-medium">
                  {featureRequest.customer_profiles 
                    ? formatNameWithInitial(
                        featureRequest.customer_profiles.first_name,
                        featureRequest.customer_profiles.last_name
                      )
                    : 'Unbekannt'
                  }
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-muted-foreground">Erstellt: </span>
                <span className="font-medium">
                  {formatDistanceToNow(new Date(featureRequest.created_at), {
                    addSuffix: true,
                    locale: de
                  })}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
              <div className="text-sm">
                <span className="text-muted-foreground">Kommentare: </span>
                <span className="font-medium">{featureRequest.comment_count}</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">Beschreibung</h3>
            <p className="text-foreground leading-relaxed whitespace-pre-wrap">
              {featureRequest.description}
            </p>
          </div>

          {/* Admin Response */}
          {featureRequest.admin_response && (
            <div className="p-4 border-l-4 border-primary bg-primary/5">
              <h3 className="font-semibold mb-2 text-primary">Admin-Antwort</h3>
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {featureRequest.admin_response}
              </p>
            </div>
          )}

          {/* Estimated Completion */}
          {featureRequest.estimated_completion && (
            <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <Calendar className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                <strong>Geschätzte Fertigstellung:</strong> {featureRequest.estimated_completion}
              </span>
            </div>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex items-center justify-between">
            <UpvoteButton
              requestId={featureRequest.id}
              initialCount={featureRequest.upvote_count}
            />

            <Button
              variant="outline"
              onClick={() => setShowComments(!showComments)}
              className="gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              {showComments ? 'Kommentare ausblenden' : 'Kommentare anzeigen'}
              ({featureRequest.comment_count})
            </Button>
          </div>

          {/* Comments Section */}
          <FeatureComments
            featureRequestId={featureRequest.id}
            isOpen={showComments}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};