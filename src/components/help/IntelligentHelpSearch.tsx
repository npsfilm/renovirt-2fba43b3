
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, MessageCircle } from 'lucide-react';
import HelpSearchBar from './HelpSearchBar';
import SearchResult from './SearchResult';
import SupportContactModal from './SupportContactModal';
import LoadingState from '@/components/ui/loading-state';
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

      {/* AI Loading State */}
      {searchState === 'searching' && (
        <div className="animate-in fade-in-50 duration-500">
          <Card className="border-0 shadow-lg bg-card/90 backdrop-blur-sm">
            <CardContent className="p-12">
              <LoadingState 
                size="lg"
                text="AI analysiert Ihre Frage..."
                className="py-8"
              />
            </CardContent>
          </Card>
        </div>
      )}

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
          <Card className="border-primary/20 bg-gradient-to-r from-primary/5 via-primary/3 to-primary/5 shadow-lg">
            <CardContent className="p-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-primary" />
              </div>
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-foreground">
                  Benötigen Sie persönliche Unterstützung?
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Unser Support-Team hilft Ihnen gerne weiter und beantwortet Ihre individuellen Fragen
                </p>
              </div>
              <Button 
                onClick={handleSupportContact}
                className="mt-6 px-8 py-3 text-lg font-medium shadow-md hover:shadow-lg transition-all"
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
