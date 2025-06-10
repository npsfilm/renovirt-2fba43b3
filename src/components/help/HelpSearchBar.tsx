
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Loader2 } from 'lucide-react';

interface HelpSearchBarProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

const HelpSearchBar = ({ 
  onSearch, 
  isLoading = false,
  placeholder = "Beschreiben Sie Ihr Problem oder Ihre Frage..."
}: HelpSearchBarProps) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      onSearch(query.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex gap-3">
        <div className="flex-1">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="text-base py-3 px-4"
            disabled={isLoading}
          />
        </div>
        <Button 
          type="submit" 
          disabled={!query.trim() || isLoading}
          className="px-6 py-3"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span className="ml-2">Suchen</span>
        </Button>
      </div>
    </form>
  );
};

export default HelpSearchBar;
