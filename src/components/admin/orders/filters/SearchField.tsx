
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';

interface SearchFieldProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchField = ({ searchTerm, setSearchTerm }: SearchFieldProps) => {
  return (
    <div className="space-y-2 lg:col-span-2">
      <Label htmlFor="search" className="font-medium">Bestellnummer oder Kunde</Label>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
        <Input
          id="search"
          type="text"
          placeholder="Bestellnummer oder Kundenname eingeben..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchTerm('')}
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
          >
            <X className="w-3 h-3" />
          </Button>
        )}
      </div>
      <p className="text-xs text-gray-500">
        Optimiert für Bestellnummer und Kundenname - Ergebnisse werden sofort angezeigt
      </p>
    </div>
  );
};

export default SearchField;
