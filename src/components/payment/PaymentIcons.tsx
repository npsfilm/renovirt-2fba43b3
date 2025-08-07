import React from 'react';
import { Lock } from 'lucide-react';
interface PaymentIconsProps {
  showSecurity?: boolean;
  className?: string;
}
export const PaymentIcons = ({
  showSecurity = true,
  className = ""
}: PaymentIconsProps) => {
  return <div className={`space-y-3 ${className}`}>
      
      
      {showSecurity}
    </div>;
};
export const InvoiceIcon = ({
  className = "w-5 h-5"
}: {
  className?: string;
}) => {
  return null;
};
export default PaymentIcons;