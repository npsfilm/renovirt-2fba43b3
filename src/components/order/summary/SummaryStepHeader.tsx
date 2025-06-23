
import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';

const SummaryStepHeader = () => {
  return (
    <div className="text-center space-y-4 pb-8">
      <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-medium">Schritt 4 von 4</span>
      </div>
      
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 tracking-tight">
        Bestellung abschließen
      </h1>
      
      <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
        Überprüfen Sie Ihre Bestellung und wählen Sie Ihre bevorzugte Zahlungsmethode. 
        Nach der Bestätigung beginnen wir sofort mit der professionellen Bearbeitung Ihrer Bilder.
      </p>
      
      <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
        <Shield className="w-4 h-4" />
        <span>SSL-verschlüsselt • DSGVO-konform • 30 Tage Geld-zurück-Garantie</span>
      </div>
    </div>
  );
};

export default SummaryStepHeader;
