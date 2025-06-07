
import React from 'react';

const SummaryStepHeader = () => {
  return (
    <div className="text-center space-y-3">
      <h1 className="text-3xl font-semibold text-foreground tracking-tight">Bestellung überprüfen</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Überprüfen Sie Ihre Angaben und wählen Sie Ihre bevorzugte Zahlungsmethode.
      </p>
    </div>
  );
};

export default SummaryStepHeader;
