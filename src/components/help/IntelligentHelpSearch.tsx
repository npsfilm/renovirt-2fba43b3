
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, MessageCircle } from 'lucide-react';
import HelpSearchBar from './HelpSearchBar';
import SearchResult from './SearchResult';
import SupportContactModal from './SupportContactModal';
import { useHelpSearch } from '@/hooks/useHelpSearch';

const IntelligentHelpSearch = () => {
  const [showSupportModal, setShowSupportModal] = useState(false);
  const {
    searchState,
    searchQuery,
    searchResult,
    isHelpful,
    isLoading,
    performSearch,
    markAsHelpful,
    resetSearch,
    canContactSupport
  } = useHelpSearch();

  const handleSupportContact = () => {
    if (canContactSupport) {
      setShowSupportModal(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Interface */}
      <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm">
        <CardContent className="p-6">
          <HelpSearchBar 
            onSearch={performSearch}
            isLoading={isLoading}
            placeholder="Geben Sie Ihre Frage ein..."
          />
          
          {searchState !== 'idle' && (
            <div className="mt-4 flex justify-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetSearch}
                className="text-muted-foreground hover:text-foreground hover:bg-muted"
              >
                Neue Suche
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchState === 'results' && searchResult && (
        <div className="animate-in fade-in-50 duration-500">
          <SearchResult
            query={searchQuery}
            result={searchResult}
            onFeedback={markAsHelpful}
            isHelpful={isHelpful}
          />
        </div>
      )}

      {/* Support Contact - Only when needed */}
      {canContactSupport && (
        <div className="animate-in fade-in-50 duration-500">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-6 text-center space-y-4">
              <MessageCircle className="w-10 h-10 mx-auto text-primary" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium text-foreground">
                  Benötigen Sie persönliche Unterstützung?
                </h3>
                <p className="text-muted-foreground">
                  Unser Support-Team hilft Ihnen gerne weiter
                </p>
              </div>
              <Button 
                onClick={handleSupportContact}
                className="mt-4"
                size="lg"
              >
                Support kontaktieren
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Support Modal */}
      <SupportContactModal
        isOpen={showSupportModal}
        onClose={() => setShowSupportModal(false)}
        searchQuery={searchQuery}
        aiResult={searchResult || ''}
      />
    </div>
  );
};

export default IntelligentHelpSearch;
