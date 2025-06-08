
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Impressum = () => {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle>Impressum</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h3 className="text-lg font-semibold mb-2">Angaben gemäß § 5 TMG</h3>
            <p className="text-muted-foreground">
              [Firmenname]<br />
              [Straße und Hausnummer]<br />
              [Postleitzahl und Ort]
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Kontakt</h3>
            <p className="text-muted-foreground">
              Telefon: [Telefonnummer]<br />
              E-Mail: [E-Mail-Adresse]
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Umsatzsteuer-ID</h3>
            <p className="text-muted-foreground">
              Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
              [USt-IdNr.]
            </p>
          </section>

          <section>
            <h3 className="text-lg font-semibold mb-2">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
            <p className="text-muted-foreground">
              [Name]<br />
              [Adresse]
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  );
};

export default Impressum;
