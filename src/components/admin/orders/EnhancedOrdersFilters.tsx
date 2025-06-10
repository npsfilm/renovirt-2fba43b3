
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Filter, X, Search } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

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

  // Quick search suggestions
  const searchSuggestions = [
    { label: 'Heute', action: () => setDateFromFilter(new Date()) },
    { label: 'Warteschlange', action: () => setStatusFilter('pending') },
    { label: 'Revision', action: () => setStatusFilter('revision') },
    { label: 'Bezahlt', action: () => setPaymentStatusFilter('paid') },
  ];

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
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {/* Enhanced Search */}
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

          {/* Order Status */}
          <div className="space-y-2">
            <Label htmlFor="status" className="font-medium">Bestellstatus</Label>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Status auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <span className="flex items-center gap-2">
                    Alle Status
                  </span>
                </SelectItem>
                <SelectItem value="pending">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Warteschlange
                  </span>
                </SelectItem>
                <SelectItem value="processing">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    In Bearbeitung
                  </span>
                </SelectItem>
                <SelectItem value="quality_check">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    Überprüfung
                  </span>
                </SelectItem>
                <SelectItem value="revision">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                    In Revision
                  </span>
                </SelectItem>
                <SelectItem value="completed">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Abgeschlossen
                  </span>
                </SelectItem>
                <SelectItem value="delivered">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-emerald-600 rounded-full"></span>
                    Abgeschlossen & bezahlt
                  </span>
                </SelectItem>
                <SelectItem value="cancelled">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Storniert
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Status */}
          <div className="space-y-2">
            <Label htmlFor="payment-status" className="font-medium">Zahlungsstatus</Label>
            <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
              <SelectTrigger className="border-gray-300 focus:border-blue-500">
                <SelectValue placeholder="Zahlungsstatus auswählen" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Alle Zahlungsstatus</SelectItem>
                <SelectItem value="pending">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                    Ausstehend
                  </span>
                </SelectItem>
                <SelectItem value="paid">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Bezahlt
                  </span>
                </SelectItem>
                <SelectItem value="failed">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                    Fehlgeschlagen
                  </span>
                </SelectItem>
                <SelectItem value="refunded">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-gray-500 rounded-full"></span>
                    Erstattet
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date From */}
          <div className="space-y-2">
            <Label className="font-medium">Von Datum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-gray-300 focus:border-blue-500 hover:bg-gray-50"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateFromFilter ? format(dateFromFilter, "dd.MM.yyyy", { locale: de }) : "Startdatum wählen"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateFromFilter}
                  onSelect={setDateFromFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date To */}
          <div className="space-y-2">
            <Label className="font-medium">Bis Datum</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal border-gray-300 focus:border-blue-500 hover:bg-gray-50"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dateToFilter ? format(dateToFilter, "dd.MM.yyyy", { locale: de }) : "Enddatum wählen"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={dateToFilter}
                  onSelect={setDateToFilter}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
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
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedOrdersFilters;
