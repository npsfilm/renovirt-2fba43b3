import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { FeatureRequest, FeatureCategory } from '@/types/feedback';

export const useFeatureRequests = (
  selectedCategory: string = 'all',
  statusFilter: string = 'all',
  searchTerm: string = '',
  quickFilter: string = '',
  userId?: string
) => {
  return useQuery({
    queryKey: ['feature-requests', selectedCategory, statusFilter, searchTerm, quickFilter, userId],
    queryFn: async () => {
      let query = (supabase as any)
        .from('feature_requests')
        .select(`
          *,
          feature_categories (
            name,
            color
          ),
          customer_profiles!feature_requests_created_by_fkey (
            first_name,
            last_name
          )
        `);

      // Apply quick filters
      if (quickFilter === 'trending') {
        query = query.order('comment_count', { ascending: false });
      } else if (quickFilter === 'popular') {
        query = query.order('upvote_count', { ascending: false });
      } else if (quickFilter === 'recent') {
        query = query.order('created_at', { ascending: false });
      } else if (quickFilter === 'my-requests' && userId) {
        query = query.eq('created_by', userId).order('created_at', { ascending: false });
      } else {
        query = query.order('upvote_count', { ascending: false });
      }

      if (selectedCategory !== 'all') {
        query = query.eq('category_id', selectedCategory);
      }

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as FeatureRequest[];
    },
  });
};

export const useFeatureCategories = () => {
  return useQuery({
    queryKey: ['feature-categories'],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from('feature_categories')
        .select('*')
        .order('name');
      if (error) throw error;
      return data as FeatureCategory[];
    },
  });
};

export const useCreateFeatureRequest = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      title: string;
      description: string;
      category_id: string;
      created_by: string;
    }) => {
      const { error } = await (supabase as any)
        .from('feature_requests')
        .insert({
          title: data.title.trim(),
          description: data.description.trim(),
          category_id: data.category_id,
          created_by: data.created_by,
          status: 'open',
          priority: 'medium',
        });

      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Feature erfolgreich eingereicht',
        description: 'Vielen Dank für Ihren Vorschlag! Wir werden ihn prüfen.',
      });
      
      // Refresh feature requests
      queryClient.invalidateQueries({ queryKey: ['feature-requests'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler beim Einreichen',
        description: error.message || 'Beim Einreichen Ihres Feature-Vorschlags ist ein Fehler aufgetreten.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpvoteFeatureRequest = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, userId, hasUpvoted }: {
      requestId: string;
      userId: string;
      hasUpvoted: boolean;
    }) => {
      if (hasUpvoted) {
        // Remove upvote
        const { error } = await (supabase as any)
          .from('feature_upvotes')
          .delete()
          .eq('feature_request_id', requestId)
          .eq('user_id', userId);
        
        if (error) throw error;
      } else {
        // Add upvote
        const { error } = await (supabase as any)
          .from('feature_upvotes')
          .insert({
            feature_request_id: requestId,
            user_id: userId,
          });
        
        if (error) throw error;
      }
    },
    onSuccess: () => {
      // Refresh feature requests to update counts
      queryClient.invalidateQueries({ queryKey: ['feature-requests'] });
      queryClient.invalidateQueries({ queryKey: ['upvote-status'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Fehler beim Abstimmen',
        description: error.message || 'Beim Abstimmen ist ein Fehler aufgetreten.',
        variant: 'destructive',
      });
    },
  });
};

export const useUpvoteStatus = (requestId: string, userId?: string) => {
  return useQuery({
    queryKey: ['upvote-status', requestId, userId],
    queryFn: async () => {
      if (!userId) return false;
      
      const { data, error } = await (supabase as any)
        .from('feature_upvotes')
        .select('id')
        .eq('feature_request_id', requestId)
        .eq('user_id', userId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return !!data;
    },
    enabled: !!userId && !!requestId,
  });
};