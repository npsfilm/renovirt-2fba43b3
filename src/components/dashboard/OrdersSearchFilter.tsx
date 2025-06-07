
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

interface OrdersSearchFilterProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  sortBy: string;
  setSortBy: (sort: string) => void;
}

const OrdersSearchFilter = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  sortBy,
  setSortBy
}: OrdersSearchFilterProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Nach Bestellnummer, Paket oder Status suchen..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <Filter className="w-4 h-4 mr-2" />
          <SelectValue placeholder="Status Filter" />
        </SelectTrigger>
        <SelectContent className="bg-background border border-border">
          <SelectItem value="all" className="focus:bg-muted focus:text-muted-foreground hover:bg-muted hover:text-muted-foreground">Alle Status</SelectItem>
          <SelectItem value="pending" className="focus:bg-muted focus:text-muted-foreground hover:bg-muted hover:text-muted-foreground">Warteschlange</SelectItem>
          <SelectItem value="processing" className="focus:bg-muted focus:text-muted-foreground hover:bg-muted hover:text-muted-foreground">In Bearbeitung</SelectItem>
          <SelectItem value="quality_check" className="focus:bg-muted focus:text-muted-foreground hover:bg-muted hover:text-muted-foreground">Überprüfung</SelectItem>
          <SelectItem value="revision" className="focus:bg-muted focus:text-muted-foreground hover:bg-muted hover:text-muted-foreground">In Revision</SelectItem>
          <SelectItem value="completed" className="focus:bg-muted focus:text-muted-foreground hover:bg-muted hover:text-muted-foreground">Abgeschlossen</SelectItem>
          <SelectItem value="delivered" className="focus:bg-muted focus:text-muted-foreground hover:bg-muted hover:text-muted-foreground">Abgeschlossen & bezahlt</SelectItem>
          <SelectItem value="cancelled" className="focus:bg-muted focus:text-muted-foreground hover:bg-muted hover:text-muted-foreground">Storniert</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sortieren nach" />
        </SelectTrigger>
        <SelectContent className="bg-background border border-border">
          <SelectItem value="created_at_desc" className="focus:bg-muted focus:text-muted-foreground hover:bg-muted hover:text-muted-foreground">Neueste zuerst</SelectItem>
          <SelectItem value="created_at_asc" className="focus:bg-muted focus:text-muted-foreground hover:bg-muted hover:text-muted-foreground">Älteste zuerst</SelectItem>
          <SelectItem value="total_price_desc" className="focus:bg-muted focus:text-muted-foreground hover:bg-muted hover:text-muted-foreground">Höchster Preis</SelectItem>
          <SelectItem value="total_price_asc" className="focus:bg-muted focus:text-muted-foreground hover:bg-muted hover:text-muted-foreground">Niedrigster Preis</SelectItem>
          <SelectItem value="status" className="focus:bg-muted focus:text-muted-foreground hover:bg-muted hover:text-muted-foreground">Nach Status</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default OrdersSearchFilter;
