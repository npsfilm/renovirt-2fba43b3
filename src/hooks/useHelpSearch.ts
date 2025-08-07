
import { useState } from 'react';
import { useAIHelp } from './useAIHelp';
import { usePostHog } from '@/contexts/PostHogProvider';

type SearchState = 'idle' | 'searching' | 'results' | 'support_available';

export const useHelpSearch = () => {
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const { askQuestion, isLoading } = useAIHelp();
  const posthog = usePostHog();

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    // PostHog: Track help search
    posthog.capture('help_search_performed', {
      query: query,
      query_length: query.length
    });
    
    setSearchQuery(query);
    setSearchState('searching');
    setSearchResult(null);
    setIsHelpful(null);

    try {
      const result = await askQuestion(query, false);
      setSearchResult(result);
      setSearchState('results');
      
      // PostHog: Track search result received
      posthog.capture('help_search_result_received', {
        query: query,
        result_length: result.length
      });
    } catch (error) {
      console.error('Search error:', error);
      
      // PostHog: Track search error
      posthog.capture('help_search_error', {
        query: query,
        error: error
      });
      
      setSearchState('idle');
    }
  };

  const markAsHelpful = (helpful: boolean) => {
    // PostHog: Track search helpfulness
    posthog.capture('help_search_marked_helpful', {
      query: searchQuery,
      is_helpful: helpful
    });
    
    setIsHelpful(helpful);
    if (!helpful) {
      setSearchState('support_available');
      
      // PostHog: Track escalation to support
      posthog.capture('help_escalated_to_support', {
        query: searchQuery,
        search_result: searchResult
      });
    }
  };

  const resetSearch = () => {
    setSearchState('idle');
    setSearchQuery('');
    setSearchResult(null);
    setIsHelpful(null);
  };

  const canContactSupport = searchState === 'support_available';

  return {
    searchState,
    searchQuery,
    searchResult,
    isHelpful,
    isLoading,
    performSearch,
    markAsHelpful,
    resetSearch,
    canContactSupport
  };
};
