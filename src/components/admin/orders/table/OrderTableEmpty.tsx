
import React from 'react';

const OrderTableEmpty = () => {
  return (
    <tr>
      <td colSpan={8} className="text-center py-8 text-gray-500">
        Keine Bestellungen gefunden
      </td>
    </tr>
  );
};

export default OrderTableEmpty;
