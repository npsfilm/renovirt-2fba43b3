
import React from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface DateFiltersProps {
  dateFromFilter: Date | undefined;
  setDateFromFilter: (date: Date | undefined) => void;
  dateToFilter: Date | undefined;
  setDateToFilter: (date: Date | undefined) => void;
}

const DateFilters = ({
  dateFromFilter,
  setDateFromFilter,
  dateToFilter,
  setDateToFilter,
}: DateFiltersProps) => {
  return (
    <>
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
    </>
  );
};

export default DateFilters;
