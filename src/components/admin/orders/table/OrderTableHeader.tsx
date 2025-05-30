
import React from 'react';

const OrderTableHeader = () => {
  return (
    <thead>
      <tr className="border-b">
        <th className="text-left py-3 px-4 font-medium">Bestell-ID</th>
        <th className="text-left py-3 px-4 font-medium">Kunde</th>
        <th className="text-left py-3 px-4 font-medium">E-Mail</th>
        <th className="text-left py-3 px-4 font-medium">Bilder</th>
        <th className="text-left py-3 px-4 font-medium">Betrag</th>
        <th className="text-left py-3 px-4 font-medium">Status</th>
        <th className="text-left py-3 px-4 font-medium">Datum</th>
        <th className="text-left py-3 px-4 font-medium">Aktionen</th>
      </tr>
    </thead>
  );
};

export default OrderTableHeader;
