
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface StatusFiltersProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  paymentStatusFilter: string;
  setPaymentStatusFilter: (status: string) => void;
}

const StatusFilters = ({
  statusFilter,
  setStatusFilter,
  paymentStatusFilter,
  setPaymentStatusFilter,
}: StatusFiltersProps) => {
  return (
    <>
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
    </>
  );
};

export default StatusFilters;
