
import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickFiltersProps {
  setDateFromFilter: (date: Date | undefined) => void;
  setStatusFilter: (status: string) => void;
  setPaymentStatusFilter: (status: string) => void;
}

const QuickFilters = ({
  setDateFromFilter,
  setStatusFilter,
  setPaymentStatusFilter,
}: QuickFiltersProps) => {
  const searchSuggestions = [
    { label: 'Heute', action: () => setDateFromFilter(new Date()) },
    { label: 'Warteschlange', action: () => setStatusFilter('pending') },
    { label: 'Revision', action: () => setStatusFilter('revision') },
    { label: 'Bezahlt', action: () => setPaymentStatusFilter('paid') },
  ];

  return (
    <div className="mb-4 p-3 bg-blue-50 rounded-lg">
      <p className="text-sm text-blue-700 mb-2 font-medium">Schnellfilter:</p>
      <div className="flex flex-wrap gap-2">
        {searchSuggestions.map((suggestion) => (
          <Button
            key={suggestion.label}
            variant="outline"
            size="sm"
            onClick={suggestion.action}
            className="text-xs hover:bg-blue-100 hover:border-blue-300"
          >
            {suggestion.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default QuickFilters;
