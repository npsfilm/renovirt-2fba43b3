
import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface ValidationIconProps {
  isValidating: boolean;
  validationState: 'idle' | 'valid' | 'invalid' | 'error';
}

const ValidationIcon = ({ isValidating, validationState }: ValidationIconProps) => {
  if (isValidating) {
    return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>;
  }
  
  switch (validationState) {
    case 'valid':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'invalid':
      return <XCircle className="h-4 w-4 text-red-500" />;
    case 'error':
      return <AlertCircle className="h-4 w-4 text-yellow-500" />;
    default:
      return null;
  }
};

export default ValidationIcon;
