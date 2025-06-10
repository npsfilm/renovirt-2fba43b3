
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bot, MessageCircle, Sparkles } from 'lucide-react';
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
      {/* Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Bot className="w-6 h-6" />
            <Sparkles className="w-5 h-5" />
            Intelligente Hilfe-Suche
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-blue-800 mb-4">
            Beschreiben Sie Ihr Problem und erhalten Sie sofortige, maßgeschneiderte Hilfe von unserem AI-Assistenten.
          </p>
          <div className="flex items-center gap-2 text-sm text-blue-700">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Sofortige Antworten • Kennt alle unsere Services • Verfügbar 24/7</span>
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Wie können wir Ihnen helfen?</CardTitle>
        </CardHeader>
        <CardContent>
          <HelpSearchBar 
            onSearch={performSearch}
            isLoading={isLoading}
          />
          
          {searchState !== 'idle' && (
            <div className="mt-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={resetSearch}
                className="text-xs"
              >
                Neue Suche starten
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Search Results */}
      {searchState === 'results' && searchResult && (
        <SearchResult
          query={searchQuery}
          result={searchResult}
          onFeedback={markAsHelpful}
          isHelpful={isHelpful}
        />
      )}

      {/* Support Contact Option */}
      {canContactSupport && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                <MessageCircle className="w-12 h-12 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  Benötigen Sie persönliche Unterstützung?
                </h3>
                <p className="text-blue-800 text-sm mb-4">
                  Unser Support-Team steht bereit, um Ihnen individuell zu helfen.
                </p>
                <Button 
                  onClick={handleSupportContact}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Support kontaktieren
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
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
