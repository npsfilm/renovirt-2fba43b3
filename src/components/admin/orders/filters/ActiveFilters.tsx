
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ActiveFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  paymentStatusFilter: string;
  setPaymentStatusFilter: (status: string) => void;
  dateFromFilter: Date | undefined;
  setDateFromFilter: (date: Date | undefined) => void;
  dateToFilter: Date | undefined;
  setDateToFilter: (date: Date | undefined) => void;
}

const ActiveFilters = ({
  searchTerm,
  setSearchTerm,
  statusFilter,
  setStatusFilter,
  paymentStatusFilter,
  setPaymentStatusFilter,
  dateFromFilter,
  setDateFromFilter,
  dateToFilter,
  setDateToFilter,
}: ActiveFiltersProps) => {
  return (
    <div className="mt-4 pt-4 border-t border-gray-200">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <span className="font-medium">Aktive Filter:</span>
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Suche: "{searchTerm}"
              <X 
                className="ml-1 w-3 h-3 cursor-pointer hover:text-blue-600" 
                onClick={() => setSearchTerm('')}
              />
            </Badge>
          )}
          {statusFilter !== 'all' && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Status: {statusFilter}
              <X 
                className="ml-1 w-3 h-3 cursor-pointer hover:text-green-600" 
                onClick={() => setStatusFilter('all')}
              />
            </Badge>
          )}
          {paymentStatusFilter !== 'all' && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Zahlung: {paymentStatusFilter}
              <X 
                className="ml-1 w-3 h-3 cursor-pointer hover:text-purple-600" 
                onClick={() => setPaymentStatusFilter('all')}
              />
            </Badge>
          )}
          {dateFromFilter && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Von: {format(dateFromFilter, "dd.MM.yyyy", { locale: de })}
              <X 
                className="ml-1 w-3 h-3 cursor-pointer hover:text-orange-600" 
                onClick={() => setDateFromFilter(undefined)}
              />
            </Badge>
          )}
          {dateToFilter && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              Bis: {format(dateToFilter, "dd.MM.yyyy", { locale: de })}
              <X 
                className="ml-1 w-3 h-3 cursor-pointer hover:text-orange-600" 
                onClick={() => setDateToFilter(undefined)}
              />
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActiveFilters;
