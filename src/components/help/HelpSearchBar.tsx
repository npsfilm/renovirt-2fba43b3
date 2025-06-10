
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="h-14 text-lg pr-24 border-0 bg-background shadow-sm focus:ring-2 focus:ring-primary/20"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          disabled={!query.trim() || isLoading}
          className="absolute right-2 top-2 h-10 px-4"
          size="sm"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Search className="w-4 h-4" />
          )}
        </Button>
      </div>
    </form>
  );
};

export default HelpSearchBar;
