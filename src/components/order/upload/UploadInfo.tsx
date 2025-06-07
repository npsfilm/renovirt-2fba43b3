
import React from 'react';
import { Shield, Info } from 'lucide-react';

const UploadInfo = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="flex items-start space-x-3 p-4 bg-success/5 rounded-lg border border-success/20">
        <Shield className="w-5 h-5 text-success mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">DSGVO-konforme Verarbeitung</p>
          <p className="text-xs text-muted-foreground">Ihre Bilder bleiben privat und werden vertraulich behandelt.</p>
        </div>
      </div>
      <div className="flex items-start space-x-3 p-4 bg-info/5 rounded-lg border border-info/20">
        <Info className="w-5 h-5 text-info mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Pro-Tipp</p>
          <p className="text-xs text-muted-foreground">Je höher die Auflösung, desto beeindruckender das Ergebnis.</p>
        </div>
      </div>
    </div>
  );
};

export default UploadInfo;
