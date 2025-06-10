
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Filter, X } from 'lucide-react';
import SearchField from './filters/SearchField';
import StatusFilters from './filters/StatusFilters';
import DateFilters from './filters/DateFilters';
import QuickFilters from './filters/QuickFilters';
import ActiveFilters from './filters/ActiveFilters';

interface EnhancedOrdersFiltersProps {
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
  packageFilter: string;
  setPackageFilter: (packageName: string) => void;
  onClearFilters: () => void;
}

const EnhancedOrdersFilters = ({
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
  packageFilter,
  setPackageFilter,
  onClearFilters,
}: EnhancedOrdersFiltersProps) => {
  const hasActiveFilters = searchTerm || statusFilter !== 'all' || paymentStatusFilter !== 'all' || 
    dateFromFilter || dateToFilter || packageFilter !== 'all';

  const activeFilterCount = useMemo(() => {
    return [
      searchTerm,
      statusFilter !== 'all',
      paymentStatusFilter !== 'all',
      dateFromFilter,
      dateToFilter,
      packageFilter !== 'all'
    ].filter(Boolean).length;
  }, [searchTerm, statusFilter, paymentStatusFilter, dateFromFilter, dateToFilter, packageFilter]);

  return (
    <Card className="border-2 border-gray-100">
      <CardContent className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-blue-600" />
            <h3 className="font-semibold text-lg text-gray-900">Erweiterte Suche & Filter</h3>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount} aktiv
              </Badge>
            )}
          </div>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              className="ml-auto hover:bg-red-50 hover:text-red-600 hover:border-red-200"
            >
              <X className="w-4 h-4 mr-1" />
              Alle Filter zurücksetzen
            </Button>
          )}
        </div>

        {/* Quick Actions */}
        {!hasActiveFilters && (
          <QuickFilters
            setDateFromFilter={setDateFromFilter}
            setStatusFilter={setStatusFilter}
            setPaymentStatusFilter={setPaymentStatusFilter}
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <SearchField
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          
          <StatusFilters
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            paymentStatusFilter={paymentStatusFilter}
            setPaymentStatusFilter={setPaymentStatusFilter}
          />
          
          <DateFilters
            dateFromFilter={dateFromFilter}
            setDateFromFilter={setDateFromFilter}
            dateToFilter={dateToFilter}
            setDateToFilter={setDateToFilter}
          />
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <ActiveFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            paymentStatusFilter={paymentStatusFilter}
            setPaymentStatusFilter={setPaymentStatusFilter}
            dateFromFilter={dateFromFilter}
            setDateFromFilter={setDateFromFilter}
            dateToFilter={dateToFilter}
            setDateToFilter={setDateToFilter}
          />
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedOrdersFilters;
