import React from 'react';
import { ArrowLeft, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Impressum = () => {
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
                Impressum
              </h1>
              <p className="text-lg text-[#393939] mb-1">
                der NPS Media GmbH für die Marke Renovirt
              </p>
              <p className="text-sm text-gray-600">
                Stand: 07.2025
              </p>
            </div>

            {/* Content Sections */}
            <div className="space-y-8 text-[#393939] leading-relaxed">
              {/* Angaben gemäß DDG */}
              <section>
                <h2 className="text-xl font-semibold text-[#91A56E] mb-4 border-b border-[#91A56E]/20 pb-2">
                  Angaben gemäß § 5 DDG (ehemals TMG)
                </h2>
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <p className="font-semibold text-lg mb-4">NPS Media GmbH</p>
                  <div className="space-y-2">
                    <p>Klinkerberg 9</p>
                    <p>86152 Augsburg</p>
                    <p>Deutschland</p>
                  </div>
                </div>
              </section>

              {/* Vertreten durch */}
              <section>
                <h3 className="text-lg font-semibold text-[#91A56E] mb-3">Vertreten durch:</h3>
                <p className="mb-4">
                  <strong>Geschäftsführer:</strong> Nikolas Seymour
                </p>
              </section>

              {/* Kontakt */}
              <section>
                <h3 className="text-lg font-semibold text-[#91A56E] mb-3">Kontakt:</h3>
                <p className="mb-4">
                  <strong>E-Mail:</strong> info@renovirt.de
                </p>
              </section>

              {/* Registereintrag */}
              <section>
                <h3 className="text-lg font-semibold text-[#91A56E] mb-3">Registereintrag:</h3>
                <div className="space-y-2 mb-4">
                  <p>Amtsgericht Augsburg</p>
                  <p><strong>Handelsregisternummer:</strong> HRB 38388</p>
                </div>
              </section>

              {/* Umsatzsteuer-ID */}
              <section>
                <h3 className="text-lg font-semibold text-[#91A56E] mb-3">Umsatzsteuer-Identifikationsnummer:</h3>
                <p className="mb-4">
                  gemäß § 27 a Umsatzsteuergesetz: <strong>DE359733225</strong>
                </p>
              </section>

              {/* Online-Streitbeilegung */}
              <section>
                <h3 className="text-lg font-semibold text-[#91A56E] mb-3">Online-Streitbeilegung:</h3>
                <p className="mb-4">
                  <strong>Plattform der EU-Kommission zur Online-Streitbeilegung:</strong>
                </p>
                <p className="mb-4">
                  <a 
                    href="https://ec.europa.eu/consumers/odr/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-[#91A56E] hover:underline transition-colors"
                  >
                    https://ec.europa.eu/consumers/odr/
                  </a>
                </p>
                <p className="mb-4">
                  Wir sind zur Teilnahme an einem Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle nicht verpflichtet und nicht bereit.
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
                href="/privacy" 
                className="text-[#91A56E] hover:underline transition-colors"
              >
                Datenschutzerklärung
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

export default Impressum;