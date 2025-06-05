
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
        <SelectContent>
          <SelectItem value="all">Alle Status</SelectItem>
          <SelectItem value="pending">Ausstehend</SelectItem>
          <SelectItem value="processing">In Bearbeitung</SelectItem>
          <SelectItem value="ready">Bereit</SelectItem>
          <SelectItem value="completed">Abgeschlossen</SelectItem>
          <SelectItem value="cancelled">Storniert</SelectItem>
        </SelectContent>
      </Select>

      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Sortieren nach" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="created_at_desc">Neueste zuerst</SelectItem>
          <SelectItem value="created_at_asc">Älteste zuerst</SelectItem>
          <SelectItem value="total_price_desc">Höchster Preis</SelectItem>
          <SelectItem value="total_price_asc">Niedrigster Preis</SelectItem>
          <SelectItem value="status">Nach Status</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default OrdersSearchFilter;
