import React from 'react';
import { ArrowLeft, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#91A56E]" />
              <span className="text-2xl font-bold text-[#393939]">Renovirt</span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Zur Startseite
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card>
          <CardContent className="p-8">
            {/* Title Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-[#91A56E] mb-2">
                Datenschutzerklärung
              </h1>
              <p className="text-lg text-[#393939] mb-1">
                der NPS Media GmbH für die Marke Renovirt
              </p>
              <p className="text-sm text-gray-600">
                Stand: 01.2025
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 text-[#393939] leading-relaxed">
              {/* 1. Allgemeine Hinweise */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  1. Allgemeine Hinweise und Pflichtinformationen
                </h2>
                <p className="mb-4">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                </p>
                <p className="mb-4">
                  Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis.
                </p>
              </section>

              {/* 2. Datenerfassung */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  2. Datenerfassung auf unserer Website
                </h2>
                <p className="mb-4">
                  Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
                </p>
                <p className="mb-4">
                  Sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur.
                </p>
              </section>

              {/* 3. Analyse-Tools */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  3. Analyse-Tools und Werbung
                </h2>
                <p className="mb-4">
                  Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur. At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium.
                </p>
                <p className="mb-4">
                  Voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga.
                </p>
              </section>

              {/* 4. Plugins und Tools */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  4. Plugins und Tools
                </h2>
                <p className="mb-4">
                  Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.
                </p>
                <p className="mb-4">
                  Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus.
                </p>
              </section>

              {/* 5. Verantwortlicher */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  5. Verantwortlicher
                </h2>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="font-semibold mb-2">NPS Media GmbH</p>
                  <p>Musterstraße 123</p>
                  <p>12345 Musterstadt</p>
                  <p>Deutschland</p>
                  <p className="mt-2">
                    <strong>Telefon:</strong> +49 (0) 123 456789<br />
                    <strong>E-Mail:</strong> datenschutz@renovirt.de
                  </p>
                </div>
                <p className="mb-4">
                  Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten (z. B. Namen, E-Mail-Adressen o. Ä.) entscheidet.
                </p>
              </section>

              {/* 6. Ihre Rechte */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  6. Ihre Rechte bezüglich Ihrer Daten
                </h2>
                <p className="mb-4">
                  Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung oder Löschung dieser Daten zu verlangen.
                </p>
                <ul className="list-disc pl-6 space-y-2 mb-4">
                  <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
                  <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
                  <li>Recht auf Löschung (Art. 17 DSGVO)</li>
                  <li>Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</li>
                  <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
                  <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
                </ul>
              </section>

              {/* 7. SSL-Verschlüsselung */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  7. SSL- bzw. TLS-Verschlüsselung
                </h2>
                <p className="mb-4">
                  Diese Seite nutzt aus Sicherheitsgründen und zum Schutz der Übertragung vertraulicher Inhalte, wie zum Beispiel Bestellungen oder Anfragen, die Sie an uns als Seitenbetreiber senden, eine SSL- bzw. TLS-Verschlüsselung.
                </p>
                <p className="mb-4">
                  Eine verschlüsselte Verbindung erkennen Sie daran, dass die Adresszeile des Browsers von „http://" auf „https://" wechselt und an dem Schloss-Symbol in Ihrer Browserzeile.
                </p>
              </section>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t bg-gray-50 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#91A56E]" />
              <span className="font-semibold text-[#393939]">Renovirt</span>
              <span className="text-sm text-gray-600">by NPS Media GmbH</span>
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <a 
                href="/impressum" 
                className="text-[#91A56E] hover:underline transition-colors"
              >
                Impressum
              </a>
              <a 
                href="/agb" 
                className="text-[#91A56E] hover:underline transition-colors"
              >
                AGB
              </a>
              <span className="text-gray-600">
                © 2025 NPS Media GmbH. Alle Rechte vorbehalten.
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Privacy;