
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
      {/* Clean Hero Section */}
      <div className="text-center space-y-6 py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
          <Bot className="w-8 h-8 text-primary" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-light text-foreground">
            Intelligente Hilfe
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Beschreiben Sie Ihr Anliegen und erhalten Sie sofort eine maßgeschneiderte Antwort
          </p>
        </div>
      </div>

      {/* Search Interface */}
      <Card className="border-0 shadow-sm bg-card/50">
        <CardContent className="p-8">
          <HelpSearchBar 
            onSearch={performSearch}
            isLoading={isLoading}
            placeholder="Beschreiben Sie Ihr Problem oder Ihre Frage..."
          />
          
          {searchState !== 'idle' && (
            <div className="mt-6 flex justify-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetSearch}
                className="text-muted-foreground hover:text-foreground"
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
            <CardContent className="p-8 text-center space-y-4">
              <MessageCircle className="w-12 h-12 mx-auto text-primary" />
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
