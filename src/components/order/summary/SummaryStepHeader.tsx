import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
const SummaryStepHeader = () => {
  return <div className="text-center space-y-3 md:space-y-4 pb-6 md:pb-8 px-3 md:px-0">
      
      
      <h1 className="text-xl md:text-3xl font-semibold text-gray-900 tracking-tight">
        Bestellung abschließen
      </h1>
      
      <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto leading-tight md:leading-relaxed">
        Überprüfen Sie Ihre Bestellung und wählen Sie Ihre bevorzugte Zahlungsmethode. 
        Nach der Bestätigung beginnen wir sofort mit der professionellen Bearbeitung Ihrer Bilder.
      </p>
      
      <div className="flex items-center justify-center gap-2 text-xs md:text-sm text-gray-500">
        <Shield className="w-3 h-3 md:w-4 md:h-4" />
        <span>SSL-verschlüsselt • DSGVO-konform </span>
      </div>
    </div>;
};
export default SummaryStepHeader;