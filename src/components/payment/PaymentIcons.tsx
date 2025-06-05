
import React from 'react';
import { Lock } from 'lucide-react';

interface PaymentIconsProps {
  showSecurity?: boolean;
  className?: string;
}

export const PaymentIcons = ({ showSecurity = true, className = "" }: PaymentIconsProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-start flex-wrap gap-3">
        <img 
          src="/lovable-uploads/819e5e7a-f577-4df0-bb54-2358e513d5bc.png" 
          alt="Visa" 
          className="h-7 object-contain"
        />
        <img 
          src="/lovable-uploads/77777e02-5a5e-4d6b-a181-95ebade8bf9e.png" 
          alt="Mastercard" 
          className="h-7 object-contain"
        />
        <img 
          src="/lovable-uploads/d2f87edb-2e0b-43b8-b23a-9672cbd709a5.png" 
          alt="Apple Pay" 
          className="h-7 object-contain"
        />
        <img 
          src="/lovable-uploads/16638ecb-4c78-4658-8ef3-b071e022292f.png" 
          alt="Google Pay" 
          className="h-7 object-contain"
        />
        <img 
          src="/lovable-uploads/a9107e55-f9c2-4c64-84ca-2bc5931e76ca.png" 
          alt="PayPal" 
          className="h-7 object-contain"
        />
        <img 
          src="/lovable-uploads/c0a174f6-b11b-4637-a8dd-1e03fe663449.png" 
          alt="Klarna" 
          className="h-7 object-contain"
        />
      </div>
      
      {showSecurity && (
        <div className="flex items-center justify-center text-gray-600 text-sm">
          <Lock className="w-4 h-4 mr-2" />
          <span>Alle Transaktionen sind sicher und verschlüsselt</span>
        </div>
      )}
    </div>
  );
};

export const InvoiceIcon = ({ className = "w-5 h-5" }: { className?: string }) => {
  return (
    <img 
      src="/lovable-uploads/09b9d373-9bc2-4876-906e-235ccf1b3d30.png" 
      alt="Rechnung" 
      className={className}
    />
  );
};

export default PaymentIcons;
