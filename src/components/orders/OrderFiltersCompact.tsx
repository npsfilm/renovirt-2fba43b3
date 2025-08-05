import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, SortAsc } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface OrderFiltersCompactProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const OrderFiltersCompact = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy,
}: OrderFiltersCompactProps) => {
  const getActiveFiltersCount = () => {
    let count = 0;
    if (searchTerm) count++;
    if (statusFilter && statusFilter !== 'all') count++;
    if (sortBy && sortBy !== 'created_at_desc') count++;
    return count;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setSortBy('created_at_desc');
  };

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <div className="space-y-3 px-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Bestellnummer oder Details suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 bg-background/80 backdrop-blur-sm border-border/50"
        />
      </div>

      {/* Filter Row */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {/* Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-auto min-w-[140px] bg-background/80 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <SelectValue placeholder="Status" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Status</SelectItem>
            <SelectItem value="pending">Warteschlange</SelectItem>
            <SelectItem value="processing">In Bearbeitung</SelectItem>
            <SelectItem value="quality_check">Überprüfung</SelectItem>
            <SelectItem value="revision">In Revision</SelectItem>
            <SelectItem value="completed">Abgeschlossen</SelectItem>
            <SelectItem value="delivered">Bezahlt</SelectItem>
            <SelectItem value="cancelled">Storniert</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort Filter */}
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-auto min-w-[140px] bg-background/80 backdrop-blur-sm border-border/50">
            <div className="flex items-center gap-2">
              <SortAsc className="h-4 w-4" />
              <SelectValue placeholder="Sortierung" />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at_desc">Neueste zuerst</SelectItem>
            <SelectItem value="created_at_asc">Älteste zuerst</SelectItem>
            <SelectItem value="total_price_desc">Preis (hoch-niedrig)</SelectItem>
            <SelectItem value="total_price_asc">Preis (niedrig-hoch)</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        {activeFiltersCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="gap-2 bg-background/80 backdrop-blur-sm border-border/50"
          >
            <span>Filter zurücksetzen</span>
            <Badge variant="secondary" className="ml-1">
              {activeFiltersCount}
            </Badge>
          </Button>
        )}
      </div>
    </div>
  );
};

export default OrderFiltersCompact;