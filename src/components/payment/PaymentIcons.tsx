
import React from 'react';
import { Lock } from 'lucide-react';

interface PaymentIconsProps {
  showSecurity?: boolean;
  className?: string;
}

export const PaymentIcons = ({ showSecurity = true, className = "" }: PaymentIconsProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-center justify-center flex-wrap gap-3">
        <img 
          src="/lovable-uploads/9ec7c3ad-34b9-4fea-a9e9-0d4a0a5532e9.png" 
          alt="Visa" 
          className="h-8 object-contain"
        />
        <img 
          src="/lovable-uploads/d6ac9ba9-7ad2-408b-a2b0-5f31c269dd53.png" 
          alt="Mastercard" 
          className="h-8 object-contain"
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
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
    </svg>
  );
};

export default PaymentIcons;
