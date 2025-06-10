
import { useState } from 'react';
import { useAIHelp } from './useAIHelp';

type SearchState = 'idle' | 'searching' | 'results' | 'support_available';

export const useHelpSearch = () => {
  const [searchState, setSearchState] = useState<SearchState>('idle');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isHelpful, setIsHelpful] = useState<boolean | null>(null);
  const { askQuestion, isLoading } = useAIHelp();

  const performSearch = async (query: string) => {
    if (!query.trim()) return;
    
    setSearchQuery(query);
    setSearchState('searching');
    setSearchResult(null);
    setIsHelpful(null);

    try {
      const result = await askQuestion(query, false);
      setSearchResult(result);
      setSearchState('results');
    } catch (error) {
      console.error('Search error:', error);
      setSearchState('idle');
    }
  };

  const markAsHelpful = (helpful: boolean) => {
    setIsHelpful(helpful);
    if (!helpful) {
      setSearchState('support_available');
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
