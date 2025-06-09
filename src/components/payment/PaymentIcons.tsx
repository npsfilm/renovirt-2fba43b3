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
  return <img src="/lovable-uploads/09b9d373-9bc2-4876-906e-235ccf1b3d30.png" alt="Rechnung" className={className} />;
};
export default PaymentIcons;