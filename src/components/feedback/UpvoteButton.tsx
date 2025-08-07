import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronUp } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

interface UpvoteButtonProps {
  requestId: string;
  initialCount: number;
}

const UpvoteButton = ({ requestId, initialCount }: UpvoteButtonProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [optimisticCount, setOptimisticCount] = useState(initialCount);
  const [optimisticUpvoted, setOptimisticUpvoted] = useState(false);

  // Check if user has already upvoted
  const { data: hasUpvoted = false } = useQuery({
    queryKey: ['upvote-status', requestId, user?.id],
    queryFn: async () => {
      if (!user?.id) return false;
      
      const { data, error } = await (supabase as any)
        .from('feature_upvotes')
        .select('id')
        .eq('feature_request_id', requestId)
        .eq('user_id', user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
      return !!data;
    },
    enabled: !!user?.id,
  });

  const toggleUpvoteMutation = useMutation({
    mutationFn: async () => {
      if (!user?.id) {
        throw new Error('Sie müssen angemeldet sein, um abzustimmen.');
      }

      const isCurrentlyUpvoted = hasUpvoted || optimisticUpvoted;

      if (isCurrentlyUpvoted) {
        // Remove upvote
        const { error } = await (supabase as any)
          .from('feature_upvotes')
          .delete()
          .eq('feature_request_id', requestId)
          .eq('user_id', user.id);
        
        if (error) throw error;
        return { action: 'removed' };
      } else {
        // Add upvote
        const { error } = await (supabase as any)
          .from('feature_upvotes')
          .insert({
            feature_request_id: requestId,
            user_id: user.id,
          });
        
        if (error) throw error;
        return { action: 'added' };
      }
    },
    onMutate: () => {
      // Optimistic update
      const isCurrentlyUpvoted = hasUpvoted || optimisticUpvoted;
      if (isCurrentlyUpvoted) {
        setOptimisticCount(prev => prev - 1);
        setOptimisticUpvoted(false);
      } else {
        setOptimisticCount(prev => prev + 1);
        setOptimisticUpvoted(true);
      }
    },
    onError: (error: any) => {
      // Revert optimistic update
      setOptimisticCount(initialCount);
      setOptimisticUpvoted(hasUpvoted);
      
      toast({
        title: 'Fehler',
        description: error.message || 'Beim Abstimmen ist ein Fehler aufgetreten.',
        variant: 'destructive',
      });
    },
    onSuccess: () => {
      // Invalidate queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['upvote-status', requestId] });
      queryClient.invalidateQueries({ queryKey: ['feature-requests'] });
    },
  });

  const handleUpvote = () => {
    if (!user) {
      toast({
        title: 'Anmeldung erforderlich',
        description: 'Sie müssen angemeldet sein, um für Features abstimmen zu können.',
        variant: 'destructive',
      });
      return;
    }

    toggleUpvoteMutation.mutate();
  };

  const isUpvoted = hasUpvoted || optimisticUpvoted;
  const displayCount = optimisticCount;

  return (
    <Button
      variant={isUpvoted ? 'default' : 'outline'}
      size="sm"
      onClick={handleUpvote}
      disabled={toggleUpvoteMutation.isPending}
      className={`flex flex-col items-center gap-1 h-auto py-2 px-3 min-w-[60px] transition-all duration-300 hover:scale-105 ${
        isUpvoted 
          ? 'bg-primary text-primary-foreground border-primary animate-scale-in' 
          : 'hover:bg-primary/10 hover:border-primary/20'
      } ${toggleUpvoteMutation.isPending ? 'animate-pulse' : ''}`}
    >
      <ChevronUp 
        className={`h-4 w-4 transition-all duration-300 ${
          toggleUpvoteMutation.isPending ? 'animate-pulse' : ''
        } ${isUpvoted ? 'scale-110 animate-scale-in' : 'hover:scale-110'}`} 
      />
      <span className="text-xs font-medium transition-all duration-200">{displayCount}</span>
    </Button>
  );
};

export default UpvoteButton;