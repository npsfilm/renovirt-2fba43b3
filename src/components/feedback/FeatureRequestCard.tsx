import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageSquare, Calendar, User, ExternalLink } from 'lucide-react';
import UpvoteButton from './UpvoteButton';
import { FeatureRequestModal } from './FeatureRequestModal';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';
import { FeatureRequest } from '@/types/feedback';

interface FeatureRequestCardProps {
  request: FeatureRequest;
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'open':
      return { label: 'Offen', variant: 'default' as const };
    case 'under_review':
      return { label: 'In Prüfung', variant: 'secondary' as const };
    case 'planned':
      return { label: 'Geplant', variant: 'outline' as const };
    case 'in_progress':
      return { label: 'In Bearbeitung', variant: 'secondary' as const };
    case 'completed':
      return { label: 'Fertig', variant: 'default' as const };
    case 'rejected':
      return { label: 'Abgelehnt', variant: 'destructive' as const };
    default:
      return { label: status, variant: 'default' as const };
  }
};

const getPriorityConfig = (priority: string) => {
  switch (priority) {
    case 'low':
      return { label: 'Niedrig', variant: 'outline' as const };
    case 'medium':
      return { label: 'Mittel', variant: 'secondary' as const };
    case 'high':
      return { label: 'Hoch', variant: 'default' as const };
    case 'critical':
      return { label: 'Kritisch', variant: 'destructive' as const };
    default:
      return { label: priority, variant: 'outline' as const };
  }
};

const FeatureRequestCard = ({ request }: FeatureRequestCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const statusConfig = getStatusConfig(request.status);
  const priorityConfig = getPriorityConfig(request.priority);
  const authorName = request.customer_profiles
    ? `${request.customer_profiles.first_name} ${request.customer_profiles.last_name}`
    : 'Anonymer Nutzer';

  return (
    <>
      <Card className="hover:shadow-md transition-all duration-300 hover:scale-[1.02] animate-fade-in">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg leading-tight mb-2 break-words">
                {request.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed break-words">
                {request.description}
              </p>
            </div>
            <div className="flex-shrink-0">
              <UpvoteButton
                requestId={request.id}
                initialCount={request.upvote_count}
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <Badge variant={statusConfig.variant}>
              {statusConfig.label}
            </Badge>
            <Badge variant={priorityConfig.variant}>
              {priorityConfig.label}
            </Badge>
            {request.feature_categories && (
              <Badge 
                variant="outline"
                style={{ 
                  borderColor: request.feature_categories.color,
                  color: request.feature_categories.color 
                }}
              >
                {request.feature_categories.name}
              </Badge>
            )}
          </div>
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{authorName}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(request.created_at), {
                    addSuffix: true,
                    locale: de,
                  })}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
                onClick={() => setIsModalOpen(true)}
              >
                <MessageSquare className="h-3 w-3 mr-1" />
                <span>{request.comment_count}</span>
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 text-muted-foreground hover:text-foreground"
                onClick={() => setIsModalOpen(true)}
              >
                <ExternalLink className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <FeatureRequestModal
        featureRequest={request}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};

export default FeatureRequestCard;